export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over');
    }
    preload() {
        this.input.keyboard.on('keydown-SPACE', () => this.startNewGame(), this);
    }

    create() {
        this.add.text(0, 0, 'Prehral si more gadzo', {
            fontSize: '24px',
        })
    }

    /**
     * @brief Reset the game by switching back to the game scene
     */
    startNewGame() {
        this.scene.start('game');
    }
}