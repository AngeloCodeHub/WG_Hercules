/**
 * 大廳到loading畫面
 */
import { CustomScene } from './CustomTools.js';
// import { MusicPlayer } from './MusicPlayer_Controller.js';
export class SceneLoading extends CustomScene {
    constructor(nextScene, from = null) {
        super("SceneLoading");
        this.target = nextScene;
        if (from != null) {
            from.clearAllTexture();
            from.scene.add("SceneLoading", this);
            from.scene.start("SceneLoading");
        }
        this.UseSetting;
    }
    preload() {
        super.preload();
        var self = this;
        self.load.setBaseURL('./');
        self.onceload.image("Bg", "assets/Loading/Loading_game_BG.png");
        self.onceload.image("icon", "assets/Loading/G014_heracles_logo.png");
        self.onceload.image("Loading_game_cloud", "assets/Loading/Loading_game_cloud.png");
        self.onceload.image("Loading_game_text_BG", "assets/Loading/Loading_game_text_BG.png");
        self.onceload.spritesheet("loading_image", "assets/Loading/Loading_spin_6x3.png", { frameWidth: 150, frameHeight: 150 });
        self.scene.launch(self.target);
        if (self.scene.isActive("Music") == false) { self.scene.launch("Music"); }
        var target = self.scene.manager.keys[self.target];
        target.load.once('complete', function () {
            self.anims.remove("Loading");
            self.clearAllTexture();
            self.scene.remove("SceneLoading");
        });
        //#region 機台相關(取資料 判定環境 回大廳)
        let AllVars = window.location.search.substring(1);
        let lobby = AllVars.split("L=");
        if (lobby.length == 1) { lobby = AllVars.split("l="); }
        if (lobby[1] != null) {
            self.UseSetting = lobby[1].split("&")[0];
            target.UseSetting = lobby[1].split("&")[0];
        }
        let betLimit = AllVars.split("B=");
        if (betLimit.length == 1) { betLimit = AllVars.split("b="); }
        if (betLimit[1] != null) target.betLimit = betLimit[1];
        //#endregion
    }
    create() {
        // super.create();
        var self = this;
        self.scene.bringToTop();
        self.add.image(360, 640, "Bg");
        self.add.image(360, 440, "icon").setScale(1.2, 1.2);
        self.add.image(360, 570, "Loading_game_cloud");
        //#region 判定電腦還是機台
        if (this.UseSetting == 'ROBOT1') {
            console.log('機台loading    ' + this.UseSetting);
        }
        else {
            self.add.text(360, 675, "本遊戲為超高中獎回報率的平台獨家遊戲", { font: '24pt Noto Sans CJK TC', bold: true, align: 'center' }).setOrigin(0.5, 0.5);
            console.log('電腦loading    ' + this.UseSetting);
        }
        //#endregion
        // self.add.image(360, 740, "Loading_game_text_BG");
        // self.add.text(360, 740, "水果盛宴", { font: 'bold 42pt Noto Sans CJK TC', bold: true, align: 'center' }).setOrigin(0.5, 0.5);
        self.anims.create({
            key: "Loading",
            frames: self.anims.generateFrameNames('loading_image', { start: 0, end: 17, first: 0 }),
            frameRate: 70,
            repeat: -1
        });
        self.tmp = self.add.sprite(360, 800, "loading_image", 0);
        self.tmp.anims.play("Loading");
        self.add.text(360, 900, "Loading...", { font: '30pt Noto Sans CJK TC', bold: true }).setOrigin(0.5, 0.5);
    }
}