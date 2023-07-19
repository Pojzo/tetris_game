import { gameConfig } from "../config/game_config.js";
import * as colors from '../game/colors.js';


export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over');
        this.nicknameRegex = /^[a-zA-Z0-9]$/;
        this.cursorBlinkFPS = 2.3;
        this.cursorBlinkDelay = 1000 / this.cursorBlinkFPS;
        this.nameFontSize = 45;
    }
    preload() {
        this.input.keyboard.on('keydown-SPACE', () => this.startNewGame(), this);
        this.input.keyboard.on("keydown", event => {
            const key = event.key;
            const keyCode = event.keyCode;
            if (keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
                this.handleBackspace();
            }
            else if (this.nicknameRegex.test(key)) {
                this.handleKeyPress(key);
            }
        })
    }

    /**
     * 
     * @param {object} data - Data passed from the main game scene after losing a game
     */
    init(data) {
        this.maxNameLen = this.cameras.main.width / this.nameFontSize - 1;
        this.score = data.score;
        this.level = data.level;
        this.tilesSpawned = data.tilesSpawned;
        this.gameSaved = false;
        this.cursorBlinkTime = 0;

        console.log(this.score, this.level, this.tilesSpawned);
    }
    /**
     * @brief Create all elements on the page
     */
    create() {
        this.createGameOverMessage();
        this.createStats();
        this.createButtons();
        this.createSaveInput();
    }
    /**
     * 
     * @brief Update the blinking cursor for name 
     * @param {number} time 
     * @param {number} delta 
     */
    update(time, delta) {
        this.cursorBlinkTime += delta;
        if (this.cursorBlinkTime > this.cursorBlinkDelay) {
            this.cursorLine.setVisible(!this.cursorLine.visible);
            this.cursorBlinkTime = 0;
        }
    }

    /**
     * @brief Display game over string in the upper part of the screen
     */
    createGameOverMessage() {
        const gameOverStyle = {
            fontFamily: gameConfig.font,
            fontSize: 50,
            color: '#FF0000'
        }
        const gameOverString = 'Game Over!';
        const gameOverText = this.add.text(0, 0, gameOverString, gameOverStyle).setOrigin(0, 0);
        gameOverText.x = calculateXStartTextElementToCenter(gameOverText, this.cameras.main.width);
        gameOverText.y = this.cameras.main.height * 0.1;

        const startNewGameStyle = {
            fontFamily: gameConfig.font,
            fontSize: 16,
            color: '#0000FF'
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
        const fontSize = 50;
        const buttonStyle = {
            fontSize: fontSize,
            fontFamily: gameConfig.font,
            color: '#fffffA',
            backgroundColor: "#333333", // Background color of the button
            padding: {
                x: 10, // Horizontal padding
                y: 10,  // Vertical padding
            },
            border: {
                color: "#ffffff", // Border color of the button
                width: 2,         // Border width
            },
        }

        const newGameString = "New Game";
        const scoreboardString = "Scoreboard";
        const saveString = "Save";

        const buttonStrings = [newGameString, scoreboardString, saveString];
        const startY = screenHeight * 0.52;
        const spacingY = fontSize * 1.5;

        buttonStrings.forEach((buttonString, index) => {
            const button = this.add.text(0, 0, buttonString, buttonStyle)
                .setInteractive()
                .on("pointerover", () => {
                    this.input.setDefaultCursor('pointer')
                })
                .on("pointerout", () => {
                    this.input.setDefaultCursor('auto');
                })
            const callback = () => {
                switch (buttonString) {
                    case newGameString:
                        return this.startNewGame();
                    case scoreboardString:
                        return this.startScoreboard();
                    case saveString:
                        return this.saveGame();
                }
            }
            button.on("pointerup", () => {
                callback();
            })
            const buttonX = (screenWidth - button.displayWidth) / 2;
            const buttonY = index * spacingY + startY;
            button.x = buttonX;
            button.y = buttonY;
        });

    }
    /**
     * @brief Create an input for the game so the result can be saved to the scoreboard
     */
    createSaveInput() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        const cursorStartX = screenWidth / 2;
        const cursorStartY = screenHeight * 0.85;
        const cursorWidth = 2;
        const cursorHeight = this.nameFontSize;
        const cursorColor = colors.COLOR_WHITE

        this.cursorLine = this.add.rectangle(cursorStartX, cursorStartY, cursorWidth, cursorHeight, cursorColor)
            .setOrigin(0, 0);

        const textStyle = {
            fontSize: this.nameFontSize,
            fontFamily: gameConfig.font,
            color: '#FFD700'
        }
        this.nameText = this.add.text(cursorStartX + 5, cursorStartY, "", textStyle)
            .setOrigin(0, 0);
    }
    /**
     * @brief Handle key presses when entering a name for the scoreboard
     * @param {string} key 
     */
    handleKeyPress(key) {
        if (this.gameSaved) {
            return;
        }
        this.addLetterToName(key);
    }
    handleBackspace() {
        if (this.gameSaved) {
            return;
        }
        this.removeLetterFromName();
    }
    /**
     * @brief Add a letter to the name to save to the leaderboard. This function assumes that It's not already been set
     * @param {string} letter - Letter to add to the name
     */
    addLetterToName(letter) {
        if (this.nameText.text.length >= this.maxNameLen) {
            return;
        }
        const decreaseX = this.nameFontSize / 2;
        const newCursorX = this.cursorLine.x - decreaseX;
        const newTextX = this.nameText.x - decreaseX;

        this.cursorLine.x = newCursorX;
        this.nameText.x = newTextX;
        this.nameText.text += letter
    }
    /**
     * @brief Remove the last letter from the name
     */
    removeLetterFromName() {
        if (this.nameText.text.length === 0) {
            return;
        }
        const increaseX = this.nameFontSize / 2;
        const newCursorX = this.cursorLine.x + increaseX;
        const newTextX = this.nameText.x + increaseX;

        this.cursorLine.x = newCursorX;
        this.nameText.x = newTextX;
        this.nameText.text = this.nameText.text.substring(0, this.nameText.text.length -1);
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
