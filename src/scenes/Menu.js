import { gameConfig } from "../config/game_config.js";
import * as colors from '../game/colors.js';

import { calculateXStartTextElementToCenter } from "./GameOver.js";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('menu');
    }
    preload() {

    }
    create() {
        this.input.keyboard.on('keydown-ESC', this.resumeGame, this);

        this.createBackground();
        this.createButtons();
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
        
        const startY = this.cameras.main.height * (2/5);
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