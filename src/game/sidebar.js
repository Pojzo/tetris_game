import * as colors from './colors.js';
import Shape from './Shape.js';

export default class Sidebar extends Phaser.GameObjects.Container {
    /**
     * 
     * @param {Phaser.Scene} scene
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} color 
     */
    constructor(scene, x, y, width, height, color) {
        super(scene, x, y);
        this.scene = scene

        this.setSize(width, height);

        this.sidebarWidth = width;
        this.sidebarHeight = height;
        this.sidebarColor = color;

        this.score = 0;
        this.level = 1;
        this.tilesSpawned = 0;

        this.statsConfig = {
            offsetX: 10,
            offsetY: 500
        }

        this.createSidebar();

        this.scene.add.existing(this);
    }
    /**
     * 
     * @brief Creates game objects located in the sidebar: The rectangle which contains all elements
     *        text containing the score, level and tiles spawned
     *        All the elements are added into the container
     */
    createSidebar() {

        this.sidebarBackground = this.scene.add
            .rectangle(0, 0, this.sidebarWidth, this.sidebarHeight, this.sidebarColor)
            .setOrigin(0, 0)
            .setStrokeStyle(5, colors.COLOR_GRAY);

        this.createNextShapeContainer();
        this.createTextFields();
        this.add(this.sidebarBackground);
        this.add(this.scoreText);
        this.add(this.levelText);
        this.add(this.tilesSpawnedText);
        this.add(this.nextShapesContainer);
    }

    /**
     * @brief Create the container which shows the next shapes
     */
    createNextShapeContainer() {
        const containerOffsetX = this.sidebarWidth * 0.05;
        const containerOffsetY = this.sidebarHeight * 0.02;

        const containerWidth = this.sidebarWidth - 2 * containerOffsetX;
        const containerHeight = this.sidebarHeight / 2;

        this.nextShapesContainer = new NextShapesContainer(this.scene, containerOffsetX, containerOffsetY, containerWidth, containerHeight);
    }
    /**
     * @brief Create text fields inside the container like the score, level or number of spawned tiles
     */
    createTextFields() {
        const offsetX = 20;
        const offsetY = this.sidebarHeight * (3 / 5);

        this.scoreText = this.scene.add.text(offsetX, offsetY, this.getScoreString(), {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#000000'
        }).setOrigin(0, 0);

        this.levelText = this.scene.add.text(offsetX, offsetY + 30, this.getLevelString(), {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#000000'
        });

        this.tilesSpawnedText = this.scene.add.text(offsetX, offsetY + 60, this.getTilesSpawnedString(), {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#000000'
        });
    }


    /**
     * @brief Resets attributes to their initial values
     */
    reset() {
        this.update({
            'score': 0,
            'level': 1,
            'tilesSpawned': 0
        })
    }
    /**
     * 
     * @param {object} values 
     * @brief Updates class attributes like the score, level and spawned tiles
     */
    update(values) {
        if ('score' in values) {
            this.score = values.score;
        }
        if ('level' in values) {
            this.level = values.level;
        }
        if ('tilesSpawned' in values) {
            this.tilesSpawned = values.tilesSpawned;
        }
        const scoreText = this.getScoreString();
        const levelText = this.getLevelString();
        const tilesSpawnedText = this.getTilesSpawnedString();

        this.scoreText.setText(scoreText);
        this.levelText.setText(levelText);
        this.tilesSpawnedText.setText(tilesSpawnedText);
    }

    /**
     * 
     * @returns The string representing the score
     */
    getScoreString() {
        return `Score: ${this.score}`;
    }
    /**
     * 
     * @returns The string representing the level of the game
     */
    getLevelString() {
        return `Level: ${this.level}`;
    }
    /**
     * 
     * @returns The string representing how many tiles have been spawned
     */
    getTilesSpawnedString() {
        return `Tiles: ${this.tilesSpawned}`;
    }
    setNextShapes(shapes) {
        this.nextShapesContainer.update(shapes);
    }
}

class NextShapesContainer extends Phaser.GameObjects.Container {
    /**
     * 
     * @param {Phaser.scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(scene, x, y, width, height) {
        super(scene, x, y);
        const background = this.scene.add.rectangle(0, 0, width, height, colors.COLOR_BLACK).setOrigin(0, 0);

        this.add(background);

        this.width = width;
        this.height = height;

        this.rectWidth = (this.width / 4) * 0.90;
        this.rectHeight = (this.height / 12) * 0.95;

        this.scene.add.existing(this);

        this.rects = [];
    }
    /**
     * 
     * @param {Shape[]} shapes - These shapes are set at the beginning
     */
    update(shapes) {
        console.log(this.rects);
        if (this.rects.length !== 0) {
            for (let i = 0; i < this.rects.length; i++) {
                this.rects[i].setVisible(false).setActive(false);
            }
        }
        this.rects = [];

        const numShapes = shapes.length
        const shapeOffsetYIncrement = this.height / numShapes;

        let shapeOffsetY = (this.rectHeight) * numShapes / 2;

        for (let i = 0; i < numShapes; i++) {
            const shapeHorizontalRects = shapes[i].getShapeWidth();
            const shapeLen = shapeHorizontalRects * this.rectWidth;

            const shapeOffsetX = (this.width - shapeLen) / 2;

            const newRects = shapes[i].buildShapeRectsAtPosition(this.scene, shapeOffsetX, shapeOffsetY, this.rectWidth, this.rectHeight);
            newRects.forEach(rect => {
                this.rects.push(rect);
                console.log("pushing");
            })

            newRects.forEach(rect => {
                this.scene.add.existing(rect);
                this.add(rect);
            })
            shapeOffsetY += shapeOffsetYIncrement;
        }
    }
}