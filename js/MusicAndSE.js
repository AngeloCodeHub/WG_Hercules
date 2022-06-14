import { Button } from './CustomTools.js';
import { Game } from './SceneCtrl.js';

export class MusicAndSE {
    constructor(game) {
        this.game = game;

        this.loopingSE = [];
        this.BGM = [];

        this.gradTimeLine = null;
        this.gradTarget_1 = null;
        this.gradTarget_2 = null;

    }

    preload() {
        let ego = this.game;

        //#region 音效按鈕
        ego.onceload.image('switchSound_N', 'assets/DownUI/hercules_btn_sound.png');
        ego.onceload.image('switchSound_P', 'assets/DownUI/hercules_btn_sound_no.png');
        //#endregion

        ego.load.audio('SE_burst1', 'assets/Music/SE/SE_burst1.mp3');
        ego.load.audio('SE_Current1', 'assets/Music/SE/SE_Current1.mp3');
        ego.load.audio('SE_block_clash', 'assets/Music/SE/SE_block_clash.mp3');
        ego.load.audio('SE_ChangRole', 'assets/Music/SE/SE_ChangRole.mp3');
        ego.load.audio('SE_Heracles', 'assets/Music/SE/SE_Heracles.mp3');
        ego.load.audio('SE_ligheball', 'assets/Music/SE/SE_ligheball.mp3');
        ego.load.audio('SE_ChangeBetCoin_A', 'assets/Music/SE/SE_ChangeBetCoin_A.mp3');
        ego.load.audio('SE_ChangeBetCoin_B', 'assets/Music/SE/SE_ChangeBetCoin_B.mp3');
        ego.load.audio('SE_OddChange', 'assets/Music/SE/SE_OddChange.mp3');
        ego.load.audio('SE_OddOccur', 'assets/Music/SE/SE_OddOccur.mp3');
        ego.load.audio('SE_StartRoll', 'assets/Music/SE/SE_StartRoll.mp3');
        ego.load.audio('SE_WinScore_B', 'assets/Music/SE/SE_WinScore_B.mp3');
        ego.load.audio('SE_BigWinLvUP_L', 'assets/Music/SE/SE_BigWinLvUP_L.mp3');
        ego.load.audio('SE_BigWinLvUP_S', 'assets/Music/SE/SE_BigWinLvUP_S.mp3');
        ego.load.audio('SE_BigWinCoin', 'assets/Music/SE/SE_BigWinCoin.mp3');

        ego.load.audio('BG_BackGround', 'assets/Music/BG_BackGround.mp3');
        ego.load.audio('BG_FreeBackGround', 'assets/Music/BG_FreeBackGround.mp3');
        ego.load.audio('BG_BigWin', 'assets/Music/BG_BigWin.mp3');

    }
    create() {
        let ego = this.game;

        //#region _音效按鈕
        this.switchSoundBtn = new Button(ego, 'switchSound_N', 'switchSound_P', 40, 1247, (function () {
            this.game.sound.mute = !this.game.sound.mute;
            this.game.sound.volume = 1;
        }).bind(this), null, [true, false]).Main.setDepth(4);
        //#endregion (音效按鈕)

        this.BGM[0] = this.game.sound.add('BG_BackGround', { loop: true, volume: 0.8 });
        this.BGM[1] = this.game.sound.add('BG_FreeBackGround', { loop: true, volume: 0.8 });
        this.BGM[2] = this.game.sound.add('BG_BigWin', { loop: true });

        // this.BGM[0].play();
    }

    PlaySoundEffect(st = '', loop = false) {
        if (Game.CheckCanSound() != null && !Game.CheckCanSound()) { return; }
        if (loop) {
            let tmp = this.game.sound.add(st, { loop: true });
            let loopSE = { name: st, se: tmp };
            this.loopingSE.push(loopSE);

            tmp.play();
        } else {
            this.game.sound.play(st);
        }
    }
    CloseSoundEffect(st = '', gradient = false) {
        let target = null;
        for (let i = 0; i < this.loopingSE.length; i++) {
            if (this.loopingSE[i].name === st) {
                target = this.loopingSE[i].se;
                this.loopingSE.splice(i, 1);
                break;
            }
        }

        if (target == null) return;
        if (gradient) {
            this.game.tweens.add({
                targets: target,
                volume: 0,
                duration: 500,
                onComplete: function () {
                    target.stop();
                    target = null;
                }
            });
        } else {
            target.stop();
            target = null;
        }

    }

    ChangeBGM(index = 0, gradient = false, durationT = 2000) {
        let lastTarget = [];
        let nowTarget = [];
        let theVolume = 1;
        for (let i = 0; i < this.BGM.length; i++) {
            if (this.BGM[i].isPlaying) {
                lastTarget.push(this.BGM[i]);
                // if (i === 0) { lastTarget.push(this.BGM[5]); }
                break;
            }
        }

        nowTarget.push(this.BGM[index]);
        // if (index === 0) {
        //     nowTarget.push(this.BGM[5]);
        //     theVolume = 0.4;
        // }

        if (this.gradTimeLine != null) { this.gradTimeLine.destroy(); }
        if (gradient) {
            this.gradTimeLine = this.game.tweens.createTimeline();
            for (let i = 0; i < lastTarget.length; i++) {
                this.gradTimeLine.add({
                    targets: lastTarget[i],
                    volume: 0.1,
                    duration: durationT,
                    ease: 'Sine.Out',
                    onComplete: function () {
                        lastTarget[i].stop();
                        lastTarget[i].volume = 1;
                    }.bind(this)
                });
            };
            for (let i = 0; i < nowTarget.length; i++) {
                this.gradTimeLine.add({
                    targets: nowTarget[i],
                    volume: theVolume,
                    ease: 'Sine.In',
                    duration: 250,
                    onStart: function () {
                        nowTarget[i].play();
                        nowTarget[i].volume = 0;
                    }.bind(this)
                });
            }
            this.gradTimeLine.play();
        } else {
            for (let i = 0; i < lastTarget.length; i++) {
                lastTarget[i].stop();
                lastTarget[i].volume = 1;
            }
            for (let i = 0; i < nowTarget.length; i++) {
                nowTarget[i].volume = theVolume;
                nowTarget[i].play();
            }
        }
    }

    ChangeVolume(index = 0, value = 1) {
        this.game.tweens.add({
            targets: this.BGM[index],
            volume: value,
            duration: 300,
        });
    }

}