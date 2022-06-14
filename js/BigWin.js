import { Button } from './CustomTools.js';

export class BigWin {
    constructor(game) {
        this.game = game;

        // this.targetWinScore = 0;
        // this.myWinScore = 0;
        // this.tmpScore = 5000;

        this.nowBigWinLevel = 0;
        this.showBigWinCoin = false;

    }

    preload() {
        let ego = this.game;

        ego.onceload.image('blackCover', 'assets/blackCover.png');

        ego.load.bitmapFont('bigWinScore', 'assets/BigWin/bigWinScore_font.png', 'assets/BigWin/bigWinScore_font.xml')
        for (let i = 0; i < 4; i++) {
            ego.onceload.image('bigWin_BG_' + i, 'assets/BigWin/BIG WIN BG_' + i + '.png');
            ego.onceload.image('bigWin_BG_White_' + i, 'assets/BigWin/BIG WIN BG-light_' + i + '.png');
            ego.onceload.image('bigWin_Light_' + i, 'assets/BigWin/BIG WIN light_' + i + '.png');
            ego.onceload.image('bigWin_Word_' + i, 'assets/BigWin/BIG WIN word_' + i + '.png');
            ego.onceload.image('bigWin_Word_White_' + i, 'assets/BigWin/BIG WIN word-light_' + i + '.png');
        }
        //#region 更新
        for (let i = 0; i < 6; i++) {
            ego.onceload.spritesheet('bigWin_Coin_' + i, 'assets/BigWin/BigWinCoin_' + i + '_N.png', { frameWidth: 60, frameHeight: 60 });
        }
        //#endregion (更新)
    }
    create() {
        let ego = this.game;

        this.blackCover = ego.add.image(360, 640, 'blackCover').setOrigin(0.5).setDepth(75).setAlpha(0).setInteractive();
        this.bigWinCon = ego.add.container(360, 575).setDepth(77).setScale(0);
        let bigWinLight = ego.add.image(0, 0, 'bigWin_Light_0')     //背景光
        let bigWinBG = ego.add.image(0, 0, 'bigWin_BG_0');          //背景板
        let bigWinWord = ego.add.image(0, -20, 'bigWin_Word_0');    //「BinWin」、「MegaWin」等文字圖
        let bigWinBG_W = ego.add.image(0, 0, 'bigWin_BG_White_0').setAlpha(0);          //背景板的「發光圖」
        let bigWinWord_W = ego.add.image(0, -20, 'bigWin_Word_White_0').setAlpha(0);    //「BinWin」文字的「發光圖」
        let bigWinBG_forEffect = ego.add.image(0, 0, 'bigWin_BG_White_0').setVisible(false);    //為了做特效而生成的圖(圖片與背景板的「發光圖」一樣)

        this.bigWinScore_bitText = ego.add.bitmapText(0, 75, 'bigWinScore', 0).setOrigin(0.5, 1).setScale(1);   //BigWin上的數字

        this.bigWinCon.add([
            bigWinLight, bigWinBG, bigWinWord, this.bigWinScore_bitText, bigWinBG_W, bigWinWord_W, bigWinBG_forEffect
        ])

        //#region 更新
        this.EffectSystem = new EffectSystem(this.game, this);
        this.EffectSystem.create();
        //#endregion (更新)

        // this.BigWin.BigWinOccur(true, 4, 5000);

    }
    //#region 更新
    update() {
        if (this.showBigWinCoin || !this.EffectSystem.allCoinOut) {
            this.EffectSystem.Action();
        }
    }
    //#endregion (更新)

    BigWinOccur(occur = false, toLevel = 1, delayT = 0) {
        //occur判斷BigWin的出現與否
        //toLevel判斷BigWin會升到第幾階(1~4, 1是只出現BigWin不會升階)
        //delayT判斷動畫delay時間
        this.scoreAniPlaying = occur;

        if (occur) {
            /* v--重置圖片--v */
            this.bigWinCon.list[0].setTexture('bigWin_Light_0');
            this.bigWinCon.list[1].setTexture('bigWin_BG_0');
            this.bigWinCon.list[2].setTexture('bigWin_Word_0');
            this.bigWinCon.list[4].setTexture('bigWin_BG_White_0');
            this.bigWinCon.list[5].setTexture('bigWin_Word_White_0');
            this.bigWinCon.list[6].setTexture('bigWin_BG_White_0');
            /* ^--重置圖片--^ */

            this.BigWinScore(toLevel, delayT);

            if (this.game.forEvent_AllPlateStop && this.game.isAllPlate) {
                this.game.auto = false;
                this.game.AutoBtn.changeBtnImage('Auto_A', 'Auto_B');
            }

        }
        else {
            if (!this.game.isPunchGame && !this.game.isFreeGame) {
                if (this.game.auto) {
                    if (this.game.PrizeLine.wholeLineCon.length <= 1) {
                        this.game.StartAuto();
                    }
                } else {
                    this.game.BtnDisable(this.game.auto);
                }
            } else if (this.game.isFreeGame) {
                if (this.game.forEvent_AllPlateStop && this.game.isAllPlate) {
                    this.game.StartBtn.disable(false, 'Start_A');
                }
            }

            this.nowBigWinLevel = 0;
            this.showBigWinCoin = false;
        }

        let timeline = this.game.tweens.createTimeline();
        timeline.add({
            targets: this.bigWinCon,
            scale: { from: occur ? 0 : 1, to: occur ? 1.2 : 0 },
            delay: delayT,
            duration: occur ? 500 : 250,
            ease: 'Sine.Out',
            onStart: function () {
                this.blackCover.setAlpha(occur ? 0.5 : 0);
                if (occur) {
                    this.game.MusicAndSE.ChangeBGM(4);                            //*(轉到BigWin背景音樂)
                    this.game.MusicAndSE.PlaySoundEffect('SE_BigWinCoin', true)   //*(這個是重覆播放的「灑金幣」音效)

                    this.showBigWinCoin = true;
                    this.EffectSystem.EffectOn();
                } else {
                    this.game.MusicAndSE.ChangeBGM(this.game.isFreeGame ? 2 : this.game.isPunchGame ? 3 : this.game.auto ? 1 : 0, true, 1000);  // *(換回一般音樂)
                    if (!this.game.isFreeGame && !this.game.isPunchGame) { this.game.MusicAndSE.ChangeVolume(1, 0.9); }

                    if (this.game.forEvent_AllPlateStop && this.game.isAllPlate) {
                        this.game.WinEffectCtrl.AllPlateFinal(true);
                        this.game.blackCover.setAlpha(0.5);
                    }
                }
            }.bind(this)
        })
        if (occur) {    //為追求BigWin出現時的動態效果, 動畫分了兩段
            timeline.add({
                targets: this.bigWinCon,
                scale: 1,
                duration: 250,
                ease: 'Bounce.Out',
            })
        }
        timeline.play();
    }

    BigWinScore(toLevel = 0, delayT = 0) {
        this.game.targetWinScore += this.game.tmpScore;
        let plus = 0;
        let dis = this.game.tmpScore;
        let final = 0;

        let time = { t: 0 }
        this.game.tweens.add({
            targets: time,
            t: 1,
            delay: delayT,
            duration: 1500 * toLevel,   //當有升階時, BigWin表演時間亦拉長
            onUpdate: function () {
                plus = Math.round(dis - (dis * (1 - time.t)));
                final = this.game.myWinScore + plus;
                this.game.winMoneyText.setText(this.game.ChangeNumText_Comma(final));  //同步到「得分」文字
                this.bigWinScore_bitText.text = plus;
                if ((this.nowBigWinLevel + 1) * (1 / toLevel) < time.t) {
                    this.BigWinLevelUp();
                    this.nowBigWinLevel++;
                }
                // this.game.MusicAndSE.PlaySoundEffect('SE_WinScore_B'); //   *(連續播放洗分音效)
                this.EffectSystem.AddCoin(5);
            }.bind(this),
            completeDelay: 1000,
            onComplete: function () {
                this.game.winMoneyText.setText(this.game.ChangeNumText_Comma(this.game.targetWinScore));
                this.bigWinScore_bitText.text = plus;
                this.game.myWinScore = this.game.targetWinScore;

                this.game.tmpScore = 0;
                this.BigWinOccur(false);
                this.game.MusicAndSE.CloseSoundEffect('SE_BigWinCoin', true);
            }.bind(this)
        })
    }
    BigWinLevelUp() {
        let timeline = this.game.tweens.createTimeline();
        //#region BigWin放大, 同時「發亮」
        timeline.add({
            targets: this.bigWinCon,
            scale: { from: 1, to: 1.6 },
            duration: 175,
            ease: 'Sine.Out',
        })
        timeline.add({
            targets: [this.bigWinCon.list[4], this.bigWinCon.list[5], this.bigWinCon.list[6]],
            alpha: { from: 0, to: 1 },
            duration: 175,
            ease: 'Cubic.Out',
            offset: '-=175'
        })
        //#endregion

        //#region 發光特效出現 && BigWin相關改圖(上升一階)
        timeline.add({
            targets: this.bigWinCon.list[6],
            scale: { from: 1, to: 3 },
            alpha: { from: 0.5, to: 0 },
            duration: 300,
            onStart: function () {
                this.bigWinCon.list[6].setVisible(true);

                this.bigWinCon.list[0].setTexture('bigWin_Light_' + this.nowBigWinLevel);
                this.bigWinCon.list[1].setTexture('bigWin_BG_' + this.nowBigWinLevel);
                this.bigWinCon.list[2].setTexture('bigWin_Word_' + this.nowBigWinLevel);

            }.bind(this),
            offset: '-=0'
        })
        //#endregion

        //#region BigWin回到原來大小
        timeline.add({
            targets: this.bigWinCon,
            scale: 1,
            duration: 250,
            ease: 'Bounce.Out',
            offset: '-=300'
        })
        timeline.add({
            targets: [this.bigWinCon.list[4], this.bigWinCon.list[5], this.bigWinCon.list[6]],
            alpha: { from: 1, to: 0 },
            duration: 250,
            ease: 'Cubic.Out',
            offset: '-=250',
            onStart: function () {
                this.game.MusicAndSE.PlaySoundEffect(this.nowBigWinLevel >= 3 ? 'SE_BigWinLvUP_L' : 'SE_BigWinLvUP_S'); // *(播放升階音效)
            }.bind(this),
            onComplete: function () {
                if (this.nowBigWinLevel < 3) {  //升階後的「發光圖」換圖, if是限制「發光圖」不會在第4階時再升階(會找不到圖)
                    this.bigWinCon.list[4].setTexture('bigWin_BG_White_' + this.nowBigWinLevel);
                    this.bigWinCon.list[5].setTexture('bigWin_Word_White_' + this.nowBigWinLevel);
                    this.bigWinCon.list[6].setTexture('bigWin_BG_White_' + this.nowBigWinLevel);
                }
                this.bigWinCon.list[6].setVisible(false).setScale(1);
            }.bind(this)
        })

        timeline.play();
    }

}

//————————更新————————
class Coin {
    constructor(game, bigWin, efectSystem) {
        this.game = game;
        this.bigWin = bigWin;

        this.myWorld = efectSystem;
        this.startPosition = [0, 0, 0];
        this.speedX = 10;
        this.speedY = 100;
        this.speedZ = 0;
        this.forwardRotation = true;
        this.picLength;//new List<Picture>()
        this.picIndex = 0;
        this.isAction = false;

        this.CoinPic = null;
        this.myIndex = 0;
    }

    SetPicture(angle) {
        // 將所有金幣的連續圖放入CoinPic這個List中
        if (angle < -180 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 0);
            this.forwardRotation = false;
        }
        else if (angle < -162 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 1);
            this.forwardRotation = false;
        }
        else if (angle < -144 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 2);
            this.forwardRotation = false;
        }
        else if (angle < -126 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 3);
            this.forwardRotation = false;
        }
        else if (angle < -108 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 4);
            this.forwardRotation = false;
        }
        else if (angle < -90 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 5);
            this.forwardRotation = false;
        }
        else if (angle < -72 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 1);//6
            this.forwardRotation = true;
        }
        else if (angle < -54 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 2);//7
            this.forwardRotation = true;
        }
        else if (angle < -36 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 3);//8
            this.forwardRotation = true;
        }
        else if (angle < -18 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 4);//9
            this.forwardRotation = true;
        }
        else if (angle < 0 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 0);
            this.forwardRotation = true;
        }
        else if (angle < 18 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 1);
            this.forwardRotation = true;
        }
        else if (angle < 36 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 2);
            this.forwardRotation = true;
        }
        else if (angle < 54 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 3);
            this.forwardRotation = true;
        }
        else if (angle < 72 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 4);
            this.forwardRotation = true;
        }
        else if (angle < 90 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 5);
            this.forwardRotation = true;
        }
        else if (angle < 108 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 1);//6
            this.forwardRotation = false;
        }
        else if (angle < 126 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 2);//7
            this.forwardRotation = false;
        }
        else if (angle < 144 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 3);//8
            this.forwardRotation = false;
        }
        else if (angle < 162 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 4);//9
            this.forwardRotation = false;
        }
        else if (angle < 180 + 9) {
            this.CoinPic = this.game.add.sprite(0, 0, 'bigWin_Coin_' + 0);
            this.forwardRotation = false;
        }
    }

    Coin(x, y, z, angle, powerV, powerH, world) {
        this.myWorld = world;
        this.startPosition[0] = x;
        this.startPosition[1] = y;
        this.startPosition[2] = z;
        this.speedX = Math.cos(angle / 180 * Math.PI);
        this.speedY = powerH;
        this.speedZ = Math.sin(angle / 180 * Math.PI);
        this.SetPicture(angle);
        this.isAction = true;
        this.picLength = this.CoinPic.frame.texture.frameTotal - 1;

        this.myWorld.coinCon.add([this.CoinPic]);
    }

    Action() {
        if (this.startPosition[1] > -700) {
            this.startPosition[0] += this.speedX * 20;
            this.speedY += this.myWorld.gravity;
            this.startPosition[1] += this.speedY;
            this.startPosition[2] += this.speedZ;
            if (this.forwardRotation) {
                this.picIndex++;
            }
            else {
                this.picIndex--;
            }
            if (this.picIndex >= this.picLength) {
                this.picIndex = 0;
            }
            else if (this.picIndex < 0) {
                this.picIndex = this.picLength - 1;
            }

            if (this.startPosition[1] > this.myWorld.endingY || this.startPosition[0] > Math.abs(400)) {
                this.isAction = false;

                if (!this.bigWin.showBigWinCoin) {
                    this.startPosition[1] = -700;
                    this.myWorld.nowCoinInSceen++;
                }
            }

            this.CoinPic.x = this.startPosition[0];
            this.CoinPic.y = this.startPosition[1];
            this.CoinPic.setFrame(this.picIndex) //this.pic[this.picIndex];
        }
    }

}

class EffectSystem {
    constructor(game, bigWin) {
        this.game = game;
        this.bigWin = bigWin;

        this.gravity = 3;
        this.startRange = []
        for (let i = 0; i < 3; i++) {
            this.startRange[i] = [-10, 10]
        }
        this.angleRange = [-180, 180];
        this.powerVRange = [30, 60];
        this.powerHRange = [-16, -32];
        this.endingY = 700;

        this.CoinPic = [];
        this.coins = [] //new List<Coin>();

        this.coinStartNum = 15;
        this.coinMaxNum = 125;
        this.coinNowNum = this.coinStartNum;
        this.nowCoinInSceen = 0;

        this.allCoinOut = true;

        this.coinCon = null;
    }

    create() {
        if (this.coinCon == null) {
            this.coinCon = this.game.add.container(360, 640).setDepth(76).setVisible(false);
        }

        for (let i = 0; i < this.coinMaxNum; i++) {
            this.coins.push(new Coin(this.game, this.bigWin, this));
            this.SetCoinValue(this.coins[i]);
        }
    }
    AddCoin(count) {
        this.coinNowNum += count;
        if (this.coinNowNum > this.coinMaxNum) {
            this.coinNowNum = this.coinMaxNum;
        }
    }

    EffectOn() {
        this.coinCon.setVisible(true);
        this.coinNowNum = this.coinStartNum;
        this.nowCoinInSceen = 0;
        this.allCoinOut = false;
    }

    Action() {
        for (let i = 0; i < this.coinNowNum; i++) {
            this.coins[i].Action();
            if (!this.coins[i].isAction) {
                if (this.bigWin.showBigWinCoin) {
                    this.SetCoinValue(this.coins[i]);
                }
            }
        }
        if (this.nowCoinInSceen >= this.coinNowNum) {
            this.allCoinOut = true;
            this.coinCon.setVisible(false);
            this.coinCon.removeAll(true);
        }

    }


    SetCoinValue(coin) {
        coin.Coin(
            Phaser.Math.Between(this.startRange[0][0], this.startRange[0][1]),
            Phaser.Math.Between(this.startRange[1][0], this.startRange[1][1]),
            Phaser.Math.Between(this.startRange[2][0], this.startRange[2][1]),
            Phaser.Math.Between(this.angleRange[0], this.angleRange[1]),
            Phaser.Math.Between(this.powerVRange[0], this.powerVRange[1]),
            Phaser.Math.Between(this.powerHRange[0], this.powerHRange[1]) * 2,
            this
        );
    }
}