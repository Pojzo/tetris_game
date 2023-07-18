var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var sqlite3 = require('sqlite3');

var app = express();
const PORT = 8080;

app.set('port', PORT);
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})


app.use('/main.js', express.static(path.join(__dirname, 'src', 'main.js')));
app.use('/lib', express.static(path.join(__dirname, 'src', 'lib')));
app.use('/scenes', express.static(path.join(__dirname, 'src', 'scenes')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/phaser3-rex-plugins', express.static(path.join(__dirname, 'node_modules/phaser3-rex-plugins')));
app.use('/game', express.static(path.join(__dirname, 'src', 'game')));
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));
app.use('/config', express.static(path.join(__dirname, 'src', 'config')))

app.get('/api/score', (req, res) => {
    db.all('SELECT * FROM game_results', (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to fetch score from the database' });
        }
        else {
            res.json(rows);
        }
    })
})

var dbPath = path.join(__dirname, 'Scoreboard.db');
var db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error('Failed to connect to the database', err.message);
    }
    else {
        console.log('Connected to the database.');
    }
});
var server = http.createServer(app);

server.listen(app.get('port'), () => {
    console.log('Web server listening on port ', + app.get('port'));
});

server.on('close', () => {
    db.close(err => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
    })
});