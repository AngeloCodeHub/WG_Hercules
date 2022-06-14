import { CustomScene } from './CustomTools.js';


export class JewelleryAin extends CustomScene {
    constructor(game, JewelleryX, JewelleryY, control1X, control1Y, control2X, control2Y, spinRadiusX, spinRadiusY, number) {
        super("JewelleryAin");
        this.mainGame = game;
        this.JewelleryX = JewelleryX;
        this.JewelleryY = JewelleryY;
        this.CubicBezier = { control1X, control1Y, control2X, control2Y };//三次貝塞爾曲線兩點座標
        this.spinRadiusX = spinRadiusX;
        this.spinRadiusY = spinRadiusY;
        this.number = number;
        this.JewelleryEndFinish = false;//消失動畫撥放完畢
    }


    preload() {
        let ego = this.mainGame;
        ego.load.setBaseURL('./');
    }

    create() {
        let ego = this.mainGame;
        this.JewelleryAin;
        ego.anims.create({ key: 'JewelleryAin', frames: ego.anims.generateFrameNumbers('JewelleryContinuousGraph'), frameRate: 20, repeat: -1 });
        ego.anims.create({ key: 'JewelleryBombingAin', frames: ego.anims.generateFrameNumbers('JewelleryBombing'), frameRate: 20, repeat: 0 });
        this.JewelleryObject = ego.add.sprite(this.JewelleryX, this.JewelleryY, 'JewelleryContinuousGraph').setScale(1).setAlpha(0);
        this.JewelleryText = ego.add.image(this.JewelleryX, this.JewelleryY, 'x2').setScale(1).setAlpha(0);//光球文字
        this.DepthFar = [3, 2, 1];//遠方光球圖層
        this.DepthNear = [3, 4, 5];//近方光球圖層

        this.JewelleryHoverTask = {
            targets: [this.JewelleryObject, this.JewelleryText],
            y: { value: '+=20', yoyo: true, repeat: -1 },
            alpha: 1,
            ease: 'Sine.easeInOut',
            duration: 1000,
            onStart: function () {
                this.JewelleryObject.play('JewelleryAin');
                this.JewelleryObject.x = this.JewelleryX;
                this.JewelleryObject.y = this.JewelleryY;
                this.JewelleryObject.scale = 1;
                this.JewelleryText.x = this.JewelleryX;
                this.JewelleryText.y = this.JewelleryY;
                this.JewelleryText.scale = 1;
                this.JewelleryEndFinish = false;
            }.bind(this),
            onUpdate: function () {
            }.bind(this),
            onComplete: function () {
                // if (this.JewelleryAin != null) { this.JewelleryAin.remove(); }
                // this.JewelleryAin = ego.tweens.add(this.JewelleryMoveTask);
            }.bind(this),
        }
        let graphics = ego.add.graphics();//建立圖形
        graphics.lineStyle(2, 0xffffff, 1);//設定圖形
        let movetime = { t: 0 };//移動時間軸
        let spinOrigin = { x: (220 + this.spinRadiusX * Math.cos((Math.PI / 180) * (-90 + 360 * 0))), y: (235) + this.spinRadiusY * Math.sin((Math.PI / 180) * (-90 + 360 * 0)) }//旋動動畫的原點座標
        let path = new Phaser.Curves.Path(this.JewelleryX, this.JewelleryY);//建立路徑物件
        let follower = new Phaser.Math.Vector2();//暫存2維座標
        path.cubicBezierTo(spinOrigin.x, spinOrigin.y, this.CubicBezier.control1X, this.CubicBezier.control1Y, this.CubicBezier.control2X, this.CubicBezier.control2Y);//建立從上一個端點到下一個端點的三次貝塞爾曲線
        // path.draw(graphics);//顯示路徑線
        this.JewelleryMoveTask = {
            targets: [this.JewelleryObject, movetime, this.JewelleryText],
            t: { from: 0, to: 1 },
            //x: 220 + 50 * Math.cos((Math.PI / 180) * (-90 + 360 * 0)),
            // y: { value: '-=50', yoyo: true, duration: 200, },
            // y: (this.JewelleryY + 25) + 25 * Math.sin((Math.PI / 180) * (-90 + 360 * 0)),
            scale: (1 + 0.2 * Math.sin((Math.PI / 180) * (-90 + 360 * 0))) * 1,
            ease: 'Sine.easeInOut',
            duration: 400,
            onStart: function () {
                this.JewelleryObject.x = this.JewelleryX;
                this.JewelleryObject.y = this.JewelleryY;
                this.JewelleryObject.scale = 1;
                this.JewelleryText.x = this.JewelleryX;
                this.JewelleryText.y = this.JewelleryY;
                this.JewelleryText.scale = 1;
            }.bind(this),
            onUpdate: function () {
                path.getPoint(movetime.t, follower);//得到點位置
                this.JewelleryObject.x = follower.x;
                this.JewelleryObject.y = follower.y;
                this.JewelleryText.x = follower.x;
                this.JewelleryText.y = follower.y;
            }.bind(this),
            onComplete: function () {
                if (this.JewelleryAin != null) { this.JewelleryAin.remove(); }
                this.JewelleryAin = ego.tweens.add(this.spinJewelleryTask);
            }.bind(this),
        }
        let spin = { t: 0 };
        let data = {
            x: 0,
            y: 0,
            z: 0,
        };
        this.spinJewelleryTask = {
            targets: spin,
            t: { from: 0, to: 1 },
            duration: 2000,
            onUpdate: function () {
                let tmp = (Math.PI / 180) * (-90 + 360 * spin.t);
                data.x = 220 + this.spinRadiusX * Math.cos(tmp);
                data.y = (235) + this.spinRadiusY * Math.sin(tmp);//物件座標Y +25
                data.z = (1 + 0.2 * Math.sin(tmp)) * 1;
                this.JewelleryObject.x = data.x;
                this.JewelleryObject.y = data.y;
                this.JewelleryObject.scale = data.z;
                this.JewelleryText.x = data.x;
                this.JewelleryText.y = data.y;
                this.JewelleryText.scale = data.z;
                if (spin.t >= 0.25 && spin.t < 0.75) {
                    this.JewelleryObject.setDepth(this.DepthNear[this.number]);
                    this.JewelleryText.setDepth(this.DepthNear[this.number]);
                }
                else {
                    this.JewelleryObject.setDepth(this.DepthFar[this.number]);
                    this.JewelleryText.setDepth(this.DepthFar[this.number]);
                }
            }.bind(this),
            repeat: -1
        }
        let end = { t: 0 };
        this.JewelleryEndTask = {
            targets: [this.JewelleryObject, this.JewelleryText, end],
            t: { from: 0, to: 1 },
            // y: '-=50',
            // alpha: { from: 1, to: 0 },
            duration: 200,
            onStart: function () {
                this.JewelleryText.setAlpha(0);
                this.JewelleryObject.anims.remove('JewelleryAin');
                this.JewelleryObject.setTexture('JewelleryBombing');
                this.JewelleryObject.play('JewelleryBombingAin');
                this.mainGame.MusicAndSE.PlaySoundEffect('SE_ligheball');
            }.bind(this),
            onComplete: function () {
                this.JewelleryObject.setAlpha(0);
                this.JewelleryEndFinish = true;
            }.bind(this),
        }
        this.JewelleryEndTask_NoWin = {
            targets: [this.JewelleryObject, this.JewelleryText, end],
            t: { from: 0, to: 1 },
            y: '-=50',
            alpha: { from: 1, to: 0 },
            ease: 'Back.easeInOut',
            duration: 500,
            onStart: function () {                
            }.bind(this),
            onComplete: function () {
                this.JewelleryObject.anims.remove('JewelleryAin');
                this.JewelleryEndFinish = true;
            }.bind(this),
        }
        // this.JewelleryAin = ego.tweens.add(this.JewelleryHoverTask);
    }
    PlayHoverJewelleryAni() {
        if (this.JewelleryAin != null) { this.JewelleryAin.remove(); }
        this.JewelleryAin = this.mainGame.tweens.add(this.JewelleryHoverTask);
    }
    PlayMoveJewelleryAni() {
        if (this.JewelleryAin != null) { this.JewelleryAin.remove(); }
        this.JewelleryAin = this.mainGame.tweens.add(this.JewelleryMoveTask);
    }
    PlayEndJewelleryAni() {
        if (this.JewelleryAin != null) { this.JewelleryAin.remove(); }
        this.JewelleryAin = this.mainGame.tweens.add(this.JewelleryEndTask);
    }
    PlayNoWinEndJewelleryAni() {
        if (this.JewelleryAin != null) { this.JewelleryAin.remove(); }
        this.JewelleryAin = this.mainGame.tweens.add(this.JewelleryEndTask_NoWin);
    }
    getJewelleryEndFinish() { return this.JewelleryEndFinish; }
    update() {
        // console.log(this.Role_HeraclesAin.anims.currentFrame.index);
    }
}