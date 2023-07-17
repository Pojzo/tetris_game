export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over');
    }
    preload() {
        this.input.keyboard.on('keydown-SPACE', () => this.startNewGame(), this);
    }

    /**
     * 
     * @param {object} data - Data passed from the main game scene after losing a game
     */
    init(data) {
        this.score = data.score;
        this.level = data.level;
        this.tilesSpawned = data.tilesSpawned;

        console.log(this.score, this.level, this.tilesSpawned);
    }
    create() {
        this.displayGameOverMessage();
        this.displayStats();
    }
    /**
     * @brief Display game over string in the upper part of the screen
     */
    displayGameOverMessage() {
        const fontSize = 50;
        const style = {
            fontFamily: 'Arial',
            fontSize: `${fontSize}px`,
            color: '#ffffff'
        }
        const textString = 'Game Over!';
        const gameOverText = this.add.text(0, 0, textString, style).setOrigin(0, 0);
        gameOverText.x = this.calculateXStartTextElementToCenter(gameOverText, this.cameras.main.width);
        gameOverText.y = this.cameras.main.height * 0.2;
    }
    /**
     * @brief Display statistics after the game has ended like the score, level and tiles spawned
     */
    displayStats() {
        const fontSize = 48;
        const textStyle = {
            fontFamily: 'Arial',
            fontSize: `${fontSize}px`,
            color: '#ffffff'
        }

        const screenHeight = this.cameras.main.height;
        const screenWidth = this.cameras.main.width;
        const spacing = fontSize * 1.2;

        const scoreTextString = `Score: ${this.score}`;
        const levelTextString = `Level: ${this.level}`;
        const tilesSpawnedString = `Tiles: ${this.tilesSpawned}`;

        const statsArray = [scoreTextString, levelTextString, tilesSpawnedString];

        statsArray.forEach((text, index) => {

            const textElement = this.add.text(0, 0, text, textStyle).setOrigin(0);

            textElement.x = this.calculateXStartTextElementToCenter(textElement, screenWidth);
            textElement.y = screenHeight / 2 + index * spacing;
        })
    }
    /**
     * @brief Calculates where to put a text element in order for the text to be centered
     */
    calculateXStartTextElementToCenter(textElement, screenWidth) {
        const textWidth = textElement.displayWidth;
        const x = (screenWidth - textWidth) / 2;

        return x;
    }

    /**
     * @brief Reset the game by switching back to the game scene
     */
    startNewGame() {
        this.scene.start('game');
    }
}