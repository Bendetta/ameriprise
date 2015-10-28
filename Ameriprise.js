
var HTTP = require('q-io/http');


var Ameriprise = {};


Ameriprise.URL = 'https://chat.nerdery.com/v2/room/1125/notification?auth_token=Tk2S5opSMe4JQyytYbHCUc1YMgyoH7LWIpYh2I1P';


Ameriprise.fish = function (author) {
    HTTP.request({
        method: 'POST',
        url: Ameriprise.URL,
        headers: {
            'Content-Type': 'application/json'
        },
        body: [ JSON.stringify({ message: 'got it' }) ]
    })
};


Ameriprise.hunt = function (author) {
    console.log('hunt');
};

module.exports = Ameriprise;
