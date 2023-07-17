import { animationConfig } from "../config/game_config";

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
        
        this.setStrokeStyle(3);

        return this;
    }
    updatePosition() {
        this.x = this.coordX * this.width;
        this.y = this.coordY * this.height;
    }
    /**
     * 
     * @param {number} x - New x position on the grid to animate the pieces to
     * @param {number} y - New y position on the grid to animate the piece to
     */
    updatePositionAnimation(x, y) {
        const newX = x * this.width;
        const newY = y * this.height;

        const animationDuration = animationConfig.tetrisAnimationDuration;
        const animationEase = animationConfig.tetrisAnimationEase;

        this.scene.tweens.add({
            targets: this,            
            y: newY,
            duration: animationDuration,
            ease: animationEase,
            onComplete: () => {

            }
        })

        this.coordX = x;
        this.coordY = y;
    }
}