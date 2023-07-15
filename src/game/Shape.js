import { gameConfig } from '../config/game_config.js';
import * as shapes from './shapes.js';
import * as colors from './colors.js';
import ShapeRect from './ShapeRect.js';

export default class Shape {
    /**
     * 
     * @param {Phaser.Scene} scene - Phaser.Scene object
     * @param {number} x - Horizontal position in the grid
     * @param {number} y - Vertical position in the grid
     * @param {string} shapeCode - String representation of the shape
     */
    constructor(scene, x, y, shapeCode, color) {

        this.scene = scene;
        this.shapeCode = shapeCode;
        this.color = color;

        this.rectWidth = gameConfig.rectWidth;
        this.rectHeight = gameConfig.rectHeight;

        this.transformationIndex = 0;

        // store the coordinates of the top left of the piece matrix
        this.originCoordX = x;
        this.originCoordY = y;

        this.rects = []
        this.shapeTransformations = shapes[this.shapeCode];
    }
    /**
     * 
     * @param {number} x Starting x position of the shape
     * @param {*} y Starting y position of the shape
     * @returns Null if the shape doesn't exist
     * 
     */
    buildShape(gridOffsetX, gridOffsetY) {
        const curTransformation = this.shapeTransformations[this.transformationIndex];

        const rows = curTransformation.length;
        const cols = curTransformation[0].length;

        let skipX;
        let skipY = 0;

        const offsetX = gridOffsetX * this.rectWidth;
        const offsetY = gridOffsetY * this.rectHeight;

        for (let i = 0; i < rows; i++) {
            skipX = 0;
            for (let j = 0; j < cols; j++) {
                if (curTransformation[i][j] == 0) {
                    skipX += this.rectWidth;
                    continue;
                }
                const rect = new ShapeRect(this.scene, offsetX + skipX, offsetY + skipY, this.originCoordX + j, this.originCoordY + i, this.rectWidth, this.rectHeight, this.color).setOrigin(0, 0);
                this.rects.push(rect);
                skipX += this.rectWidth;
            }
            skipY += this.rectHeight;
        }
        this.scene.add.existing(this.rects);
    }
    /**
     * @brief Build and place the shape at the given x and y coordinates. this.buildShape() creates the shape in the game 
     *        based on this.originCoordX and this.originCoordY. This function was created to create a shape outside of the game 
     *        and in a different scene;
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     */
    buildShapeRectsAtPosition(scene, x, y, rectWidth, rectHeight) {
        // when building on a given position, we should build from the first filled and not from the origin
        const cutShapeString = this.shapeCode + "Cut";
        const cutShape = shapes[cutShapeString];

        console.log(this.shapeCode);
        const rows = cutShape.length;
        const cols = cutShape[0].length;

        let rects = [];

        let skipX, skipY = 0;
        for (let i = 0; i < rows; i++) {
            skipX = 0;
            for (let j = 0; j < cols; j++) {
                if (cutShape[i][j] == 0) {
                    skipX += rectWidth;
                    continue;
                }
                const rect = new ShapeRect(scene, skipX + x, skipY + y, j, i, rectWidth, rectHeight, this.color).setOrigin(0, 0);
                console.log(rect.width);

                rects.push(rect);
                skipX += rectWidth;
            }
            skipY += rectHeight;
        }
        return rects;
    }
    /**
     * @brief Destroy all rects of a shape
     */
    destroyShape() {
        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
            rect.setActive(false).setVisible(false);
        }
        this.rects = [];
    }
    /**
     * 
     * @param {Array[]} gridMatrix - 
     * @return {boolean} True if the shape was able to move down by one row
     * @brief Try to move the shape down. If it's not possible due to other shape being present below
     *        the shape, return false
     */
    moveDown(gridMatrix) {
        if (this.isAtBottom()) {
            return false;
        }
        const collision = this.detectCollision(gridMatrix, 0, 1);
        if (collision === true) {
            console.log("Collision at", this.originCoordX, this.originCoordY);
            return false;
        }
        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
            rect.y += gameConfig.rectHeight;
            rect.coordY += 1;
        }
        this.originCoordY += 1;
        return true;
    }
    /**
     * 
     * @brief If possible, move the shape to the left
     * @returns False if it wasn't possible for the shape to move left
     */
    moveLeft(gridMatrix) {
        if (!this.canMoveLeft() || this.isAtBottom() || this.detectCollision(gridMatrix, -1, 0)) {
            return false;
        }
        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
            rect.x -= gameConfig.rectWidth;
            rect.coordX -= 1;
        }

        this.originCoordX -= 1;
        return true;
    }
    /**
     * @brief If possible, move the shape to the right
     * @returns False if it wasn't possible for the shape to move right
     */
    moveRight(gridMatrix) {
        if (!this.canMoveRight() || this.isAtBottom() || this.detectCollision(gridMatrix, 1, 0)) {
            return false;
        }
        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
            rect.x += gameConfig.rectWidth;
            rect.coordX += 1;
        }
        this.originCoordX += 1;
        return true;
    }
    /**
  * 
  * @brief If possible, rotate the shape to the right
  */
    rotateRight(gridMatrix) {
        if (this.isAtBottom()) {
            return;
        }
        if (this.detectCollisionAfterRotation(gridMatrix)) {
            return false;
        }
        if (this.fixOutOfBoundsAfterRotation(gridMatrix)) {
            return false;
        }
        if (this.transformationIndex == 3) {
            this.transformationIndex = 0;
        }
        else {
            this.transformationIndex += 1;
        }

        const topLeftMost = this.getTopLeftMostRect();

        const x = topLeftMost.x;
        const y = topLeftMost.y;
        this.destroyShape();

        this.buildShape(this.originCoordX, this.originCoordY);
    }
    /**
     * 
     * @returns True if any of the rects of the shape are at the bottom of the grid
     */
    isAtBottom() {
        const numRows = gameConfig.numRows;

        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
        }
        for (let i = 0; i < this.rects.length; i++) {
            if (this.rects[i].coordY == numRows - 1) {
                return true;
            }
        }
        return false;
    }
    /**
     * 
     * @param {Array[]} gridMatrix - 2D array representing the grid - 1 means it's occupied, 0 that it's vacant
     * @param {number} dX - Change in the horizontal position of the shape
     * @param {number} dY - Change in the vertical position of the shape
     * @returns True if there is a collision that is due on the next move
     */
    detectCollision(gridMatrix, dX, dY) {
        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
            const newCoordX = rect.coordX + dX;
            const newCoordY = rect.coordY + dY;
            if (newCoordY < gameConfig.numRows) {
                if (gridMatrix[newCoordY][newCoordX] === 1) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * 
     * @param {Array[]} gridMatrix - 2D array representing the grid - 1 means it's occupied, 0 that it's vacant
     * @returns True if there is no collision with other pieces after applying rotation
     */
    detectCollisionAfterRotation(gridMatrix) {
        const nextTransformationIndex = this.transformationIndex == 3 ? 0 : this.transformationIndex + 1;
        const nextTransformation = this.shapeTransformations[nextTransformationIndex];

        const cols = nextTransformation.length;
        const rows = nextTransformation[0].length;

        const fromX = this.originCoordX;
        const toX = fromX + cols;

        const fromY = this.originCoordY;
        const toY = fromY + rows;

        // indeces for the transformation, for loop is iterating over the indeces of the grid matrix
        let x2 = 0;
        let y2 = 0;

        for (let x = fromX; x < toX; x++) {
            y2 = 0;
            for (let y = fromY; y < toY; y++) {
                if (nextTransformation[x2][y2] == 1 && gridMatrix[x][y] == 1) {
                    return true;
                }
                y2 += 1;
            }
            x2 += 1;
        }
        return false;
    }
    /**
     * @brief Check if the piece is out of bounds after rotating it, if yes, move it either to the left or right
     *        so that it stays withing the boundaries of the game 
     * @param {Array[]} gridMatrix 
     */
    fixOutOfBoundsAfterRotation(gridMatrix) {
        const nextTransformationIndex = this.transformationIndex == 3 ? 0 : this.transformationIndex + 1;
        const nextTransformation = this.shapeTransformations[nextTransformationIndex];
        const size = nextTransformation.length;
        const numCols = gridMatrix[0].length;

        if (this.originCoordX > numCols / 2) {
            let maxRectCoordX = 0;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const offsetX = this.originCoordX + j;
                    if (offsetX >= numCols) {
                        maxRectCoordX = offsetX > maxRectCoordX ? offsetX : maxRectCoordX;
                    }
                }
            }
            const numberMoveLeft = maxRectCoordX - numCols + 1;
            for (let i = 0; i < numberMoveLeft; i++) {
                console.log("Moving left");
                this.moveLeft(gridMatrix);
            }
        }
        else {
            /*
            let minRectCoordX = 999;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    for (let x = 0; x < this.rects.length; i++) {
                        const coordX = this.rects[x].coordX;
                        if (coordX < minRectCoordX) {
                            minRectCoordX = coordX;
                        }
                    }
                }
            }
            const numberMoveRight = minRectCoordX > 0 ? 0 : -minRectCoordX;
            for (let i = 0; i < numberMoveRight; i++) {
                console.log("Moving right");
                this.moveRight(gridMatrix);
            }
            */
           /*
           */
        }
    }
    /**
     * 
     * @returns True if none of the pieces are touching the left wall
     */
    canMoveLeft() {
        const coordXNotZero = rect => rect.coordX !== 0;
        return this.rects.every(coordXNotZero);
    }
    /**
     * 
     * @returns True if none of the pieces are touching the right wall
     */
    canMoveRight() {
        const coordXNotMax = rect => rect.coordX !== gameConfig.numCols - 1;
        return this.rects.every(coordXNotMax);
    }
    /**
     * @returns Rectangle of the shape which is in the top left most position
     */
    getTopLeftMostRect() {
        let topLeftMost = this.rects[0];
        for (let i = 1; i < this.rects.length; i++) {
            const rect = this.rects[i];
            if (rect.coordX < topLeftMost.coordX) {
                topLeftMost = rect;
            }
            if (rect.coordY < topLeftMost.coordY) {
                topLeftMost = rect;
            }
        }
        return topLeftMost;
    }
    /**
     * @brief Check if any of the rects are at the 0th y coordinate
     */
    isAtCeiling() {
        for (let i = 0; i < this.rects.length; i++) {
            const coordY = this.rects[i].coordY;
            if (coordY === 0) {
                return true;
            }
        }
        return false;
    }
    /**
     * @brief Get the length of the shape
     */
    getShapeWidth() {
        const shapeString = this.shapeCode + "Width";
        return shapes[shapeString];
    }
    /**
     * @brief Get the height of the shape
     */
    getShapeHeight() {
        const shapeString = this.shapeCode + "Height";
        return shapes[shapeString];
    }
}