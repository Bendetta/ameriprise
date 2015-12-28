var express = require('express');
var bodyParser = require('body-parser');
var Ameriprise = require('./Ameriprise');


var PUBLIC_DIR = 'public';
var port = process.env.PORT || 3000;
var app = express();

// Static pages
app.use(express.static('public'));

// Set up request body parser
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

Ameriprise.init();

// Routes
app.post('/fish', function (req, res) {
    var message = req.body.item.message;
    var messageBody = message.message;
    var messageBodyParts = messageBody.slice(1).split(' ');
    var author = message.from.mention_name;
    if (messageBodyParts.indexOf('!trophy') !== -1) {
        Ameriprise.trophy();
    }
    if (messageBodyParts.indexOf('!fish') !== -1) {
        Ameriprise.fish(author);
    }
    if (messageBodyParts.indexOf('!hunt') !== -1) {
        Ameriprise.hunt(author);
    }
    res.json({ success: true });
});

app.listen(port);

console.log('Listening on ' + port);
