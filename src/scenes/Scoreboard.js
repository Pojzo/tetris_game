import { scoresEndpoint } from "../config/api_config.js";
import { gameConfig } from "../config/game_config.js";
import * as colors from '../game/colors.js';
import { firebaseConfig } from '../config/api_config.js';

// Initialize the database
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

/**
 * @brief Add data to the scoreboard using the database initialized using firebase.firestore()
 * @param {object} data 
 * @returns {Promise} 
 */

const scoresCollection = "scores";

export const addScore = data => {
    const { nickname, score, level, tiles} = data;
    console.log(data);

    return new Promise((resolve, reject) => {
        db.collection(scoresCollection).add({
            nickname: nickname,
            score: score,
            level: level,
            tiles: tiles
        })
            .then(docRef => {
                resolve("Added the score");
            })
            .catch(error => {
                reject("Couldn't add score - problem with the database");
            })
    })
}

export default class ScoreboardScene extends Phaser.Scene {
    constructor() {
        super('scoreboard');
        this.scoreLimit = 10;
    }
    preload() {
    }
    async create() {
        this.createBackground();
        this.createButtons();

        this.getTopScores()
            .then(scores => {
                this.createLeaderBoard(scores)
            })
            .catch(err => {
                this.createLeaderBoard([])
            });
    }
    async getTopScores() {
        return new Promise((resolve, reject) => {
            db.collection(scoresCollection)
                .orderBy("score", "desc")
                .limit(this.scoreLimit)
                .get()
                .then(querySnapshot => {
                    const scores = [];
                    querySnapshot.forEach(doc => {
                        const data = doc.data()
                        scores.push({
                            nickname: data.nickname,
                            score: data.score,
                            level: data.level,
                            tiles: data.tiles
                        });
                    })
                    resolve(scores);
                })
                .catch(err => {
                    reject(error);
                })
        });
    }
    init(data) {
        this.previousScene = data.previousScene;
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
            this.scene.launch(this.previousScene);
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
        const retroBlueHex = '#336699';

        const leaderboardContainer = this.add.container(startX, startY);
        leaderboardContainer.setSize(leaderboardWidth, leaderboardHeight);
        const leaderboardBackground = this.add.rectangle(0, 0, leaderboardWidth, leaderboardHeight, colors.convertHexToColor(retroBlueHex))
            .setOrigin(0, 0);

        leaderboardContainer.add(leaderboardBackground);

        const nicknameStartX = leaderboardWidth * 0.15;
        const nicknameStartY = 30;

        const scoreStartX = leaderboardWidth * 0.7

        const fontSize = 23;
        const textStyle = {
            fontFamily: gameConfig.font,
            fontSize: fontSize,
            color: '#dd0000'
        }
        const spacingY = fontSize * 1.3;
        console.log(scores);
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