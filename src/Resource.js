import MatterEntity from "./MatterEntity.js";

export default class Resource extends MatterEntity {
    static preload(scene) {
        scene.load.atlas('nature_resources', './assets/atlas/nature_resources.png', './assets/Atlas/nature_resources_atlas.json')

        // load sounds
        scene.load.audio('tree_1', './assets/Sounds/Game/Hit.wav');
        scene.load.audio('rock_3', './assets/Sounds/Game/Hit.wav');
        scene.load.audio('rock_4', './assets/Sounds/Game/Hit.wav');
        scene.load.audio('success', './assets/Sounds/Game/Success1.wav');
    }
    
    constructor(data) {
        let {scene, resource} = data;
        let drops = resource.properties.find(p => p.name == 'drops').value;
        let depth = resource.properties.find(p => p.name == 'depth').value;
        super({
            scene,
            x: resource.x,
            y: resource.y,
            texture: 'nature_resources',
            frame: resource.type,
            drops,
            health: 5,
            name: resource.type,
            depth,
        })

        // y origin is a property ??
        // let yOrigin = resource.properties.find(p => p.name == 'yOrigin').value;
        // this.y = this.y + this.height * (yOrigin - 0.5);
        const {Bodies} = Phaser.Physics.Matter.Matter;
        var circleCollider = Bodies.circle(this.x, this.y, 12, {
            isSensor: false,
            label: 'collider'
        });
        this.setExistingBody(circleCollider);
        this.setStatic(true)
    }
}