var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
const PORT = 8080;

app.set('port', PORT);
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

// Serve static files
app.use('/main.js', express.static(path.join(__dirname, 'src', 'main.js')));
app.use('/index.css', express.static(path.join(__dirname, 'index.css')));
app.use('/lib', express.static(path.join(__dirname, 'src', 'lib')));
app.use('/scenes', express.static(path.join(__dirname, 'src', 'scenes')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/phaser3-rex-plugins', express.static(path.join(__dirname, 'node_modules, phaser3-rex-plugins')));
app.use('/game', express.static(path.join(__dirname, 'src', 'game')));
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));
app.use('/config', express.static(path.join(__dirname, 'src', 'config')))

var server = http.createServer(app);

server.listen(app.get('port'), () => {
    console.log('Web server listening on port ', + app.get('port'));
});