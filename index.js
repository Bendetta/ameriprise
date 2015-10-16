var connect = require('connect');
var serveStatic = require('serve-static');


var PUBLIC_DIR = 'public';
var port = process.env.PORT || 3000;
var app = connect();

app.use(serveStatic(PUBLIC_DIR));
app.listen(port);

console.log('Listening on ' + port);
