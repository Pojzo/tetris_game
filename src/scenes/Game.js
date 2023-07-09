import * as pieces from '../game/pieces.js';
import * as colors from '../game/colors.js';
import { gameConfig } from '../config/game_config.js';
import { windowConfig } from '../config/window_config.js';
import Sidebar from '../game/sidebar.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }
    preload() {
        this.load.image('background', '../assets/background.png')
    }
    create() {
        console.log(gameConfig, windowConfig);
        const [windowWidth, windowHeight] = [windowConfig.windowWidth, windowConfig.windowHeight];
        const [numCols, numRows] = [gameConfig.numCols, gameConfig.numRows];
        const [rectWidth, rectHeight] = [gameConfig.rectWidth, gameConfig.rectHeight];
        const [sidebarWidth, sidebarHeight] = [gameConfig.sidebarWidth, gameConfig.sidebarHeight];

        const gameWidth = gameConfig.gameWidth;
        const gameHeight = gameConfig.gameHeight;

        console.log(rectWidth, rectHeight);
        this.add.rectangle(0, 0, gameWidth, gameHeight, colors.COLOR_BLACK);

        this.sidebar = new Sidebar(this, gameWidth, 0, sidebarWidth, sidebarHeight, colors.COLOR_YELLOW);
    }
}