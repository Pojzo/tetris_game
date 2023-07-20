import { gameConfig } from "../config/game_config.js";
import * as colors from '../game/colors.js';

import { calculateXStartTextElementToCenter } from "./GameOver.js";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('menu');
    }
    preload() {
        this.load.image('checkmark', '../assets/checkmark.png')
    }
    create() {
        this.input.keyboard.on('keydown-ESC', this.resumeGame, this);

        this.createBackground();
        this.createButtons();
        this.createCheckbox();
    }
    /**
     * @brief Create background rectangle on paused game
     */
    createBackground() {
        const gameWidth = gameConfig.gameWidth;
        const gameHeight = gameConfig.gameHeight;
        const background = this.add.rectangle(0, 0, gameWidth, gameHeight, colors.COLOR_GRAY)
            .setOrigin(0)
            .setScale(2)
            .setAlpha(0.7)
    }
    /**
     * @brief Create buttons for the menu - resume and settings
     */
    createButtons() {
        const buttonStyle = {
            fontSize: '32px',
            fill: '#ffffff'
        };
        const resumeGameButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Resume game', buttonStyle)
            .setOrigin(0.5)
            .setInteractive();

        const newGameButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'New Game', buttonStyle)
            .setOrigin(0.5)
            .setInteractive();

        const scoreBoardButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Scoreboard', buttonStyle)
            .setOrigin(0.5)
            .setInteractive();

        const buttons = [resumeGameButton, newGameButton, scoreBoardButton];
        const spacing = resumeGameButton.displayHeight * 1.5;

        const startY = this.cameras.main.height * (2 / 5);
        buttons.forEach((button, index) => {
            const y = index * spacing + startY;
            button.y = y;
            button.on('pointerover', () => {
                this.input.setDefaultCursor('pointer');
            })
            button.on('pointerout', () => {
                this.input.setDefaultCursor('auto');
            })
        })
        resumeGameButton.on('pointerup', () => {
            this.input.setDefaultCursor('auto');
            this.resumeGame();
        })
        newGameButton.on('pointerup', () => {
            this.input.setDefaultCursor('auto');
            this.startNewGame();
        })
        scoreBoardButton.on('pointerup', () => {
            this.input.setDefaultCursor('auto');
            this.openScoreboard();
        })
        this.scoreBoardButton = scoreBoardButton;
    }
    /**
     * @brief Create checkbox for music
     */
    createCheckbox() {
        const fontSize = 33;
        const textStyle = {
            fontSize: fontSize,
            fill: '#ffffff'
        };

        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        const musicText = this.add.text(0, 0, "Music", textStyle).setOrigin(0);
        const musicTextX = (screenWidth - musicText.displayWidth) * 0.45;
        const musicTextY = (this.scoreBoardButton.y + this.scoreBoardButton.displayHeight * 1.5);

        musicText.x = musicTextX;
        musicText.y = musicTextY;

        const checkboxSize = fontSize;

        const checkboxX = musicText.x + musicText.displayWidth + checkboxSize;
        const checkboxY = musicTextY - checkboxSize / 8;

        const musicCheckbox = this.add.rectangle(checkboxX, checkboxY, checkboxSize, checkboxSize)
            .setOrigin(0)
            .setAlpha(0.7)
            .setInteractive()
            .setFillStyle(0xffffff)
        
        this.checkboxImage = this.add.image(checkboxX, checkboxY, 'checkmark');

        const desiredWidth = checkboxSize;
        const desiredHeight = checkboxSize;

        const imageWidth = this.checkboxImage.displayWidth;
        const imageHeight = this.checkboxImage.displayHeight;

        const scaleX = desiredWidth / imageWidth;
        const scaleY = desiredHeight  / imageHeight;

        this.checkboxImage
            .setScale(scaleX, scaleY)
            .setOrigin(0);

        this.checkboxImage.setVisible(this.game.musicOn);
        musicCheckbox.on('pointerup', () => {
            this.onCheckboxClick('music');
        })

    }
    /**
     * @brief Called upon clicking a checkbox
     * @param {string} value - Name of the checkbox that was pressed
     */
    onCheckboxClick(value) {
        console.log("here");
        switch (value) {
            case 'music':
                this.checkboxImage.setVisible(!this.checkboxImage.visible);
                this.game.musicOn = !this.game.musicOn;
        }
    }
    /**
     * @brief Resume the game by calling the scene.resume function on 'game
     */
    resumeGame() {
        this.scene.resume('game');
        this.scene.stop();
    }
    startNewGame() {
        this.scene.start('game');
        this.scene.stop();
    }
    openScoreboard() {
        this.scene.pause();
        this.scene.launch('scoreboard', {
            previousScene: 'menu'
        });
    }
}