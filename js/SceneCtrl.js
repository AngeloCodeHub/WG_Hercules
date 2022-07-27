import * as phaser from './phaser.min.js';
import { MainGame } from './MainGame.js';
// import { Loading } from './loading.js';
// import { SceneLoading } from './loading.js';

class Controller {
  constructor() {
    var config = {
      // type: Phaser.AUTO,
      type: Phaser.WEBGL,
      backgroundColor: '#000000',
      parent: "FruitParty",
      dom: { createContainer: true },
      scale: {
        mode: Phaser.Scale.FIT,
        parent: document.getElementById("MainGame"),
        autoCenter: Phaser.Scale.center,
        width: 720,
        height: 1280,
      },
      // scene: [new Loading("MainGame"), MainGame]
      // scene: [new SceneLoading("MainGame"), MainGame]
      scene: [MainGame]
    };
    this.game = new Phaser.Game(config);
    this.game.canSound = true;
  }
  CheckCanSound() {
    return Game.game.canSound;
  }
  addScene(scenename) {
    this.game.scene.add(scenename, this.scenelist[scenename], true);
  }
  removeScene(scenename) {
    this.game.scene.remove(scenename);
  }
  changeScene(now, next) {
    this.game.scene.getScene(now).clearAllTexture();
    this.game.scene.remove(now);
    this.game.scene.add(next, this.scenelist[next], true);
  }
}

export var Game = new Controller();

Game.game.events.on('blur', function () {
  Game.game.canSound = false;
}, Game);

Game.game.events.on('focus', function () {
  Game.game.canSound = true;

}, Game);

Game.game.events.on('hidden', function () {
  Game.game.canSound = false;
}, Game);
