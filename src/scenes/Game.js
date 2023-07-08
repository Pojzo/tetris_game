import * as pieces from '../game/pieces.js';
import { gameConfig } from '../config/game_config.js';
import { windowConfig } from '../config/window_config.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }
    preload() {
        this.load.image('background', '../assets/background.png')
    }
    create() {
        const [windowWidth, windowHeight] = [windowConfig.windowWidth, windowConfig.windowHeight];
        const [numCols, numRows] = [gameConfig.numCols, gameConfig.numRows];
        const [rectWidth, rectHeight] = [gameConfig.rectWidth, gameConfig.rectHeight];

        const gameWidth = gameConfig.gameWidth;
        const gameHeight = gameConfig.gameHeight;

        console.log(rectWidth, rectHeight);
        const green = Phaser.Display.Color.GetColor(0, 255, 0)
        const red = Phaser.Display.Color.GetColor(255, 0, 0)
        console.log(green, red);
        this.add.image(0, 0, 'background').setScrollFactor(0, 0);

        for (let i = 0; i < numRows; i++) {
            let y = i * rectHeight;
            for (let j = 0; j < numCols; j++) {
                let x = j * rectWidth;
                this.add.rectangle(x, y, rectWidth, rectHeight, red)
                    .setStrokeStyle(2)
                    .setOrigin(0, 0);

                console.log(x, y);
            }
        }
    }
}