import MatterEntity from "./MatterEntity.js";

export default class Player extends MatterEntity {
    static preload(scene) {
        scene.load.spritesheet('green_ninja_idle', './assets/Actor/Characters/GreenNinja/SeparateAnim/Idle.png', 
        { 
            frameWidth: 16, 
            frameHeight: 16, 
            endFrame: 4 
        });
        scene.load.spritesheet('green_ninja_walk', './assets/Actor/Characters/GreenNinja/SeparateAnim/Walk.png', 
        { 
            frameWidth: 16, 
            frameHeight: 16, 
            endFrame: 16 
        });

        scene.load.audio('player', './assets/Sounds/Game/Sword2.wav')
        scene.load.image('axe', './assets/Items/Weapons/Axe/Sprite.png')
        scene.load.image('green_ninja_dead', './assets/Actor/Characters/GreenNinja/SeparateAnim/Dead.png')
    }
    
    constructor(data) {
        let {scene, x, y, texture, frame} = data;
        super({
            ...data,
            health: 10,
            drops: [],
            name: 'player'
        });

        this.touching = [];

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

        /*
            Sprite Weapons
        */
        this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 25, 25, 'axe');
        this.spriteWeapon.setScale(0.8);
        this.spriteWeapon.setOrigin(-.5, 1);
        this.scene.add.existing(this.spriteWeapon);

        this.scene.input.on('pointermove', pointer => {
            if (!this.dead) this.setFlipX(pointer.worldX < this.x)
        })

        this.createMatterCollisions(playerSensor);
        this.createPickupCollisions(playerCollider);
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

    update() {
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();

        if (this.dead) {
            return;
        }

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

        this.spriteWeapon.setPosition(this.x, this.y)
        this.weaponRotate();
    }

    weaponRotate() {
        let pointer = this.scene.input.activePointer;

        if (pointer.isDown) {
            this.weaponRotation +=6;
        } else {
            this.weaponRotation = 0
        }

        if (this.weaponRotation > 100) {
            this.whackStuff();
            this.weaponRotation = 0
        }

        if (this.flipX) {
            this.spriteWeapon.setAngle(-this.weaponRotation - 90);
        } else {
            this.spriteWeapon.setAngle(this.weaponRotation);
        }

        this.spriteWeapon.setAngle(this.weaponRotation);
    }

    createMatterCollisions(playerSensor) {
        this.scene.matterCollision.addOnCollideStart({
            objectA:[playerSensor],
            callback: other => {
                if (other.bodyB.isSensor) return;
                this.touching.push(other.gameObjectB);
            },
            context: this.scene,
        });

        this.scene.matterCollision.addOnCollideEnd({
            objectA: [playerSensor],
            callback: other => {
                this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
            },
            context: this.scene,
        })
    }

    // pickup items
    createPickupCollisions(playerCollider) {
        this.scene.matterCollision.addOnCollideStart({
            objectA:[playerCollider],
            callback: other => {
                if (other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup()
            },
            context: this.scene,
        });

        this.scene.matterCollision.addOnCollideActive({
            objectA: [playerCollider],
            callback: other => {
                if (other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup()
            },
            context: this.scene,
        })
    }

    // event for attacking
    whackStuff() {
        this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
        this.touching.forEach(gameObj => {
            gameObj.hit();
        })
    }

    // event for when the main player dies
    onDeath = () => {
        this.anims.stop();
        this.setTexture('green_ninja_dead')
        this.setOrigin(0.5);
        this.spriteWeapon.destroy();

        this.scene.add.text(this.x - 55, this.y - 32, 'Game Over', { 
            fontSize: '20px', 
            fill: '#000000' 
        });
    }
}