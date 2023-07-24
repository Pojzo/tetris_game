
# Overview

Tetris game writte in Javascript using the Phaser3 framework.
As of 24.7.2023, the code has ~1800 SLOC, ~450 comment lines and ~230 blank lines.

## Languages
* Javascript
* Typescript

## Technologies
* nodeJS
* express.js - http server
* Phaser - graphics framework
* Firebase - cloud database

## Features
* Menu accessible by pressing ESC 
* Turn music and sound effects on and off
* Result of a game can be saved to a firebase database
* View the leaderboard with live results of other player's games

 # Installation
```
git clone https://github.com/Pojzo/tetris_game
cd tetris_game
npm install
node .
```
Before running the node command, `api_config.js` has to be placed inside the config folder. It should contain firebase configuration object in this format: 
```js
export const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
```