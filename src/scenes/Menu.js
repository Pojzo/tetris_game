import { gameConfig, getMusicOn, musicOnTrigger, effectsOnTrigger, getEffectsOn } from "../config/game_config.js";
import * as colors from '../game/colors.js';

import { calculateXStartTextElementToCenter } from "./GameOver.js";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('menu');
    }
    preload() {
        this.load.image('checkmark', '../assets/checkmark.png')
        this.load.image('checkmark2', '../assets/checkmark.png');
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
            fill: '#ffffff',
            fontFamily: gameConfig.font
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
     * @brief Create checkbox for music. This could've been done a lot cleaner using a checkbox factory, but whatever.
     */
    createCheckbox() {
        const fontSize = 33;
        const textStyle = {
            fontSize: fontSize,
            fill: '#ffffff',
            fontFamily: gameConfig.font
        };

        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        const musicText = this.add.text(0, 0, "Music", textStyle).setOrigin(0);
        const musicTextX = (screenWidth - musicText.displayWidth) * 0.35;
        const musicTextY = (this.scoreBoardButton.y + this.scoreBoardButton.displayHeight * 1.5);

        const soundEffectText = this.add.text(0, 0, "Effects", textStyle).setOrigin(0);
        const soundEffectX = (screenWidth - soundEffectText.displayWidth) * 0.35;
        const soundEffectY = musicTextY + musicText.displayHeight * 1.4;

        musicText.x = musicTextX;
        musicText.y = musicTextY;

        soundEffectText.x = soundEffectX;
        soundEffectText.y = soundEffectY;

        const checkboxSize = fontSize;

        let checkboxX = musicText.x + musicText.displayWidth + checkboxSize * 3;
        let checkboxY = musicTextY;

        const musicCheckbox = this.add.rectangle(checkboxX, checkboxY, checkboxSize, checkboxSize)
            .setOrigin(0)
            .setAlpha(0.7)
            .setInteractive()
            .setFillStyle(0xffffff)

        this.musicCheckboxImage = this.add.image(checkboxX, checkboxY, 'checkmark');

        checkboxY += checkboxSize * 1.4;
        const soundEffectCheckbox = this.add.rectangle(checkboxX, checkboxY, checkboxSize, checkboxSize)
            .setOrigin(0)
            .setAlpha(0.7)
            .setInteractive()
            .setFillStyle(0xffffff)

        this.soundEffectCheckboxImage = this.add.image(checkboxX, checkboxY, 'checkmark2');

        const desiredWidth = checkboxSize;
        const desiredHeight = checkboxSize;

        const imageWidth = this.musicCheckboxImage.displayWidth;
        const imageHeight = this.musicCheckboxImage.displayHeight;

        const scaleX = desiredWidth / imageWidth;
        const scaleY = desiredHeight / imageHeight;

        this.musicCheckboxImage
            .setScale(scaleX, scaleY)
            .setOrigin(0);

        this.soundEffectCheckboxImage
            .setScale(scaleX, scaleY)
            .setOrigin(0);

        this.musicCheckboxImage.setVisible(getMusicOn());
        this.soundEffectCheckboxImage.setVisible(getEffectsOn());

        musicCheckbox.on('pointerup', () => {
            this.onCheckboxClick('music');
        })
        soundEffectCheckbox.on('pointerup', () => {
            this.onCheckboxClick('effects');
        })
    }

    /**
     * @brief Called upon clicking a checkbox
     * @param {string} value - Name of the checkbox that was pressed
     */
    onCheckboxClick(value) {
        switch (value) {
            case 'music':
                this.musicCheckboxImage.setVisible(!this.musicCheckboxImage.visible);
                musicOnTrigger();
                break;

            case 'effects':
                this.soundEffectCheckboxImage.setVisible(!this.soundEffectCheckboxImage.visible);
                effectsOnTrigger();
                break;
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