'use strict';

var Q = require('q');
var HTTP = require('q-io/http');
var ArrayUtil = require('./ArrayUtil');
var data = require('./data.json');
var fs = require('fs');
var database = require('./Database');


var Ameriprise = {

};


Ameriprise.URL = 'https://chat.nerdery.com/v2/room/1125/notification?auth_token=Tk2S5opSMe4JQyytYbHCUc1YMgyoH7LWIpYh2I1P';

Ameriprise.delay = {
    base: 1000,
    range: 2000
};

Ameriprise.probabilityOfSuccess = {
    fish: 0.6,
    hunt: 0.4
};


var _previousHunter = null;
var _previousFisher = null;


Ameriprise.getTrophyData = function () {
    var deferred = Q.defer();
    
    if (Ameriprise.cachedTrophies) {
        deferred.resolve(Ameriprise.cachedTrophies);
    } else {
        database.getTrophies().
        then(function(data) {
            Ameriprise.cachedTrophies = data;
            deferred.resolve(data);
        })
    }    
    
    return deferred.promise;
};


Ameriprise.saveTrophyData = function (trophies) {
    var deferred = Q.defer(); 
        
    database.saveTrophies(trophies)
    .then(function(result) {
        Ameriprise.cachedTrophies = trophies;
        deferred.resolve();
    });
    
    return deferred.promise;
};


Ameriprise.post = function (message) {
    return HTTP.request({
        method: 'POST',
        url: Ameriprise.URL,
        headers: {
            'Content-Type': 'application/json'
        },
        body: [
            JSON.stringify({
                message: message
            })
        ]
    });
};


Ameriprise.randomDelay = function () {
    return Q.delay(Ameriprise.delay.base + Ameriprise.delay.range * Math.random());
};

Ameriprise.getRandomWeight = function (currentTrophyWeight) {
    // Can only break the current trophy by 10 lbs
    return 1 + Math.round( Math.random() * (currentTrophyWeight + 10) );
}

Ameriprise.fish = function (author) {
    if (_previousFisher === author) {
        return Ameriprise.post('Stop hogging all the best pitches ' + author + ', let someone else try first!');
    }
    var message = author + ' casts their line...';
    _previousFisher = author;
    return Ameriprise.post(message)
        .then(Ameriprise.randomDelay)
        .then(Ameriprise.getTrophyData)
        .then(function (trophies) {
            var posts = [];
            var weight;
            var item;
            var previousTrophy;
            if (Math.random() < Ameriprise.probabilityOfSuccess.fish) {
                weight = Ameriprise.getRandomWeight(trophies.fish.weight);
                item = ArrayUtil.random(data.fish.adjectives) + ArrayUtil.random(data.fish.nouns);
                posts.push(Ameriprise.post(author + ' caught a ' + weight + ' lb. ' + item + '!'));
                if (weight > trophies.fish.weight) {
                    previousTrophy = trophies.fish;
                    trophies.fish = {
                        author: author,
                        weight: weight,
                        item: item
                    };
                    Ameriprise.saveTrophyData(trophies);
                    posts.push(Ameriprise.post('@' + author + ' Wow!!! That\'s a new record! Way to go! Type /!trophy to see it!'));
                    if (previousTrophy.item !== null) {
                        posts.push(Ameriprise.post('@here Wow! That breaks the old record of a ' + previousTrophy.weight + 'lb. ' + previousTrophy.item + '! ' + author + ' is amazing!'));
                    }
                }
            } else {
                posts.push(Ameriprise.post(author + ' doesn\'t catch anything. Better luck next time, ' + author + '.'));
            }
            return Q.all(posts);
        });
};


Ameriprise.hunt = function (author) {
    if (_previousHunter === author) {
        return Ameriprise.post('Stop hogging all the best pitches ' + author + ', let someone else try first!');
    }
    var message = author + ' hears a rustling in the bushes...';
    _previousHunter = author;
    return Ameriprise.post(message)
        .then(Ameriprise.randomDelay)
        .then(Ameriprise.getTrophyData)
        .then(function (trophies) {
            var posts = [];
            var weight;
            var item;
            var previousTrophy;
            if (Math.random() < Ameriprise.probabilityOfSuccess.hunt) {
                weight = Ameriprise.getRandomWeight(trophies.hunt.weight);
                item = ArrayUtil.random(data.hunt.adjectives) + ArrayUtil.random(data.hunt.nouns);
                posts.push(Ameriprise.post(author + ' caught a ' + weight + ' lb. ' + item + '!'));
                if (weight > trophies.hunt.weight) {
                    previousTrophy = trophies.hunt;
                    trophies.hunt = {
                        author: author,
                        weight: weight,
                        item: item
                    };
                    Ameriprise.saveTrophyData(trophies);
                    posts.push(Ameriprise.post('@' + author + ' Wow!!! That\'s a new record! Way to go! Type /!trophy to see it!'));
                    if (previousTrophy.item !== null) {
                        posts.push(Ameriprise.post('@here Brilliant! That breaks the old record of a ' + previousTrophy.weight + 'lb. ' + previousTrophy.item + '! ' + author + ' is the world\'s best!'));
                    }
                }
            } else {
                posts.push(Ameriprise.post(author + ' must\'ve spooked it. There\'s always next time, ' + author + '.'));
            }
            return Q.all(posts);
        });
};


Ameriprise.trophy = function () {
    return Ameriprise.getTrophyData().then(function (trophies) {
        var bigfish = trophies.fish;
        var bighunt = trophies.hunt;
        return Q.all([
            Ameriprise.post(bigfish.author + ' holds the fishing record when they caught a ' + bigfish.weight + 'lb. ' + bigfish.item),
            Ameriprise.post(bighunt.author + ' holds the hunting record when they bagged a ' + bighunt.weight + 'lb. ' + bighunt.item)
        ]);
    });
};


module.exports = Ameriprise;
