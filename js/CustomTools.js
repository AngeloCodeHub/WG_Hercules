import * as phaser from './phaser.min.js';
/* 自定義功能 */
export class CustomScene extends Phaser.Scene {
    constructor(name) {
        super(name);
        this._texturesArray = [];
        this.onceload = {
            image: function (key, url) {
                this._self.load.image(key, url);
                this._self._texturesArray.push(key);
            },
            spritesheet: function (key, url, config) {
                this._self.load.spritesheet(key, url, config);
                this._self._texturesArray.push(key);
            },
            bitmapFont: function (key, textureURL, xmlURL) {
                this._self.load.bitmapFont(key, textureURL, xmlURL);
                this._self._texturesArray.push(key);
            },
            audio: function (key, urls) {
                this._self.load.audio(key, urls);
                this._self._texturesArray.push(key);
            }
        }
        this.onceload._self = this;
    }
    preload() {

    }
    create() {
        this.input.topOnly = true;
        /* 全螢幕偵測 */
        this.input.off('pointerdown');
        this.input.on('pointerdown', function () {
            if (this.game.device.fullscreen.available && navigator.platform != "Win32" && navigator.platform != "Win64") {
                if (this.scale.isFullscreen == false) {
                    this.scale.startFullscreen();
                }
            }
        }, this);
    }
    /* 清除圖片存檔 */
    clearAllTexture() {
        while (this._texturesArray.length != 0) {
            this.textures.remove(this._texturesArray.pop());
        }
    }
}

/*  按鈕  */
export class Button {
    get Main() { return this.main }
    constructor(self, Up, Down, posX, poxY, event, event2 = null, changeStage = [false, false]) {//(自己, 彈起圖片, 按下圖片, 位置X, 位置Y, 單下事件, 長按事件)
        this.main = self.add.sprite(posX, poxY, Up).setInteractive({ pixelPerfect: true });
        this.upImage = Up;
        this.downImage = Down;
        this.forChangeStage = true;
        this.isDisable = false;

        this.event2 = event2;   //長按事件
        this.index = 0;         //持續按下時間
        this.keepdown;          //按下判定

        this.event = event;

        this.main.on('pointerdown', (function () {
            if (!changeStage[0]) { this.main.setTexture(this.downImage); }
            this.index = 0;
            this.keepdown = true;
        }).bind(this));

        this.main.on('pointerup', (function () {
            if (!changeStage[0]) { this.main.setTexture(this.upImage); }
            else {
                this.forChangeStage = !this.forChangeStage
                this.main.setTexture(this.forChangeStage ? this.upImage : this.downImage);
            }
            this.index = 0;
            this.keepdown = false;
            event();
        }).bind(this));

        this.main.on('pointerout', (function () {
            if (!changeStage[0] && !this.isDisable) { this.main.setTexture(this.upImage); }
            this.index = 0;
            this.keepdown = false;
        }).bind(this));
    }
    setClick(clickEvent) {
        this.clickEvent = clickEvent;
    }
    click() { if (!this.isDisable) { this.clickEvent == null ? this.event() : this.clickEvent(); } }

    setPointDown(new_sprite, event = null) {
        this.main.off('pointerdown');
        this.main.on('pointerdown', function () {
            this.setTexture(new_sprite);
            if (event != null) event();
        });
    }
    setPointOut(event) {
        this.main.off('pointerout');
        this.main.on('pointerout', function () {
            event();
        });
    }
    setNormal(new_sprite, event = null) {
        this.main.setTexture(new_sprite);
        this.main.off('pointerup');
        this.main.on('pointerup', function () {
            this.setTexture(new_sprite);
            if (event != null) event();
        });
        this.main.off('pointerout');
        this.main.on('pointerout', function () {
            this.setTexture(this.upImage);
        });
    }
    setContainer(con) {
        con.add([this.main]);
    }
    update() {
        if (this.keepdown == true) {
            this.index++;
            if (this.index >= 60) {
                this.event2();
            }
        }
    }
    disable(disable, d_Image = '') {
        if (disable) {
            this.main.disableInteractive();
            this.isDisable = true;
            if (d_Image != '') { this.main.setTexture(d_Image); }
        }
        else {
            this.main.setInteractive();
            this.isDisable = false;
            this.main.setTexture(this.upImage)
        }
    }
    changeBtnImage(chan_n_Image, chan_p_Image) {
        this.upImage = chan_n_Image;
        this.downImage = chan_p_Image;
        this.main.setTexture(this.upImage);
    }
    changeChangeStage(normal) {
        this.forChangeStage = normal;
        this.main.setTexture(this.forChangeStage ? this.upImage : this.downImage);
    }
    destroy() {
        this.main.destroy();
    }

}

export function SetCookie(name, value) {
    try {
        let st = name + '=' + value.toString();
        document.cookie = st;
    } catch (e) { }
}
export function GetCookie(name) {
    try {
        const value = document.cookie;
        const parts = value.split(`${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    } catch (e) { }
}

export var ChangeNumText_Comma = function (value, fix = 0) {
    let st = value < 0 ? "-" : "";
    let i = String(parseInt(value = Math.abs(Number(value) || 0).toFixed(fix)));
    let j = i.length > 3 ? i.length % 3 : 0;
    return st + (j ? i.substring(0, j) + ',' : "") + i.substring(j).replace(/(\d{3})(?=\d)/g, "$1" + ',') + (fix ? '.' + Math.abs(value - i).toFixed(2).slice(2) : "");
}
