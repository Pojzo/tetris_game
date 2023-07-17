const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('Scoreboard');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS game_results (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname TEXT, score INTEGER, level INTEGER, tiles INTEGER)');
});

db.serialize(() => {
    const dummyName = "test";
    const dummyScore = 2000;
    const dummyLevel = 2;
    const dummyTiles = 15;
    db.run('INSERT INTO game_results (nickname, score, level, tiles) VALUES (?, ?, ?, ?)', [dummyName, dummyScore, dummyLevel, dummyTiles]);
})

db.serialize(() => {
    db.all('SELECT * FROM game_results', (err, rows) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows);
        }
    })
})
db.close();