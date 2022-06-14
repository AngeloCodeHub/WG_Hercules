import { CustomScene, Button } from './CustomTools.js';

export class ScrollText extends CustomScene {
    constructor(game) {
        super("ScrollText");
        this.mainGame = game;

        this.scrollText;
        this.scrollSt_Array = [];
        this.scrollPreSt_Array = [];
        for (let i = 0; i < 3; i++) {
            this.scrollSt_Array[i] = [];
            if (i < 2) { this.scrollPreSt_Array[i] = []; }
        }
        this.scrollNowIndex = 2;
        this.scrollCount = 0;
    }

    preload() {
        let ego = this;

        ego.onceload.image('ui_BoardBG', 'assets/UpUI/information_BG.png');
        ego.onceload.image('ui_HomeBoard', 'assets/UpUI/home_information_BG.png');
        ego.onceload.image('ui_NameBoard', 'assets/UpUI/name_information_BG.png');

        ego.onceload.image('ui_HomeBtn_N', 'assets/UpUI/home_Button_N.png');
        ego.onceload.image('ui_HomeBtn_P', 'assets/UpUI/home_Button_P.png');

    }

    create() {
        let ego = this;

        this.UICon = ego.add.container(0, 0).setVisible(false);

        let bg = ego.add.image(360, 0, 'ui_BoardBG').setOrigin(0.5, 0);

        this.scrollText = ego.add.text(0, 32, '', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(1, 0.5);

        let homeBoard = ego.add.image(720, 0, 'ui_HomeBoard').setOrigin(1, 0);
        let nameBoard = ego.add.image(0, 0, 'ui_NameBoard').setOrigin(0, 0);
        this.playerNameText = ego.add.text(7, 16, '', { font: 'bold 22pt 微軟正黑體', color: '#ffffff' }).setOrigin(0, 0);
        this.homeBtn = new Button(ego, 'ui_HomeBtn_N', 'ui_HomeBtn_P', 686, 35, function () {
            if (ego.mainGame.UseSetting == 'ROBOT1') { console.log('回傳返回大廳'); ego.mainGame.ApiCtrl.leave(); }
            window.location.href = ego.mainGame.url;
        }).Main;

        this.UICon.add([
            bg,
            this.scrollText,
            homeBoard, nameBoard, this.playerNameText, this.homeBtn
        ])

        this.CreateScrollTextAni();

        // this.cameras.main.x = 100;
    }

    //#region 跑馬燈
    CreateScrollTextAni() {
        this.scrollTextAni = this.tweens.addCounter({
            from: 0, to: 1,
            duration: 1000,
            onUpdate: function () {
                this.scrollText.x -= 2;

                if (this.scrollText.x < 190 && this.scrollText.text != '') {

                    let ticker = this.scrollSt_Array[this.scrollNowIndex][0];
                    console.log(ticker, this.scrollSt_Array, this.scrollNowIndex);
                    if (ticker.ShowTimes > 0) { ticker.ShowTimes--; };
                    this.scrollSt_Array[this.scrollNowIndex].splice(0, 1);

                    if (this.scrollNowIndex < 2) {
                        this.scrollSt_Array[2].push(ticker);
                    } else {
                        if (ticker.ShowTimes == 0) { this.scrollText.setText(''); }
                        else { this.scrollSt_Array[this.scrollNowIndex].push(ticker); }
                    }

                    this.StartScrollText();
                }
            }.bind(this),
            repeat: -1,
        })
    }
    PlusNewSt(type, message, old = false) {
        let ticker;
        ticker = { NTID: message.NTID, NTText: message.NTText, ShowTimes: message.ShowTimes };

        if (message.IsMime) { this.scrollPreSt_Array[0].push(ticker); }
        else {
            this.scrollSt_Array[old ? 2 : type == 2 ? 0 : 1].push(ticker);
            if (this.scrollText.text == '') {
                this.StartScrollText();
            }
        }
    }
    StartScrollText() {
        for (let i = 0; i < 3; i++) {
            if (this.scrollSt_Array[i].length == 0) { continue; }
            if (this.scrollSt_Array[i][0].ShowTimes == 0) {
                this.scrollSt_Array[i].splice(0, 1);
                continue;
            }
            this.scrollText.setText(this.scrollSt_Array[i][0].NTText);
            this.scrollText.x = 680 + this.scrollText.width;
            this.scrollNowIndex = i;
            break;
        }

        // if (this.mainGame.isTest) { console.log(this.scrollSt_Array); }
    }
    ForPreScrollTest() {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.scrollPreSt_Array[i].length; j++) {
                this.scrollSt_Array[i].push(this.scrollPreSt_Array[i][j]);
            }
            this.scrollPreSt_Array[i].length = 0;
        }

        if (this.scrollText.text == '') {
            this.StartScrollText();
        }
    }
    CutScrollText() {
        this.scrollLastIndex = this.scrollNowIndex;
        this.StartScrollText();
    }
    DeleteScrollText(message) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < this.scrollSt_Array[i].length; j++) {
                if (this.scrollSt_Array[i][j].NTID == message.NTID) {
                    if (message.ShowTimes == 0) { this.scrollSt_Array[i].splice(j, 1); }
                    else { this.scrollSt_Array[i][j].ShowTimes = message.ShowTimes; }
                    i = 2;
                    break;
                }
            }
        }
    }
    //#endregion 跑馬燈
}