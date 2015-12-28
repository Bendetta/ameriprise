'use strict';

var Q = require('q');
var HTTP = require('q-io/http');
var ArrayUtil = require('./ArrayUtil');
var data = require('./data.json');
var fs = require('fs');

var Ameriprise = {

};


Ameriprise.URL = 'https://chat.nerdery.com/v2/room/1125/notification?auth_token=Tk2S5opSMe4JQyytYbHCUc1YMgyoH7LWIpYh2I1P';

Ameriprise.delay = {
    base: 500,
    range: 2000
};

Ameriprise.probabilityOfSuccess = {
    fish: 0.6,
    hunt: 0.4
};


var _previousHunter = null;
var _previousFisher = null;
var _trophies = null;


Ameriprise.init = function () {
    _trophies = Ameriprise.getTrophyData();
};


Ameriprise.getTrophyData = function () {
    return JSON.parse(fs.readFileSync('trophies.json', { encoding: 'utf8' }));
};


Ameriprise.saveTrophyData = function () {
    fs.writeFileSync('trophies.json', JSON.stringify(_trophies));
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


Ameriprise.fish = function (author) {
    if (_previousFisher === author) {
        return Ameriprise.post('Stop hogging all the best pitches ' + author + ', let someone else try first!');
    }
    var message = author + ' casts their line...';
    _previousFisher = author;
    return Ameriprise.post(message)
        .then(Ameriprise.randomDelay)
        .then(function () {
            var posts = [];
            var weight;
            var item;
            var previousTrophy;
            if (Math.random() < Ameriprise.probabilityOfSuccess.fish) {
                weight = Math.round( 0.000001 * Math.pow(Math.random() * 1000, 3) );
                item = ArrayUtil.random(data.fish.adjectives) + ArrayUtil.random(data.fish.nouns);
                posts.push(Ameriprise.post(author + ' caught a ' + weight + ' lb. ' + item + '!'));
                if (weight > _trophies.fish.weight) {
                    previousTrophy = _trophies.fish;
                    _trophies.fish = {
                        author: author,
                        weight: weight,
                        item: item
                    };
                    Ameriprise.saveTrophyData();
                    posts.push(Ameriprise.post('@' + author + ' Wow!!! That\'s a new record! Way to go! Type /!trophy to see it!'));
                    if (previousTrophy.item !== null) {
                        posts.push(Ameriprise.post('@here Wow! That breaks the old record of a ' + previousTrophy.weight + 'lb. ' + previousTrophy.item + '!'));
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
        .then(function () {
            var message;
            var weight;
            if (Math.random() < Ameriprise.probabilityOfSuccess.hunt) {
                weight = Math.round( 0.000001 * Math.pow(Math.random() * 1500, 3) );
                message = author + ' caught a ' + weight + ' lb. ' + ArrayUtil.random(data.hunt.adjectives) + ArrayUtil.random(data.hunt.nouns) + '!';
            } else {
                message = author + ' must\'ve spooked it. There\'s always next time, ' + author + '.';
            }
            return Ameriprise.post(message);
        });
};


Ameriprise.trophy = function () {
    // return $.when(
        // Ameriprise.post($fishman + ' holds the fishing record when they caught a ' + $bigfish$scale $fishtype);
        // Ameriprise.post($huntman + ' holds the hunting record when they bagged a ' + $bighunt$scale $hunttype);
    // );
};


module.exports = Ameriprise;
