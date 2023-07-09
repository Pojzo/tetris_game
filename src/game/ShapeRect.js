export default class ShapeRect extends Phaser.GameObjects.Rectangle {
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} x - Horizontal position of the rect
     * @param {number} y - Vertical position of the rect
     * @param {number} coordX - Horizontal coordinate in the grid
     * @param {number} coordY - Vertical coordinate in the grid
     * @param {number} width  - Width of the rectangle
     * @param {number} height - Height of the rectangle
     * @param {number} fillColor - Color to fill the rectangle
     * @returns 
     */
    constructor(scene, x, y, coordX, coordY, width, height, fillColor) {
        super(scene, x, y, width, height, fillColor);
        scene.add.existing(this);

        this.coordX = coordX;
        this.coordY = coordY;

        return this;
    }
}