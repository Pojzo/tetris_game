import * as colors from '../game/colors.js';
import { pieceColors, pieceStrings } from '../game/shapes.js';
import { gameConfig } from '../config/game_config.js';
import { windowConfig } from '../config/window_config.js';

import Sidebar from '../game/sidebar.js';
import { ActiveShape, GhostShape } from '../game/Shape.js';
import Grid from '../game/Grid.js';

/**
 * gameFPS - how often the vertical movement is updated - piece falling down
 * horizontalKeyFPS - how often the game checks if the left or right key have been pressed,
 *                    basically controls the vertical speed of the piece
 * verticalKeyFPS - how often the game checks if the bottom arrow has been pressed, controlling the speed at which the 
 *                  piece can be moved down
 */
let gameFPS = 1.5;
const horizontalKeyFPS = 12;
const verticalKeyFPS = 20;
const shapeBufferLen = 4;

const gameStates = {
    'running': 0,
    'paused': 1
}

export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
        this.gameDelay = 1000 / gameFPS;
        this.horizontalKeyDelay = 1000 / horizontalKeyFPS;
        this.verticalKeyDelay = 1000 / verticalKeyFPS;
        this.grid = new Grid(this);
    }
    init() {
        this.scene.start('game-over', {
            score: 50,
            level: 0,
            tiles: 25
        })
        this.gameFrameTime = 0;
        this.horizontalKeyFrameTime = 0;
        this.verticalKeyFrameTime = 0;

        this.timeLeftFirstPressed = -1;
        this.timeRightFirstPressed = -1;
        this.timeDownFirstPressed = -1;

        this.leftDown = false;
        this.rightDown = false;
        this.topDown = false;
        this.bottomDown = false;

        this.gameState = 0;

        this.shapeBuffer = [];

        this.grid.resetGrid();
        this.activeShape = null;
        this.ghostShape = null;
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
        this.grid.drawGridLines();

        this.sidebar = new Sidebar(this, gameWidth, 0, sidebarWidth, sidebarHeight, colors.COLOR_GRAY);

        this.expandShapeBuffer();
        this.setActiveShape();

        this.cursorKeys = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-SPACE', () => this.handleKeys('space'), this);
        this.input.keyboard.on('keydown-UP', () => this.handleKeys('up'), this);
        this.input.keyboard.on('keydown-ESC', () => this.handleKeys('esc'), this);
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
        this.handleCursorKeys(time);
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
        // this is just normal piece movement down
        this.gameFrameTime += delta;
        if (this.gameFrameTime > this.gameDelay) {
            this.shapeMoveDown(this.activeShape);
            this.gameFrameTime = 0;
        }

        this.verticalKeyFrameTime += delta;
        if (this.verticalKeyFrameTime > this.verticalKeyDelay) {
            this.shapeVerticalMovement(this.activeShape, time);
            this.verticalKeyFrameTime = 0;
        }
    }
    /**
     * @brief If the keyFrameTime has reached the delay, call shapeHorizontaMovement and shapeRotate functions which
     *        check for key presses and move/rotate the piece accordingly
     * @param {number} time 
     * @param {number} delta 
     */
    updateHorizontalMovement(time, delta) {
        this.horizontalKeyFrameTime += delta;
        if (this.horizontalKeyFrameTime > this.horizontalKeyDelay) {
            this.shapeHorizontalMovement(this.activeShape, time);
            this.horizontalKeyFrameTime = 0;
        }
    }

    /**
     * @brief Handle key presses, make sure the last key press is registered
     * @param {string} key - String representation of the key that was pressed
     */
    handleKeys(key) {
        switch (key) {
            case 'up':
                this.shapeRotate(this.activeShape);
                break;
            case 'down':
                this.shapeMoveDown(this.activeShape);
                break;
            case 'esc':
                this.scene.pause();
                this.scene.launch('menu');
                break;
        }
    }
    handleCursorKeys(time) {
        if (this.cursorKeys.left.isDown) {
            this.leftDown = true;
            this.rightDown = false;
            if (this.timeLeftFirstPressed === -1) {
                this.timeLeftFirstPressed = time;
            }
        }
        else {
            this.timeLeftFirstPressed = -1;
        }
        if (this.cursorKeys.right.isDown) {
            this.rightDown = true;
            this.leftDown = false;
            if (this.timeRightFirstPressed === -1) {
                this.timeRightFirstPressed = time;
            }
        }
        else {
            this.timeRightFirstPressed = -1;
        }
        if (this.cursorKeys.down.isDown) {
            this.bottomDown = true;
            if (this.timeDownFirstPressed === -1) {
                this.timeDownFirstPressed = time;
            }
        }
        else {
            this.timeDownFirstPressed = -1;
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
    shapeHorizontalMovement(shape, time) {
        // this is ugly I'm aware
        if (this.leftDown) {
            const deltaFromFirstPress = time - this.timeLeftFirstPressed;
            if (time - deltaFromFirstPress > this.horizontalKeyDelay * 2) {
                const canMoveLeft = shape.moveLeft(this.grid.array);
                if (canMoveLeft) {
                    this.ghostShape.updateAfterMovingLeft(this.grid.array);
                }
                this.leftDown = false;
            }
        }
        else if (this.rightDown) {
            const deltaFromFirstPress = time - this.timeRightFirstPressed;
            if (time - deltaFromFirstPress > this.horizontalKeyDelay * 2) {
                const canMoveRight = shape.moveRight(this.grid.array);
                if (canMoveRight) {
                    this.ghostShape.updateAfterMovingRight(this.grid.array);
                }
                this.rightDown = false;
            }
        }
        this.leftDown = false;
        this.rightDown = false;
        this.updateGhostShape(shape);
    }
    /**
     * 
     * @param {Phaser.GameObjects} shape 
     * @param {number} time 
     */
    shapeVerticalMovement(shape, time) {
        if (this.bottomDown) {
            const deltaFromFirstPress = time - this.timeDownFirstPressed;
            if (time - deltaFromFirstPress > this.verticalKeyDelay * 2) {
                this.shapeMoveDown(this.activeShape);
                this.bottomDown = false;
            }
        }
    }
    /**
     * @brief Create a transparent piece at the destination of a piece to make it more clear where it's going to land
     * @param {Shape} shape
     */
    updateGhostShape(shape) {
        // shape.updateGhostPiece();
    }
    /**
      * @brief Rotate the shape clockwise - top key, anticlockwise - left key
      * @param {Shape} shape 
      */
    shapeRotate(shape) {
        const canRotate = shape.rotateRight(this.grid.array);
        if (canRotate) {
            this.ghostShape.destroyShape();
            this.ghostShape.buildShape(this.grid.array, this.activeShape);
        }
    }

    shapeMoveDown(shape) {
        if (!shape.moveDown(this.grid.array)) {
            this.checkGameOver();
            this.addShapeToGrid(this.activeShape);
            this.updateDifficulty();
            this.expandShapeBuffer();
            this.setActiveShape();
            this.handleTetris();
            this.sidebar.update({
                'tilesSpawned': this.sidebar.tilesSpawned + 1
            })

        }
        this.sidebar.update({
            'score': this.sidebar.score + this.sidebar.level
        })
        this.frameTime = 0;
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
     * @brief Expand the shape buffer so that it's full
     */
    expandShapeBuffer() {
        while (this.shapeBuffer.length !== shapeBufferLen) {
            const shape = this.createNewShape();
            this.shapeBuffer.push(shape);
        }
        this.sidebar.setNextShapes(this.shapeBuffer.slice(1));
    }

    /**
     * @brief Create new randomly selected shape and place it on the top level at random x coordinate
     */
    createNewShape() {
        const startX = Math.floor((Math.random() * (gameConfig.numCols - 3)));
        const pieceCode = this.getRandomPiece();
        const pieceColor = this.getRandomColor();

        const convertedPieceColor = colors.convertRGBToColor(pieceColor);
        const newShape = new ActiveShape(this, 3, 0, pieceCode, convertedPieceColor);

        return newShape;
    }
    /**
     * 
     */
    setActiveShape() {
        if (this.ghostShape !== null) {
            this.ghostShape.destroyShape();
        }
        const newShape = this.shapeBuffer.shift();
        this.activeShape = newShape;
        const originCoordX = this.activeShape.originCoordX;
        const originCoordY = this.activeShape.originCoordY;

        this.activeShape.destroyShape();
        this.activeShape.buildShape(originCoordX, originCoordY);

        this.ghostShape = new GhostShape(this, this.activeShape.shapeCode);
        this.ghostShape.buildShape(this.grid.array, this.activeShape);
    }

    /**
     * @brief Check if any row/rows are fully filled and if so, rearrange the pieces accordingly
     */
    handleTetris() {
        // this means that there is a tetris
        let filledRow = this.grid.getFirstFilledRow();
        while (filledRow !== null) {
            this.grid.removeRow(filledRow);
            this.grid.applyGravity(filledRow);
            filledRow = this.grid.getFirstFilledRow();
            this.sidebar.update({
                'score': this.sidebar.score + this.sidebar.level * 200
            })
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
            return;
        }
        this.gameState = gameStates.running;
    }
    updateDifficulty() {
        if (this.sidebar.tilesSpawned !== 0 && this.sidebar.tilesSpawned % 10 === 0) {
            gameFPS += 0.15;
            const currentLevel = this.sidebar.level;
            this.sidebar.update({
                'level': currentLevel + 1
            })
            this.gameDelay = 1000 / gameFPS;
        }
    }

    /**
     * @brief Check if the game is over by calling the shape.isAtCeiling() function
     */
    checkGameOver() {
        if (this.activeShape.isAtCeiling()) {
            this.scene.start('game-over', {
                'score': this.sidebar.score,
                'level': this.sidebar.level,
                'tilesSpawned': this.sidebar.tilesSpawned
            })
        }
    }
}

class Controller {
    registerKeys(context, callback) {
        this.input.keyboard.on('keydown-SPACE', () => callback('space'), context);
        this.input.keyboard.on('keydown-SPACE', () => callback('space'), context);
        this.input.keyboard.on('keydown-UP', () => callback('up'), context);
        this.input.keyboard.on('keydown-DOWN', () => callback('down'), context);
        this.input.keyboard.on('keydown-LEFT', () => callback('left'), context);
        this.input.keyboard.on('keydown-RIGHT', () => callback('right'), context);
    }
}