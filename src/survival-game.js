import MainScene from "./MainScene.js";
import StartScene from "./StartScene.js";

const config = {
    width: 512,
    height: 368,
    backgroundColor: '#FFFFFF',
    type: Phaser.AUTO,
    parent: 'survival-game',
    scene: [ StartScene, MainScene ],
    scale: {
        zoom: 2,
    },
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: {
                y: 0
            },
        }
    },
    // Install the scene plugin
    plugins: {
        scene: [
        {
            plugin: PhaserMatterCollisionPlugin.default, // The plugin class
            key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision

            // Note! If you are including the library via the CDN script tag, the plugin 
            // line should be:
            // plugin: PhaserMatterCollisionPlugin.default
        }
        ]
    }
}

new Phaser.Game(config);