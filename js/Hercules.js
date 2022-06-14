



export class Hercules {
    constructor(game) {
        this.game = game;
        this.object = [];
        this.objectfreegame = [];
    }
    preload() {
        let ego = this.game;
        //#region 測試用背景        
        ego.onceload.image('hercules_cloud_3', 'assets/hercules_cloud_001_v3.png');
        ego.onceload.image('hercules_cloud_freegame', 'assets/hercules_cloud_003_v3.png');

        ego.onceload.image('freegames_bg', 'assets/freegames_bg.png');
        ego.onceload.image('freebar', 'assets/freebar.png');
        ego.load.bitmapFont('free_number', 'assets/FreeGame_number.png', 'assets/FreeGame_number.xml')
        //#endregion
    }
    create() {
        let ego = this.game;
        this.hercules_cloud_1 = ego.add.image(360, 250, 'hercules_cloud_3').setScale(0.6);
        this.hercules_cloud_2 = ego.add.image(360, 250, 'hercules_cloud_3').setScale(0.7);
        this.hercules_cloud_3 = ego.add.image(360, 250, 'hercules_cloud_3').setScale(0.8);
        this.hercules_cloud_4 = ego.add.image(360, 250, 'hercules_cloud_3').setScale(0.9);
        this.hercules_cloud_5 = ego.add.image(360, 250, 'hercules_cloud_3');
        this.object = ego.add.container(0, 0);
        this.object.add([this.hercules_cloud_1, this.hercules_cloud_2, this.hercules_cloud_3, this.hercules_cloud_4, this.hercules_cloud_5]);

        this.hercules_cloudfreegame_1 = ego.add.image(360, 250, 'hercules_cloud_freegame').setScale(0.6);
        this.hercules_cloudfreegame_2 = ego.add.image(360, 250, 'hercules_cloud_freegame').setScale(0.7);
        this.hercules_cloudfreegame_3 = ego.add.image(360, 250, 'hercules_cloud_freegame').setScale(0.8);
        this.hercules_cloudfreegame_4 = ego.add.image(360, 250, 'hercules_cloud_freegame').setScale(0.9);
        this.hercules_cloudfreegame_5 = ego.add.image(360, 250, 'hercules_cloud_freegame');
        this.objectfreegame = ego.add.container(0, 0).setAlpha(0);
        this.objectfreegame.add([this.hercules_cloudfreegame_1, this.hercules_cloudfreegame_2, this.hercules_cloudfreegame_3, this.hercules_cloudfreegame_4, this.hercules_cloudfreegame_5]);

        this.freebar = ego.add.image(360, 360, 'freebar').setAlpha(0).setDepth(1);
        this.free_number = ego.add.bitmapText(368, 408, 'free_number', 0).setScale(1.5).setAlpha(0).setOrigin(0.5, 1).setDepth(1);
        this.freegames_bg = ego.add.image(360, 640, 'freegames_bg').setAlpha(0).setDepth(1);


        this.Disappearcloud = {
            targets: [this.object, this.game.G14_topBG4],
            alpha: { from: 1, to: 0 },
            duration: 1000,
            ease: 'Sine.easeInOut',
            onStart: function () {
            }.bind(this),
            onComplete: function () {
            }.bind(this)
        }
        this.Appearcloud = {
            targets: [this.object, this.game.G14_topBG4],
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Sine.easeInOut',
            onStart: function () {
            }.bind(this),
            onComplete: function () {
            }.bind(this)
        }
        this.Disappearobjectfreegame = {
            targets: [this.objectfreegame, this.game.G14_topBG4_free, this.freebar, this.free_number],
            alpha: { from: 1, to: 0 },
            duration: 1000,
            ease: 'Sine.easeInOut',
            onStart: function () {
            }.bind(this),
            onComplete: function () {
                this.game.status = 1;
            }.bind(this)
        }
        this.Appearobjectfreegame = {
            targets: [this.objectfreegame, this.game.G14_topBG4_free],
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Sine.easeInOut',
            onStart: function () {
            }.bind(this),
            onComplete: function () {
                this.game.status = 1;
            }.bind(this)
        }
        //#region 免費滾輪中獎畫面顯示動畫
        this.AppearFreeGameBG = {
            targets: this.freegames_bg,
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Sine.easeInOut',
            hold: 1000,
            yoyo: true,
            onStart: function () {
            }.bind(this),
            onYoyo: function () {
                this.freebar.setAlpha(1);
                this.free_number.setAlpha(1);
            }.bind(this),
            onComplete: function () {
                if (this.cloud != null) { this.cloud.remove(); }
                if (this.freegamecloud != null) { this.freegamecloud.remove(); }
                this.cloud = this.game.tweens.add(this.Disappearcloud);
                this.freegamecloud = this.game.tweens.add(this.Appearobjectfreegame);
            }.bind(this)
        }
        //#endregion
    }
    changeBackGround(index) {
        if (index == 2) {
            if (this.freegameBG != null) { this.freegameBG.remove(); }
            this.freegameBG = this.game.tweens.add(this.AppearFreeGameBG);
        }
        else if (index == 1) {
            if (this.cloud != null) { this.cloud.remove(); }
            if (this.freegamecloud != null) { this.freegamecloud.remove(); }
            this.cloud = this.game.tweens.add(this.Appearcloud);
            this.freegamecloud = this.game.tweens.add(this.Disappearobjectfreegame);

            console.log("UpdateScore");
            setTimeout(() => { this.game.UpdateScore(500); }, 1000);
        }
    }
    update() {
        for (let i = 1, j = 4; i < 5; i++, j--) {
            let tmp = (1 - (j * 0.25)) + 0.25;
            this.object.list[i].scale += 0.001;
            this.object.list[i].y -= 1 * tmp;
            this.objectfreegame.list[i].scale += 0.001;
            this.objectfreegame.list[i].y -= 1 * tmp;
        }

        // this.object.list[3].scale += 0.001;
        // this.object.list[3].y -= 1;

        // this.object.list[2].scale += 0.001 * 0.75;
        // this.object.list[2].y -= 1 * 0.75;

        // this.object.list[1].scale += 0.001 * 0.5;
        // this.object.list[1].y -= 1 * 0.5;

        // this.object.list[1].scale += 0.001 * 0.5;
        // this.object.list[1].y -= 1 * 0.5;

        if (this.object.list[4].y <= 0 - 231) {
            this.object.list[4].y = 250;
            this.object.list[4].scale = 0.6;
            this.object.sendToBack(this.object.list[4]);
        }
        if (this.objectfreegame.list[4].y <= 0 - 231) {
            this.objectfreegame.list[4].y = 250;
            this.objectfreegame.list[4].scale = 0.6;
            this.objectfreegame.sendToBack(this.objectfreegame.list[4]);
        }

    }
}
