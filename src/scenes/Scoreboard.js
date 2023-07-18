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
    async create() {

        this.createBackground();
        this.createScoresText();

        await this.leaderboard.post(this.newScore);
        const scores = await this.leaderboard.loadFirstPage();
        console.log(scores);

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
            fontSize: '45px'
        })
            .setOrigin(0.5);
    }
    /**
     * 
     * @param {object} jsonScores 
     */
    updateScoresText(jsonScores) {
        this.scoresText.text = 'loaded';
        Object.entries(jsonScores).forEach(entry => {
            const [key, value] = entry;
            const nickname = value.nickname;
            const score = value.score;
            console.log(nickname, score);
        })
    }
    init() {

    firebase.initializeApp(firebaseConfig);
        this.load.plugin('rexfirebaseplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfirebaseplugin.min.js', true);
        this.plugins.get('rexfirebaseplugin').add.leaderBoard(firebaseConfig);//error
        var rexfire = new window.rexfirebase();

        this.leaderboard = rexfire.add.leaderboard({
            root: 'leaderboard'
        })
        this.leaderboard.setUser({
            userID: 'test',
            userName: 'Gazdik'

        })
    }
    update() {

    }
}