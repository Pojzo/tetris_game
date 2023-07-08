import Game from './scenes/Game.js';
import { windowConfig } from './config/window_config.js';

console.log(Phaser);

const windowWidth = windowConfig.windowWidth;
const windowHeight = windowConfig.windowHeight;

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: windowWidth,
    height: windowHeight,
    scene: [Game],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
})