import { gameConfig } from "../config/game_config.js";
import * as colors from './colors.js';
import ShapeRect from "./ShapeRect.js";

export default class Grid {
    /**
     * 
     * @param {Phaser.Scene} scene
     * @param {number} rows
     * @param {number} cols
     */
    constructor(scene) {
        this.scene = scene;

        this.rows = gameConfig.numRows;
        this.cols = gameConfig.numCols;

        this.array = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.rectArray = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    }
    /**
     * @brief Reset the grid to default values - all zeros and if there are any rect objects, destroy them
     */
    resetGrid() {
        this.array = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const rect = this.rectArray[i][j];
                if (rect !== null) {
                    rect.setVisible(false).setActive(false);
                    this.rectArray[i][j] = null;
                }
            }
        }
    }
    /**
     * @brief Draw vertical and horizontal lines across the grid
     */
    drawGridLines() {
        const rectWidth = gameConfig.rectWidth;
        const rectHeight = gameConfig.rectHeight;

        const gameWidth = gameConfig.gameWidth;
        const gameHeight = gameConfig.gameHeight;

        for (let i = 0; i < this.rows; i++) {
            this.scene.add.line(0, 0, 0, i * rectHeight, gameWidth, i * rectHeight)
                .setStrokeStyle(1, colors.COLOR_GRAY)
                .setAlpha(0.5)
                .setOrigin(0, 0);
        }

        for (let j = 0; j < this.cols; j++) {
            this.scene.add.line(0, 0, j * rectWidth, 0, j * rectWidth, gameHeight)
                .setStrokeStyle(1, colors.COLOR_GRAY)
                .setAlpha(0.5)
                .setOrigin(0, 0);
        }
    }
    /**
     * @brief Change the value at the coodinates to one in this.array. Create a copy of rect and add it to
     *        this.rectArray at given coordinates        
     * @param {ShapeRect} rect 
     * @param {number} coordX 
     * @param {number} coordY 
     */
    addToGrid(rect, coordX, coordY) {
        this.array[coordY][coordX] = 1;
        this.rectArray[coordY][coordX] = rect;
    }
    /**
     * @brief Checks if the array has any row filled with ones
     * @returns {Array} Array of row indeces which contain only ones
     */
    getFirstFilledRow() {
        for (let i = this.rows - 1; i > 0; i--) {
            let onesOnly = true;
            for (let j = 0; j < this.cols; j++) {
                if (this.array[i][j] == 0) {
                    onesOnly = false;
                    break;
                }
            }
            if (onesOnly) {
                return i;
            }
        }
        return null;
    }
    /**
     * @brief Change rows that have all ones to all zeros. Destroy all rect objects that are in the rows given by indeces
     * @param {Array[]} indeces - Array of indeces of rows that contain only ones
     */
    removeRow(index) {
        const destroyRectRow = row => {
            for (let i = 0; i < this.cols; i++) {
                this.rectArray[row][i].setVisible(false).setActive(false);
                this.rectArray[row][i] = null;
            }
        }
        this.array[index].fill(0);
        destroyRectRow(index);
    }
    /**
     * 
     */
    applyGravity(row) {
        for (let j = 0; j < this.rows; j++) {
            for (let i = row - 1; i > 0; i--) {
                if (this.array[i][j] === 1) {
                    this.array[i][j] = 0;
                    this.array[i + 1][j] = 1;
                    const rect = this.rectArray[i][j];
                    /*
                    rect.coordX = j;
                    rect.coordY = i + 1;
                    rect.updatePosition();
                    */
                    rect.updatePositionAnimation(j, i + 1);
                    this.rectArray[i][j] = null;
                    this.rectArray[i + 1][j] = rect;
                }
            }
        }
    }
}