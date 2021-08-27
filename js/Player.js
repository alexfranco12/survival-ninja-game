export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame} = data;

        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x, this.y, 12, {
            isSensor: false, 
            label: 'playerCollider'
        })
        let playerSensor = Bodies.circle(this.x, this.y, 24, {
            isSensor: true, 
            label: 'playerSensor'
        })
        const compoundBody = Body.create({
            parts: [ playerCollider, playerSensor ],
            frictionAir: 0.35
        });

        // stops the player from rotating when interacted with
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        scene.load.spritesheet('green_ninja_idle', 'assets/Actor/Characters/GreenNinja/SeparateAnim/Idle.png', 
        { 
            frameWidth: 16, 
            frameHeight: 16, 
            endFrame: 4 
        });
        scene.load.spritesheet('green_ninja_walk', 'assets//Actor/Characters/GreenNinja/SeparateAnim/Walk.png', 
        { 
            frameWidth: 16, 
            frameHeight: 16, 
            endFrame: 16 
        });
    }

    createAnimations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('green_ninja_idle', { 
                frames: [0]
            }),
            frameRate: 0,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_LR',
            frames: this.anims.generateFrameNumbers('green_ninja_walk', { 
                frames: [2, 6, 10, 14]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_U',
            frames: this.anims.generateFrameNumbers('green_ninja_walk', { 
                frames: [1, 5, 9, 13]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_D',
            frames: this.anims.generateFrameNumbers('green_ninja_walk', { 
                frames: [0, 4, 8, 12]
            }),
            frameRate: 10,
            repeat: -1
        });
      

    }

    get velocity() {
        return this.body.velocity
    }

    update() {
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();

        // movement left or right
        if (this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
            this.flipX = false;
            this.anims.play('walk_LR', true);
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
            this.flipX = true;
            this.anims.play('walk_LR', true);
        } else if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
            this.anims.play('walk_U', true);
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
            this.anims.play('walk_D', true);
        } else {
            this.anims.play('idle', true);
        }

        // ensures the vector for speed stays at 1 and scale by 2.5
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y)

        // if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
        //     this.anims.play('walk', true)
        // } else {
        //     this.anims.play('idle', true)
        // }
    }
}