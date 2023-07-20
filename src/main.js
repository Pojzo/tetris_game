import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';
import Menu from './scenes/Menu.js';
import Scoreboard from './scenes/Scoreboard.js';
import { windowConfig } from './config/window_config.js';

console.log(Phaser);

const windowWidth = windowConfig.windowWidth;
const windowHeight = windowConfig.windowHeight;

let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: windowWidth,
    height: windowHeight,
    scene: [Game, GameOver, Menu, Scoreboard],
    fps: 10,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
})

window.game = game;