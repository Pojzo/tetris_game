import { scoresEndpoint } from "../config/api_config.js";
import * as colors from '../game/colors.js';

const firebaseConfig = {
    apiKey: "AIzaSyATZQr5xvTeZJkOqaNrFBNWMI-j4YzQdOA",
    authDomain: "tetris-f158d.firebaseapp.com",
    projectId: "tetris-f158d",
    storageBucket: "tetris-f158d.appspot.com",
    messagingSenderId: "166449362109",
    appId: "1:166449362109:web:f7c8aec3a8c2b9c0a6b3d4",
    measurementId: "G-GKSRSRP4MN"
};

export default class ScoreboardScene extends Phaser.Scene {

    constructor() {
        super('scoreboard');
        this.newScore = 20;
    }
    preload() {
        this.load.plugin('rexfirebaseplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfirebaseplugin.min.js', true);
    }
    async create() {
        if (this.leaderBoard === undefined) {
            firebase.initializeApp(firebaseConfig);
            this.leaderBoard = this.plugins.get('rexfirebaseplugin').add.leaderBoard({
                root: 'Tetris-Leaderboard'
            });

            this.leaderBoard.setUser('1', 'Pojzo');
            // this.leaderBoard.setBoardID('Tetris-Leaderboard');

        }
        const scores = await this.leaderBoard.loadFirstPage();


        this.createBackground();
        this.createButtons();
        this.createLeaderBoard(scores);
        console.log(scores.length);
    }
    init() {

    }

    createButtons() {
        const buttonStyle = {
            fontSize: '32px',
            fill: '#ffffff',
        };
        const backButton = this.add.text(20, 20, 'Back', buttonStyle)
            .setOrigin(0)
            .setInteractive();

        backButton.on('pointerup', () => {
            this.scene.stop();
            this.scene.launch('menu');
        })
    }
    createBackground() {
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, colors.COLOR_BLACK)
            .setOrigin(0);
    }
    createScoresText() {
        const x = this.cameras.main.width / 2;
        const y = this.cameras.main.height / 2;
        this.scoresText = this.add.text(x, y, 'Loading', {
            color: '#ffffff',
            fontSize: '45px',
        })
            .setOrigin(0.5);
    }
    createLeaderBoard(scores) {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const leaderboardWidth = screenWidth / 1.3;
        const leaderboardHeight = screenHeight / 1.2;

        const startX = (screenWidth - leaderboardWidth) / 2;
        const startY = (screenHeight - leaderboardHeight) / 2;

        const leaderboardContainer = this.add.container(startX, startY);
        leaderboardContainer.setSize(leaderboardWidth, leaderboardHeight);
        const leaderboardBackground = this.add.rectangle(0, 0, leaderboardWidth, leaderboardHeight, colors.COLOR_GRAY)
            .setOrigin(0, 0);

        leaderboardContainer.add(leaderboardBackground);

        const nicknameStartX = leaderboardWidth * 0.15;
        const nicknameStartY = 30;

        const scoreStartX = leaderboardWidth * 0.7
        const spacingY = 30;

        const textStyle = {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#000000'
        }
        for (let i = 0; i < scores.length; i++) {
            const scoreObject = scores[i];
            const nickname = scoreObject.nickname;
            const score = scoreObject.score;
            
            // Add the name first
            const nicknameX = nicknameStartX;
            const nicknameY = i * spacingY + nicknameStartY;
            const nicknameText = this.add.text(nicknameX, nicknameY, nickname, textStyle).setOrigin(0, 0);
            leaderboardContainer.add(nicknameText);
            
            // Then the score
            const scoreX = scoreStartX; 
            const scoreY = nicknameY;

            const scoreText = this.add.text(scoreX, scoreY, score, textStyle).setOrigin(0, 0);
            leaderboardContainer.add(scoreText);
        }
    }
}