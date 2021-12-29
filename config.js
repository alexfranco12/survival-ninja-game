import MainScene from "./src/scenes/MainScene.js";

const config = {
  width: 512,
  height: 432,
  backgroundColor: '#D3D3D3',
  type: Phaser.AUTO,
  parent: 'game-container',
  scene: [ MainScene ],
  scale: {
    parent: 'game-container',
    autoCenter: Phaser.Scale.FIT,
    width: 512,
    height: 432,
    zoom: 2
  },
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      gravity: {
        y: 0
      },
    }
  },
  // Install the scene plugin
  plugins: {
    scene: [
      {
        /* 
         * Note! If you are including the library via the CDN script tag, the plugin 
         * line should be: 
         *  plugin: PhaserMatterCollisionPlugin.default
        */ 
        plugin: PhaserMatterCollisionPlugin.default, // plugin class
        key: "matterCollision",
        mapping: "matterCollision"
      }
    ]
  },
}

new Phaser.Game(config);