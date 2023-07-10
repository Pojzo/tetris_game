import * as pieces from '../game/shapes.js';
import * as colors from '../game/colors.js';

import { gameConfig } from '../config/game_config.js';
import { windowConfig } from '../config/window_config.js';

import Sidebar from '../game/sidebar.js';
import Shape from '../game/Shape.js';

const gameFPS = 1;
const keyFPS = 8;

export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
        this.gameDelay = 1000 / gameFPS;
        this.keyDelay = 1000 / keyFPS;

        this.frameTime = 0;
        this.keyFrameTime = 0;

        this.leftDown = false;
        this.rightDown = false;
        this.topDown = false;
        this.bottomDown = false;
    }
    preload() {
        this.load.image('background', '../assets/background.png')
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }
    create() {
        console.log(gameConfig, windowConfig);
        const [windowWidth, windowHeight] = [windowConfig.windowWidth, windowConfig.windowHeight];
        const [sidebarWidth, sidebarHeight] = [gameConfig.sidebarWidth, gameConfig.sidebarHeight];

        const gameWidth = gameConfig.gameWidth;
        const gameHeight = gameConfig.gameHeight;

        this.add.rectangle(0, 0, gameWidth, gameHeight, colors.COLOR_BLACK);

        this.sidebar = new Sidebar(this, gameWidth, 0, sidebarWidth, sidebarHeight, colors.COLOR_YELLOW);

        this.shapes = [];
        this.activeShape = new Shape(this, 0, 0, 'Z');
    }
    /**
     * 
     * @param {number} time - Current time
     * @param {*} delta - Time it took from the last function call
     * @returns 
     */
    update(time, delta) {
        this.frameTime += delta;
        this.keyFrameTime += delta;
        this.handleKeys();

        if (this.frameTime > this.gameDelay) {
            this.activeShape.moveDown();
            this.neyBuffer = null;
            this.frameTime = 0;
        }

        if (this.keyFrameTime > this.keyDelay) {
            this.shapeHorizontalMovement(this.activeShape);
            this.shapeRotate(this.activeShape);
            this.keyFrameTime = 0;
            this.resetKeys();
        }
    }

    /**
     * @brief Handle key presses, make sure the last key press is registered
     */
    handleKeys() {
        if (this.cursorKeys.left.isDown) {
            this.rightDown = false;
            this.leftDown = true;
        }
        if (this.cursorKeys.right.isDown) {
            this.leftDown = false;
            this.rightDown = true;
        }
        if (this.cursorKeys.up.isDown) {
            this.bottomDown = false;
            this.topDown = true;
        }
        if (this.cursorKeys.down.isDown) {
            this.topDown = false;
            this.bottomDown = true;
        }
    }
    /**
     * @brief Set all keys to false
     */
    resetKeys() {
        this.leftDown = false;
        this.rightDown = false;
        this.topDown = false;
        this.bottomDown = false;
    }
    /**
     * @brief Move the shape on left or right
     * @param {Shape} shape - Shape to move
     */
    shapeHorizontalMovement(shape) {
        if (this.leftDown) {
            console.log("Moving left");
            shape.moveLeft();
        }
        else if (this.rightDown) {
            shape.moveRight();
        }
    }
    /**
     * @brief Rotate the shape clockwise - top key, anticlockwise - left key
     * @param {shape} shape 
     */
    shapeRotate(shape) {
        if (this.topDown) {
            shape.rotateRight();
        }
    }
}