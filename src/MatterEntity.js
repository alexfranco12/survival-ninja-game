import DropItem from "./DropItem.js";

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {name, scene, x, y, health, drops, texture, frame, depth} = data;
        super(scene.matter.world, x, y, texture, frame);

        this.x += this.width/2;
        this.y -= this.height/2;
        this.depth = depth || 1;
        this.name = name;
        this.health = health;
        this.drops = drops;


        // underscore used when utilizing a getter function
        this._position = new Phaser.Math.Vector2(this.x, this.y);

        // add sounds associated with entity
        if (this.name) this.sound = this.scene.sound.add(this.name)
        
        // add entity to game
        this.scene.add.existing(this);
    }

    get position() {
        this._position.set(this.x, this.y);
        return this._position;
    }

    get velocity() {
        return this.body.velocity;
    }

    get dead() {
        return this.health <= 0;
    }

    // death setting for every entity in the game
    onDeath = () => {

    };

    hit = () => {
        if(this.sound) this.sound.play();
        this.health--;

        // if resource is detroyed
        if (this.name == 'tree_1' && this.dead) {
            new DropItem({
                scene: this.scene,
                x: this.x,
                y: this.y,
            })
        }

        if (this.dead) {
            this.onDeath();
        }
    }
}