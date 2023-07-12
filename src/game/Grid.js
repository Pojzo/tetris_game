import { gameConfig } from "../config/game_config.js";
import ShapeRect from "./ShapeRect.js";

export default class Grid {
    /**
     * 
     * @param {Phaser.Scene} scene
     * @param {number} rows
     * @param {number} cols
     */
    constructor(scene, rows, cols) {
        this.scene = scene;
        this.rows = rows;
        this.cols = cols;

        this.array = Array(rows).fill().map(() => Array(cols).fill(0));
        this.rectArray = Array(rows).fill().map(() => Array(cols).fill(null));
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
    getFilledRows() {
        let filledRows = [];
        for (let i = this.rows - 1; i > 0; i--) {
            let onesOnly = true;
            for (let j = 0; j < this.cols; j++) {
                if (this.array[i][j] == 0) {
                    onesOnly = false;
                    break;
                }
            }
            if (onesOnly) {
                filledRows.push(i);
            }
        }
        return filledRows;
    }
    /**
     * @brief Change rows that have all ones to all zeros. Destroy all rect objects that are in the rows given by indeces
     * @param {Array[]} indeces - Array of indeces of rows that contain only ones
     */
    removeFilledRows(indeces) {
        const destroyRectRow = row => {
            for (let i = 0; i < this.cols; i++) {
                this.rectArray[row][i].setVisible(false).setActive(false);
                this.rectArray[row][i] = null;
            }
        }
        indeces.forEach(index => {
            this.array[index].fill(0);
            destroyRectRow(index);
        })
    }
    /**
     * 
     */
    applyGravity() {
        for (let j = 0; j < this.cols; j++) {
            // this stores the ones in reversed order from the bottom to top
            let rectsInOrder = [];
            for (let i = this.rows - 1; i > 0; i--) {
                if (this.array[i][j] === 1) {
                    rectsInOrder.push(this.rectArray[i][j]);
                }
                this.array[i][j] = 0;
                this.rectArray[i][j] = null;
            }
            let startY = this.rows - 1;

            while (rectsInOrder.length !== 0) {
                this.array[startY][j] = 1;
                const rect = rectsInOrder.pop();
                this.rectArray[startY][j] = rect;
                rect.coordX = j;
                rect.coordY = startY;
                rect.updatePosition();

                startY--;
            }
        }
        const newIndeces = this.getFilledRows();
        if (newIndeces.length !== 0) {
            this.applyGravity();
        }
    }
}