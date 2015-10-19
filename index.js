var express = require('express');
var bodyParser = require('body-parser')


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

// Routes
app.post('/test', function (req, res) {
    console.log(req.body);
    res.send();
});

app.listen(port);

console.log('Listening on ' + port);
