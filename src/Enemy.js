import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {
    static preload(scene) {
        scene.load.spritesheet('snake', './assets/Actor/Monsters/Snake.png', 
        { 
            frameWidth: 16, 
            frameHeight: 16, 
            endFrame: 16 
        });
        scene.load.spritesheet('lizard', './assets/Actor/Monsters/Lizard.png', 
        { 
            frameWidth: 16, 
            frameHeight: 16, 
            endFrame: 16 
        });
        scene.load.spritesheet('mushroom', './assets/Actor/Monsters/Mushroom.png', 
        { 
            frameWidth: 16, 
            frameHeight: 16, 
            endFrame: 16 
        });

        scene.load.audio('snake', './assets/Sounds/Game/Hit.wav');
        scene.load.audio('lizard', './assets/Sounds/Game/Hit.wav');
        scene.load.audio('mushroom', './assets/Sounds/Game/Hit.wav');
    }

    constructor(data) {
        let {scene, enemy} = data;
        let drops = enemy.properties.find(p => p.name == 'drops').value;
        let health = enemy.properties.find(p => p.name == 'health').value;

        super({
            scene,
            x: enemy.x,
            y: enemy.y,
            texture: enemy.type,
            drops, 
            health,
            name: enemy.type,
        })

        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        let enemyCollider = Bodies.circle(this.x, this.y, 12, {
            isSensor: false, 
            label: 'enemyCollider'
        })

        // large sensor for enemies
        let enemySensor = Bodies.circle(this.x, this.y, 80, {
            isSensor: true, 
            label: 'enemySensor'
        })
        const compoundBody = Body.create({
            parts: [ enemyCollider, enemySensor ],
            frictionAir: 0.35
        });

        // stops the player from rotating when interacted with
        this.setExistingBody(compoundBody);
        this.setFixedRotation();

        // create enemy animations
        this.createAnimations();

        this.scene.matterCollision.addOnCollideStart({
            objectA: [enemySensor],
            callback: other => {
                if (other.gameObjectB && other.gameObjectB.name == 'player') {
                    this.attacking = other.gameObjectB;
                }
            },
            context: scene,
        })
    }

    createAnimations() {
        // SNAKE
        this.anims.create({
            key: 'snake_idle',
            frames: this.anims.generateFrameNumbers('snake', { 
                frames: [0, 4, 8, 12]
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'snake_walk',
            frames: this.anims.generateFrameNumbers('snake', { 
                frames: [3, 7, 11, 15]
            }),
            frameRate: 10,
            repeat: -1
        });
        
        // LIZARD
        this.anims.create({
            key: 'lizard_idle',
            frames: this.anims.generateFrameNumbers('lizard', { 
                frames: [0, 4, 8, 12]
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'lizard_walk',
            frames: this.anims.generateFrameNumbers('lizard', { 
                frames: [3, 7, 11, 15]
            }),
            frameRate: 10,
            repeat: -1
        });

        // MUSHROOM
        this.anims.create({
            key: 'mushroom_idle',
            frames: this.anims.generateFrameNumbers('mushroom', { 
                frames: [0, 4, 8, 12]
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'mushroom_walk',
            frames: this.anims.generateFrameNumbers('mushroom', { 
                frames: [3, 7, 11, 15]
            }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        if (this.dead) return;
        if (this.attacking) {
            let direction = this.attacking.position.subtract(this.position);
            if (direction.length() > 24) {
                let v = direction.normalize();
                this.setVelocityX(direction.x);
                this.setVelocityY(direction.y);
                if (this.attackTimer) {
                    clearInterval(this.attackTimer);
                    this.attackTimer = null;
                }
            } else {
                if (this.attackTimer == null) {
                    // set attack speed
                    this.attackTimer = setInterval(this.attack, 500, this.attacking);
                }
            }
        }

        this.setFlipX(this.velocity.x < 0);

        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play(`${this.name}_walk`, true)
        } else {
            this.anims.play(`${this.name}_idle`, true)
        }
    }

    attack = (target) => {
        if (target.dead || this.dead) {
            clearInterval(this.attackTimer);
            return;
        } else {
            target.hit();
        }
    }

    // event for when enemies die
    onDeath = () => {
        this.scene.totalDead++;
        if(this.scene.totalDead === this.scene.enemies.length) {
            this.scene.add.text(this.x - 55, this.y - 32, 'You Win!', { 
                fontSize: '20px', 
                fill: '#000000' 
            });
            this.scene.player.anims.stop();
        }
        this.destroy();
    }
}