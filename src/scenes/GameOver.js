import { gameConfig } from "../config/game_config.js";

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
        this.createGameOverMessage();
        this.createStats();
        this.createButtons();
    }
   
    /**
     * @brief Display game over string in the upper part of the screen
     */
    createGameOverMessage() {
        const gameOverStyle = {
            fontFamily: gameConfig.font,
            fontSize: 40,
            color: '#ffffff'
        }
        const gameOverString = 'Game Over!';
        const gameOverText = this.add.text(0, 0, gameOverString, gameOverStyle).setOrigin(0, 0);
        gameOverText.x = calculateXStartTextElementToCenter(gameOverText, this.cameras.main.width);
        gameOverText.y = this.cameras.main.height * 0.1;

        const startNewGameStyle = {
            fontFamily: gameConfig.font,
            fontSize: 12,
            color: '#ffffff'
        }

        const startNewGameString = 'To start a new game, press SPACE';
        const startNewGameText = this.add.text(0, 0, startNewGameString, startNewGameStyle).setOrigin(0, 0);
        startNewGameText.x = calculateXStartTextElementToCenter(startNewGameText, this.cameras.main.width);
        startNewGameText.y = this.cameras.main.height * 0.18;
    }
    /**
     * @brief Display statistics after the game has ended like the score, level and tiles spawned
     */
    createStats() {
        const fontSize = 35;
        const textStyle = {
            fontFamily: gameConfig.font,
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
        const startY = screenHeight * 0.3;

        statsArray.forEach((text, index) => {

            const textElement = this.add.text(0, 0, text, textStyle).setOrigin(0);

            textElement.x = calculateXStartTextElementToCenter(textElement, screenWidth);
            textElement.y = startY + index * spacing;
        })
    }
    /**
        * @brief Create buttons to start a new game or check the leaderboard
        */
    createButtons() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const buttonStyle = {
            fontSize: 50,
            fontFamily: gameConfig.font,
            color: '#fffffA',
            backgroundColor: "#333333", // Background color of the button
            padding: {
                x: 10, // Horizontal padding
                y: 5,  // Vertical padding
            },
            border: {
                color: "#ffffff", // Border color of the button
                width: 2,         // Border width
            },
        }

        const newGameString = "New Game";
        const newGameButton = this.add.text(0, 0, newGameString, buttonStyle)
            .setInteractive()

        newGameButton.on("pointerover", () => {
            this.input.setDefaultCursor('pointer')
        })
        newGameButton.on("pointerout", () => {
            this.input.setDefaultCursor('auto');
        })
        newGameButton.on("pointerup", () => {
                this.startNewGame();
            })

        const newGameButtonX = (screenWidth - newGameButton.displayWidth) / 2;
        let startY = screenHeight * 0.58;
        newGameButton.x = newGameButtonX;
        newGameButton.y = startY;

        const scoreboardString = "Scoreboard";
        const scoreboardButton = this.add.text(0, 0, scoreboardString, buttonStyle)
        .setInteractive()

        const scoreboardButtonX = (screenWidth - scoreboardButton.displayWidth) / 2;

        startY += newGameButton.displayHeight * 1.2;

        scoreboardButton.x = scoreboardButtonX;
        scoreboardButton.y = startY;

        const startX = (screenWidth)
    }

    /**
     * @brief Reset the game by switching back to the game scene
     */
    startNewGame() {
        this.scene.start('game');
    }
}

/**
    * @brief Calculates where to put a text element in order for the text to be centered
    */
export const calculateXStartTextElementToCenter = (textElement, screenWidth) => {
    const textWidth = textElement.displayWidth;
    const x = (screenWidth - textWidth) / 2;

    return x;
}
