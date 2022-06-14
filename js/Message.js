import { CustomScene, Button } from './CustomTools.js';

/*
 在主遊戲的preload裡呼叫{
    this.Message = new Message(this);
    this.scene.add('Message', this.Message, true, { x: 0, y: 0 });
 }
 然後在主遊戲的create裡「最後一行」呼叫{
    this.scene.bringToTop('Message');
 }
 (以免圖層出錯)

 *forHistory相關的功能為「歷史記錄」, 但現時此功能未實裝
*/


export class Message extends CustomScene {
    constructor(game) {
        super("Message");
        this.mainGame = game;
        this.hisScene = null;

        this.forHistory = false;
    }

    preload() {
        let ego = this;
        ego.load.setBaseURL('./');

        ego.onceload.image('blackCover', 'assets/blackCover.png');
        ego.onceload.image('messageBG', 'assets/message_BG.png');

        // ego.onceload.image('ui_HomeBtn_N', 'assets/UpUI/home_Button_N.png');
        // ego.onceload.image('ui_HomeBtn_P', 'assets/UpUI/home_Button_P.png');
    }

    create() {
        let ego = this;

        this.blackCover = ego.add.image(360, 640, 'blackCover').setOrigin(0.5).setDepth(75).setAlpha(0).setInteractive();
        this.blackCover_2 = ego.add.image(360, 640, 'blackCover').setOrigin(0.5).setDepth(75).setAlpha(0).setInteractive();

        this.messageCon = ego.add.container(360, 640).setAlpha(0).setDepth(150);
        let messageBG = ego.add.image(0, 0, 'messageBG');
        let messageText = ego.add.text(0, 0, '', { font: 'bold 24pt 微軟正黑體', color: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5);
        this.messageCon.add([messageBG, messageText]);

        this.messageTask = {
            targets: this.messageCon,
            alpha: { from: 0, to: 1 },
            duration: 150,
            ease: 'Sine.Out',
            yoyo: true,
            hold: 750,
            onComplete: function () {
                if (!this.yoyo && ego.blackCover.alpha > 0) {
                    ego.mainGame.scene.pause();
                    if (ego.forHistory) { ego.hisScene.scene.pause(); }
                }
            }
        }
        this.messageAni;

        this.darkTask = {
            targets: this.blackCover_2,
            alpha: { from: 0, to: 0.7 },
            duration: 150,
            ease: 'Sine.Out',
            yoyo: true,
            hold: 750,
            onComplete: function () {
            }
        }
        this.darkAni;

        // this.homeBtn = new Button(ego, 'ui_HomeBtn_N', 'ui_HomeBtn_P', 686, 35, function () {
        //     window.location.href = ego.mainGame.url;
        // }).Main.setDepth(150).setVisible(false);


        // setTimeout(function () {
        //     // this.ShowMessage('公道幣不足', true, true, false);                    //會「自動消失」的模式
        //     // this.ShowMessage('暫時沒地方用到這樣的參數設定', true, false, false);   //不會自動消失, 也不會「壓暗畫面」
        //     // this.ShowMessage('已斷線', true, false, true);                        //不會自動消失, 會壓暗畫面, 以及遊戲停止
        // }.bind(this), 15000)

        // setTimeout(function () {
        //     this.ShowMessage('', false, false, false);                              //Message視窗消失
        // }.bind(this), 8000)
    }


    ShowMessage(st, occur = true, autoClose = true, toDark = false) {
        if (toDark) {
            this.blackCover.setAlpha(0.7).setDepth(149);
            // if (!this.homeBtn.visible) { this.homeBtn.setVisible(true); }
        }
        else {
            this.mainGame.scene.resume();
            if (this.forHistory) { this.hisScene.scene.resume(); }
            this.blackCover.setAlpha(0).setDepth(75);
        }
        this.messageCon.list[1].setText(st);

        this.messageTask.alpha = { from: occur ? 0 : 1, to: occur ? 1 : 0 };
        this.messageTask.yoyo = autoClose;
        this.messageTask.hold = autoClose ? 750 : 0;
        if (this.messageAni != null) { this.messageAni.remove(); }
        this.messageAni = this.tweens.add(this.messageTask);
    }


    ShowDark(st, occur = true, autoClose = true) {
        this.messageCon.list[1].setText(st);
        this.messageTask.alpha = { from: occur ? 0 : 1, to: occur ? 1 : 0 };
        this.messageTask.yoyo = autoClose;
        this.messageTask.hold = autoClose ? 1000 : 0;
        this.darkTask.alpha = { from: occur ? 0 : 1, to: occur ? 0.7 : 0 };
        this.darkTask.yoyo = autoClose;
        this.darkTask.hold = autoClose ? 1000 : 0;
        if (this.messageAni != null) { this.messageAni.remove(); }
        this.messageAni = this.tweens.add(this.messageTask);
        if (this.darkAni != null) { this.darkAni.remove(); }
        this.darkAni = this.tweens.add(this.darkTask);
    }


    FadeEffect(toDark, event = null) {
        this.blackCover.alpha = toDark ? 0 : 1;

        this.tweens.add({
            targets: this.blackCover,
            alpha: toDark ? 1 : 0,
            duration: 350,
            completeDelay: 100,
            onComplete: function () {
                if (event != null) { event(); }
            }
        })
    }

}

/*
var keyEnter = this.input.keyboard.addKey('Enter');
        keyEnter.on('up', function () {
            if (this.isTest) {
                if (this.ForHistory != null) {
                    this.Message.FadeEffect(true, function () {
                        this.scene.wake('ForHistory');
                        this.ForHistory.ChangeSceneSetValue();

                        this.scene.sleep();
                    }.bind(this));
                } else {
                    this.Message.FadeEffect(true, function () {
                        this.ForHistory = new ForHistory(this);
                        this.scene.add('ForHistory', this.ForHistory, true, { x: 0, y: 0 });
                        this.Message.hisScene = this.ForHistory;

                        this.scene.sleep();
                    }.bind(this));
                }
            }
        }.bind(this));
*/