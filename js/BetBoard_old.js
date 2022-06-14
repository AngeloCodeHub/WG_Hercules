import { Button } from './CustomTools.js';

export class BetBoard {
    constructor(scene, ary, closeBtnImg, config = {}) {
        let mainGame = scene;
        this.mainGame = scene;

        if (config.boardSize == null) { config.boardSize = [0, 0]; }
        if (config.boardColor == null) { config.boardColor = 0x000000; }
        if (config.boardalpha == null) { config.boardalpha = 0.8; }
        if (config.titleTextColor == null) { config.titleTextColor = '#ffffff'; }
        if (config.titleTextfont == null) { config.titleTextfont = 'bold 34pt 微軟正黑體'; }
        if (config.numTextColor == null) { config.numTextColor = '#999999'; }
        if (config.numTextfont == null) { config.numTextfont = 'bold 28pt 微軟正黑體'; }
        if (config.chosingBoxColor == null) { config.chosingBoxColor = 0x0de5e5; }
        if (config.form == null) { config.form = 4; }
        if (config.gap == null) { config.gap = [135, 75]; }
        if (config.bleed == null) { config.bleed = 20; }
        if (config.closeBtnScale == null) { config.closeBtnScale = 1; }

        this.con = scene.add.container(360, 640).setScale(0).setAlpha(0);

        //#region 標題
        let titleText = mainGame.add.text(0, 0, '請選擇押注金額', { font: config.titleTextfont, color: config.titleTextColor }).setOrigin(0.5);
        let titleTextH = titleText.height;
        //#endregion

        //#region 底部方框(BG)
        let formW = config.form;
        let formH = Math.ceil(ary.length / formW);
        let boardW = config.gap[0] * formW + config.bleed;
        let boardH = config.gap[1] * formH + config.bleed + titleTextH;
        let baseRect = new Phaser.Geom.Rectangle(-boardW * 0.5, -boardH * 0.5, boardW, boardH);
        let graphics = mainGame.add.graphics({ fillStyle: { color: config.boardColor, alpha: config.boardalpha } });
        graphics.fillRectShape(baseRect);
        //#endregion

        titleText.y = -boardH * 0.5 + titleTextH - config.bleed;

        this.con.add([graphics, titleText]);

        //#region 數字及按鈕
        this.numCon = mainGame.add.container(0, 0);
        for (let i = 0; i < formH; i++) {
            for (let j = 0; j < config.form; j++) {
                let index = j + i * config.form;
                if (index > ary.length) { break; }
                let x = config.gap[0] * (j - (config.form - 1) * 0.5);
                let y = config.gap[1] * (i - (formH - 1) * 0.5) + titleTextH - config.bleed;
                let singleBtn = mainGame.add.container(x, y);
                let numText = mainGame.add.text(0, 0, ary[index], { font: config.numTextfont, color: config.numTextColor }).setOrigin(0.5);

                let btnArea = mainGame.add.zone(0, 0, config.gap[0], config.gap[1]).setInteractive();
                btnArea.on('pointerup', function () {
                    this.mainGame.BetNumber(index);
                    this.ChangeBet(index);
                    this.Occur(false);
                    this.mainGame.BtnAllDisable(false);
                    this.mainGame.AutoBtn.disable(false, 'Auto_A');
                }.bind(this));

                singleBtn.add([numText, btnArea])
                this.numCon.add([singleBtn]);
            }
        }
        //#endregion

        //#region 生成線
        let lineCon = mainGame.add.container(0, 0);
        for (let i = 1; i < config.form; i++) {
            let x = config.gap[0] * (i - config.form * 0.5);
            let y = config.gap[1] * (-formH * 0.5) + titleTextH - config.bleed;
            let tmp = (ary.length % config.form >= i) || (ary.length % config.form == 0) ? formH : formH - 1;
            let length = y + config.gap[1] * tmp;

            let line = new Phaser.Geom.Line(x, y, x, length);
            let lineGrap = mainGame.add.graphics({ lineStyle: { width: 3, color: 0xffffff } }).strokeLineShape(line);
            lineCon.add([lineGrap]);
        }
        for (let i = 1; i < formH; i++) {
            let x = config.gap[0] * (-config.form * 0.5);
            let y = config.gap[1] * (i - formH * 0.5) + titleTextH - config.bleed;
            let length = x + config.gap[0] * config.form;

            let line = new Phaser.Geom.Line(x, y, length, y);
            let lineGrap = mainGame.add.graphics({ lineStyle: { width: 3, color: 0xffffff } }).strokeLineShape(line);
            lineCon.add([lineGrap]);
        }
        //#endregion

        //#region 「當前選擇注碼」的方框
        let choseingBox = new Phaser.Geom.Rectangle(- config.gap[0] * 0.5, - config.gap[1] * 0.5, config.gap[0], config.gap[1]);
        this.choseingBoxGrap = mainGame.add.graphics({ fillStyle: { color: config.chosingBoxColor, alpha: 1 } }).fillRectShape(choseingBox).setScale(0.8);
        //#endregion

        //#region 右上角「開閉按鈕」
        let closeBtn = new Button(mainGame, closeBtnImg, closeBtnImg, boardW * 0.5, -boardH * 0.5, function () {
            this.Occur(false);
            this.mainGame.BtnAllDisable(false);
            this.mainGame.AutoBtn.disable(false, 'Auto_A');
        }.bind(this))
        closeBtn.main.setScale(config.closeBtnScale)
        //#endregion

        this.con.add([this.choseingBoxGrap, this.numCon, lineCon, closeBtn.main]);
        this.ChangeBet(0);

        // this.Occur(true)
    }
    Occur(occur) {
        // this.mainGame.BtnDisable(occur, true);

        this.con.setScale(occur ? 0 : 1).setAlpha(occur ? 0 : 1);
        this.mainGame.tweens.add({
            targets: this.con,
            scale: occur ? 1 : 0,
            alpha: occur ? 1 : 0,
            duration: 500,
            ease: 'Sine.Out'
        })
    }
    ChangeBet(index) {
        let numCon = this.numCon;
        this.choseingBoxGrap.setPosition(numCon.list[index].x, numCon.list[index].y);
        for (let i = 0; i < numCon.list.length; i++) {
            numCon.list[i].list[0].setColor('#999999');
        }
        numCon.list[index].list[0].setColor('#000000');
    }
}
