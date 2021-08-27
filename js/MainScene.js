import Player from "./Player.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        Player.preload(this);
        this.load.image('floor', 'assets/Backgrounds/Tilesets/TilesetFloor.png');
        this.load.image('water', 'assets/Backgrounds/Tilesets/TilesetWater.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json')

        this.load.spritesheet('nature', 'assets/Backgrounds/Tilesets/TilesetNature.png', 
        { 
            frameWidth: 32, 
            frameHeight: 32, 
            endFrame: 8 
        });
    }

    create() {
        // create a tilemap
        const map = this.make.tilemap({ key: 'map' });

        // create tilesets w/ .PNGs we loaded
        const tileset = map.addTilesetImage('TilesetFloor', 'floor', 16, 16, 0, 0);
        const waterTileset = map.addTilesetImage('TilesetWater', 'water', 16, 16, 0, 0);
        
        // create variables for each layer created in TILED
        const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
        const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
        const layer3 = map.createLayer('Tile Layer 3', waterTileset, 0, 0);

        layer3.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(layer3);

        let tree = new Phaser.Physics.Matter.Sprite(this.matter.world, 250, 100, 'nature');


        // add nature sprites to world
        this.add.existing(tree).setStatic(true);




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
            frame: 3
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