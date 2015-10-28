
var Q = require('q');
var HTTP = require('q-io/http');
var ArrayUtil = require('./ArrayUtil');
var data = require('./data.json');


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
    return Q.delay(Ameriprise.delay.base + Ameriprise.delay.range * Math.random())
};


Ameriprise.fish = function (author) {
    var message = author + ' casts their line...';
    return Ameriprise.post(message)
        .then(Ameriprise.randomDelay)
        .then(function () {
            var message;
            var weight;
            if (Math.random() < Ameriprise.probabilityOfSuccess.fish) {
                weight = Math.round( 0.000001 * Math.pow(Math.random() * 1000, 3) );
                message = author + ' caught a ' + weight + ' lb. ' + ArrayUtil.random(data.fish.adjectives) + ArrayUtil.random(data.fish.nouns) + '!';
            } else {
                message = author + ' doesn\'t catch anything. Better luck next time, ' + author + '.';
            }
            return Ameriprise.post(message);
        });
};


Ameriprise.hunt = function (author) {
    var message = author + ' hears a rustling in the bushes...';
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


module.exports = Ameriprise;
