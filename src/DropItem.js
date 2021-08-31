export default class DropItem extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y} = data;
        super(scene.matter.world, x, y, 'nature_resources', 'log_1');

        // add item to game
        this.scene.add.existing(this);

        const {Bodies} = Phaser.Physics.Matter.Matter;
        var circleCollider = Bodies.circle(this.x, this.y, 10, {
            isSensor: false,
            label: 'collider'
        });
        this.setExistingBody(circleCollider);
        this.setFrictionAir(1);
        this.setScale(0.75);

        // add success sound when picking items
        this.sound = this.scene.sound.add('success')
    }

    pickup = () => {
        this.destroy();
        this.sound.play();
        return true;
    }
}