import * as colors from '../game/colors.js';
import { pieceColors, pieceStrings } from '../game/shapes.js';

import { gameConfig } from '../config/game_config.js';
import { windowConfig } from '../config/window_config.js';

import Sidebar from '../game/sidebar.js';
import Shape from '../game/Shape.js';
import Grid from '../game/Grid.js';

const gameFPS = 8;
const keyFPS = 12;

const gameStates = {
    'running': 0,
    'paused': 1
}

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


        this.grid = new Grid(this, gameConfig.numRows, gameConfig.numCols);
    }
    preload() {
        this.load.image('background', '../assets/background.png')
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }
    create() {
        const [windowWidth, windowHeight] = [windowConfig.windowWidth, windowConfig.windowHeight];
        const [sidebarWidth, sidebarHeight] = [gameConfig.sidebarWidth, gameConfig.sidebarHeight];

        const gameWidth = gameConfig.gameWidth;
        const gameHeight = gameConfig.gameHeight;

        this.add.rectangle(0, 0, gameWidth, gameHeight, colors.COLOR_BLACK);

        this.sidebar = new Sidebar(this, gameWidth, 0, sidebarWidth, sidebarHeight, colors.COLOR_YELLOW);

        this.shapes = [];
        this.createNewShape();
        this.input.keyboard.on('keydown-SPACE', this.handlePause);

        this.gameState = 0;
    }
    /**
     * 
     * @param {number} time - Current time
     * @param {*} delta - Time it took from the last function call
     * @returns 
     */
    update(time, delta) {
        if (this.gameState === 1) {
            return;
        }
        this.handleKeys();
        this.updateVerticalMovement(time, delta);
        this.updateHorizontalMovement(time, delta);
    }
    /**
     * @brief Move the piece down and check whether it has hit any blocks
     *        In case there was a collision detected, add this piece to the grid using addShapeToGrid and create
     *        a new active piece with the createNewShape function
     * @param {number} time 
     * @param {number} delta 
     */
    updateVerticalMovement(time, delta) {
        this.frameTime += delta;
        if (this.frameTime > this.gameDelay) {
            if (!this.activeShape.moveDown(this.grid.array)) {
                console.log("New shape");
                this.addShapeToGrid(this.activeShape);
                this.createNewShape();
                this.handleTetris();
                this.sidebar.update({
                    'tilesSpawned': this.sidebar.tilesSpawned + 1
                })
            }
            this.sidebar.update({
                'score': this.sidebar.score + 1
            })
            this.keyBuffer = null;
            this.frameTime = 0;
        }
    }
    /**
     * @brief If the keyFrameTime has reached the delay, call shapeHorizontaMovement and shapeRotate functions which
     *        check for key presses and move/rotate the piece accordingly
     * @param {number} time 
     * @param {number} delta 
     */
    updateHorizontalMovement(time, delta) {
        this.keyFrameTime += delta;
        if (this.keyFrameTime > this.keyDelay) {
            this.shapeHorizontalMovement(this.activeShape);
            this.shapeRotate(this.activeShape);
            this.keyFrameTime = 0;
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
        else {
            this.leftDown = false;
        }
        if (this.cursorKeys.right.isDown) {
            this.leftDown = false;
            this.rightDown = true;
        }
        else {
            this.rightDown = false;
        }
        if (this.cursorKeys.up.isDown) {
            this.bottomDown = false;
            this.topDown = true;
        }
        else {
            this.topDown = false;
        }
        if (this.cursorKeys.down.isDown) {
            this.topDown = false;
            this.bottomDown = true;
        }
        else {
            this.bottomDown = false;
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
            shape.moveLeft(this.grid.array);
        }
        else if (this.rightDown) {
            shape.moveRight(this.grid.array);
        }
        this.leftDown = false;
        this.rightDown = false;
    }
    /**
     * @brief Rotate the shape clockwise - top key, anticlockwise - left key
     * @param {Shape} shape 
     */
    shapeRotate(shape) {
        if (this.topDown) {
            shape.rotateRight(this.grid.array);
        }
        this.topDown = false;
    }
    /**
     * @brief Add shape to the grid array. Take each rect contained within the shape and add it to the grid as a 1
     *        at the desired coordinates
     * @param {Shape} shape 
     */
    addShapeToGrid(shape) {
        shape.rects.forEach(rect => {
            const coordX = rect.coordX;
            const coordY = rect.coordY;
            this.grid.addToGrid(rect, coordX, coordY);
        })
        shape.rects = [];
    }
    /**
     * @brief Create new randomly selected shape and place it on the top level at random x coordinate
     */
    createNewShape() {
        const startX = Math.floor((Math.random() * (gameConfig.numCols - 3)));
        const pieceCode = this.getRandomPiece();
        const pieceColor = this.getRandomColor();

        const convertedPieceColor = colors.convertHexToColor(pieceColor);
        this.activeShape = new Shape(this, 3, 0, pieceCode, convertedPieceColor);
    }
    /**
     * @brief Check if any row/rows are fully filled and if so, rearrange the pieces accordingly
     */
    handleTetris() {
        // this means that there is a tetris
        const filledRows = this.grid.getFilledRows();
        if (filledRows.length !== 0) {
            this.grid.removeFilledRows(filledRows);
            this.grid.applyGravity();
        }
    }
    /**
     * 
     * @returns {string} Randomly selected string representing a shape
     */
    getRandomPiece() {
        return pieceStrings[Math.floor(Math.random() * pieceStrings.length)];
    }
    /**
     * @returns {number} Randomly selected color for the shape
     */
    getRandomColor() {
        return pieceColors[Math.floor(Math.random() * pieceColors.length)];
    }
    /**
     * @brief This function is called upon pressing the space bar
     */
    handlePause() {
        if (this.gameState === gameStates.running) {
            this.gameState = gameStates.paused;
            console.log("Should be paused", this.gameState);
            return;
        }
        this.gameState = gameStates.running;
    }
}