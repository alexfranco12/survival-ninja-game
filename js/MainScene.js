import Enemy from "./Enemy.js";
import Player from "./Player.js";
import Resource from "./Resource.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.enemies = [];
    }

    preload() {
        Player.preload(this);
        Resource.preload(this);
        Enemy.preload(this);

        this.load.image('floor', 'assets/Backgrounds/Tilesets/TilesetFloor.png');
        this.load.image('water', 'assets/Backgrounds/Tilesets/TilesetWater.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json')
        
    }

    create() {
        // create a tilemap
        const map = this.make.tilemap({ key: 'map' });
        this.map = map;

        // create tilesets w/ .PNGs we loaded
        const tileset = map.addTilesetImage('TilesetFloor', 'floor', 16, 16, 0, 0);
        const waterTileset = map.addTilesetImage('TilesetWater', 'water', 16, 16, 0, 0);
        
        // create variables for each layer created in TILED
        const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
        const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
        const layer3 = map.createLayer('Tile Layer 3', waterTileset, 0, 0);

        layer3.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(layer3);

        /* 
            ADD NATURE TO THE WORLD
        */
        this.map.getObjectLayer('Resources').objects.forEach(resource => new Resource({
            scene: this, 
            resource
        }));

        /* 
            ADD ENEMIES TO THE WORLD
        */
        this.map.getObjectLayer('Enemies').objects.forEach(enemy => this.enemies.push(new Enemy({scene: this, enemy})));

        /*
            ADD CHARACTERS TO THE WORLD
        */
        // create a new player
        this.player = new Player({
            scene: this, 
            x: 50, 
            y: 50, 
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
        this.enemies.forEach(enemy => enemy.update())
    }
}