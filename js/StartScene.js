export default class StartScene extends Phaser.Scene {
    constructor() {
        super( 'StartScene' );
    }

    preload() {

    }

    create() {
        this.add.text(95, 150, 'Click to Start!', { fontSize: '30px', fill: '#000000' });
    
        this.input.on('pointerup', () => {
        this.scene.stop('StartScene')
        this.scene.start('MainScene')
        });
	}
}