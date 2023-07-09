import * as colors from './colors.js';

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
            offsetY: 400
        }

        this.createSidebar();

        this.scene.add.existing(this);
        this.update({
            'score': 5,
            'level': 3
        })
    }
    /**
     * 
     * @brief Creates game objects located in the sidebar: The rectangle which contains all elements
     *        text containing the score, level and tiles spawned
     *        All the elements are added into the container
     */
    createSidebar() {
        this.sidebar = this.scene.add
            .rectangle(0, 0, this.sidebarWidth, this.sidebarHeight, this.sidebarColor)
            .setOrigin(0, 0)
            .setStrokeStyle(5, colors.COLOR_GRAY)

        const offsetX = this.statsConfig.offsetX;
        const offsetY = this.statsConfig.offsetY;

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

        this.add(this.sidebar);
        this.add(this.scoreText);
        this.add(this.levelText);
        this.add(this.tilesSpawnedText);
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
}