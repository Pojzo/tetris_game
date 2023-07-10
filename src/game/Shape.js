import { gameConfig } from '../config/game_config.js';
import * as shapes from './shapes.js';
import * as colors from './colors.js';
import ShapeRect from './ShapeRect.js';

export default class Shape {
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} shapeCode 
     */
    constructor(scene, x, y, shapeCode) {
        this.shapeCode = shapeCode;
        this.scene = scene;

        this.rectWidth = gameConfig.rectWidth;
        this.rectHeight = gameConfig.rectHeight;

        this.transformationIndex = 0;

        // store the coordinates of the top left of the piece matrix
        this.originCoordX = 0;
        this.originCoordY = 0;

        this.rects = []

        this.buildShape(0, 0);
    }
    /**
     * 
     * @param {number} x Starting x position of the shape
     * @param {*} y Starting y position of the shape
     * @returns Null if the shape doesn't exist
     */
    buildShape(gridOffsetX, gridOffsetY) {
        try {
            this.shapeTransformations = shapes[this.shapeCode];
        }
        catch (err){
            console.error("Invalid shape");
            console.log(err);
            return null;
        }
        const curTransformation = this.shapeTransformations[this.transformationIndex];

        const rows = curTransformation.length;
        const cols = curTransformation[0].length;
        console.log(curTransformation, this.transformationIndex);

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
                const rect = new ShapeRect(this.scene, offsetX + skipX, offsetY + skipY, this.originCoordX + j, this.originCoordY + i, this.rectWidth, this.rectHeight, colors.COLOR_RED).setOrigin(0, 0);
                this.rects.push(rect);
                skipX += this.rectWidth;
            }
            skipY += this.rectHeight;
        }
        this.rects.forEach(rect => {
            console.log(rect.coordX, rect.coordY);
        })
        this.scene.add.existing(this.rects);
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
     * @param {Shape[]} otherShapes - An array of Shape class objects
     * @return {boolean} True if the shape was able to move down by one row
     * @brief Try to move the shape down. If it's not possible due to other shape being present below
     *        the shape, return false
     */
    moveDown(otherShapes) {
        if (this.isAtBottom()) {
            return false;
        }
        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
            rect.y += gameConfig.rectHeight;
            rect.coordY += 1;
        }
        this.originCoordY += 1;
    }
    /**
     * 
     * @brief If possible, move the shape to the left
     * @returns False if it wasn't possible for the shape to move left
     */
    moveLeft() {
        if (!this.canMoveLeft()) {
            return false;
        }
        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
            rect.x -= gameConfig.rectWidth;
            rect.coordX -= 1;
        }

        this.originCoordX -= 1;
    }
    /**
     * @brief If possible, move the shape to the right
     * @returns False if it wasn't possible for the shape to move right
     */
    moveRight() {
        if (!this.canMoveRight()) {
            return false;
        }
        for (let i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
            rect.x += gameConfig.rectWidth;
            rect.coordX += 1;
        }
        this.originCoordX += 1;
    }
    /**
     * @brief If possible, rotate the shape to the left
     */
    rotateLeft() {
        if (this.transformationIndex == 0) {
            this.transformationIndex = 3;
        }
        else {
            this.transformationIndex -= 1;
        }
           }
    /**
     * 
     * @brief If possible, rotate the shape to the right
     */
    rotateRight() {
        if (this.transformationIndex == 3) {
            this.transformationIndex = 0;
        }
        else {
            this.transformationIndex += 1 ;
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
}