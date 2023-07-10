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
}