import Player from "./Player.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        Player.preload(this);
        this.load.image('floor', 'assets/images/Tilesets/TilesetFloor.png');
        this.load.image('water', 'assets/images/Tilesets/TilesetWater.png');
        this.load.tilemapTiledJSON('map', 'assets/images/map.json')

    }

    create() {
        const map = this.make.tilemap({ key: 'map' });

        const tileset = map.addTilesetImage('TilesetFloor', 'floor', 16, 16, 0, 0);
        const waterTileset = map.addTilesetImage('TilesetWater', 'water', 16, 16, 0, 0);
        
        const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
        const layer2 = map.createStaticLayer('Tile Layer 2', tileset, 0, 0);
        const layer3 = map.createStaticLayer('Tile Layer 3', waterTileset, 0, 0);

        layer3.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(layer3);

        // create a new player
        this.player = new Player({
            scene: this, 
            x: 50, 
            y: 50, 
            texture: 'green_ninja_idle', 
            frame: 0
        });

        // create a test player
        let testPlayer = new Player({
            scene: this, 
            x: 200, 
            y: 200, 
            texture: 'green_ninja_idle', 
            frame: 0
        });
        

        // player movement keys ( w, s, d, a )
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            left: Phaser.Input.Keyboard.KeyCodes.A,
        })

        // create player animations
        this.player.createAnimations();
    }

    update() {
        this.player.update();
    }
}