export default class StartScene extends Phaser.Scene {
    constructor() {
        super( 'StartScene' );
    }

    preload() {
        this.load.image('ninja', './assets/Backgrounds/intro_ninja.png')
    }

    create() {
        this.add.text(15, 100, 'NINJA ADVENTURE', { 
            fontSize: '36px', 
            fill: '#000000' 
        });
        this.add.text(20, 160, 'Defeat all enemies to win!', { 
            fontSize: '18px', 
            fill: '#000000' 
        });
        this.add.text(75, 210, 'Click to Start', { 
            fontSize: '18px', 
            fill: '#000000' 
        });

        let image = this.add.image(350, 150, 'ninja');
        image.setScale(.25)

    
        this.input.on('pointerup', () => {
        this.scene.stop('StartScene')
        this.scene.start('MainScene')
        });
	}
}