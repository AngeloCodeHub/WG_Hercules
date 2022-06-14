class CoinEffect {
    constructor(game) {
        this.game = game;

        this.myWorld = new PhysicalSystem(game);
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

                if (!this.game.showBigWinCoin) {
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

export class PhysicalSystem {
    constructor(game) {
        this.game = game;

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

        this.coinStartNum = 10;
        this.coinMaxNum = 0;
        this.coinNowNum = this.coinStartNum;
        this.nowCoinInSceen = 0;

        this.allCoinOut = true;

        this.coinCon = null;
    }

    create() {
        if (this.coinCon == null) {
            this.coinCon = this.game.add.container(360, 640).setDepth(76).setVisible(false);
        }
    }
    CreateCoin() {
        this.coins.push(new CoinEffect(this.game));
        this.SetCoinValue(this.coins[this.coins.length - 1]);
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
            if (i >= this.coins.length) { this.CreateCoin(); }

            this.coins[i].Action();
            if (!this.coins[i].isAction) {
                if (this.game.showBigWinCoin) {
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