import { CustomScene, Button, ChangeNumText_Comma } from './CustomTools.js';

export class History extends CustomScene {
    constructor(game) {
        super("History");
        this.mainGame = game;

        this.nowHisAry = [];
        this.nowShowAry = [];
        this.nowPage = 0;
        this.nowFreeTimes = 0;
        this.nowWinTimes = 0;
    }

    preload() {
        let self = this.mainGame;
        self.load.setBaseURL('./');

        self.onceload.image('his_hisBtn', 'assets/History/history.png');
        self.onceload.image('his_toRight', 'assets/History/star03.png');
        self.onceload.image('his_return', 'assets/History/return1.png');
    }

    myCreate() {    //MainGame create 的 底部再呼叫(以免有些圖未preload)
        let self = this;

        this.hisCon = self.add.container().setAlpha(1).setVisible(false);

        //#region 壓暗畫面
        let graphics = self.add.graphics();
        graphics.fillStyle(0x000000, 0.9).fillRect(0, 0, 720, 1280);
        this.hisCon.add([
            graphics,
            self.add.zone(0, 0, 720, 1280).setInteractive().setOrigin(0)
        ]);
        //#endregion

        //#region 按鈕
        this.toLeftBtn = new Button(self, 'his_toRight', 'his_toRight', 40, 640, () => { this.ToNext(-1); }); this.toLeftBtn.main.setScale(-1, 1);
        this.toRightBtn = new Button(self, 'his_toRight', 'his_toRight', 680, 640, () => { this.ToNext(1); });
        this.returnBtn = new Button(self, 'his_return', 'his_return', 360, 1230, () => { this.Occur(false); });
        //#endregion

        //#region 文字
        this.recIDText = self.add.text(65, 40, '局號：-', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(0, 0.5);
        this.gameModeText = self.add.text(650, 40, '一般模式', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(1, 0.5);
        this.gameTurnText = self.add.text(650, 70, '獎項：-/-', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(1, 0.5);

        let gameName = self.add.text(35, 1105, '遊戲：海克力士', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(0, 0.5);
        this.moneyText = self.add.text(35, 1140, '錢包：-', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(0, 0.5);
        this.winText = self.add.text(35, 1175, '得分：-', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(0, 0.5);
        this.totalWinText = self.add.text(35, 1210, '總得分：-', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(0, 0.5);
        this.timeText = self.add.text(320, 1105, '時間：-', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(0, 0.5);
        this.betText = self.add.text(320, 1140, '總押：-', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(0, 0.5);
        this.finScoreText = self.add.text(320, 1175, '當局結算：-', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(0, 0.5);
        this.roundText = self.add.text(700, 1245, '-/-', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(1, 0.5);
        //#endregion

        //#region 滾輪相關
        this.wholeRollCon = self.add.container();
        let yAry = [1005, 1005, 1005, 1005, 1005, 860, 860, 860, 860, 860, 720, 720, 720, 720, 720, 580, 580, 580, 440];
        let xAry = [72, 216, 360, 504, 648, 72, 216, 360, 504, 648, 72, 216, 360, 504, 648, 216, 360, 504, 360];
        for (let i = 0; i < 19; i++) {
            let singleRollCon = self.add.container(0, 0);
            singleRollCon.add([
                self.add.image(xAry[i], yAry[i], 'Hercules_role_cube', 0).setScale(1.06)
            ]);
            this.wholeRollCon.add(singleRollCon);
        }

        //#region _TheBuff
        this.leftCharCon = self.add.container(110, 440);
        this.leftCharCon.add([
            self.add.image(0, 0, 'Role_HeraclesContinuousGraph')
        ])
        this.leftBuffCon = self.add.container();
        let buff_L_x = [225, 140, 310];
        let buff_L_y = [210, 150, 150];
        for (let i = 0; i < 3; i++) {
            let buffCon = self.add.container(buff_L_x[i], buff_L_y[i]).setVisible(false);
            buffCon.add([
                self.add.image(0, 0, 'JewelleryContinuousGraph'),
                self.add.image(0, 0, '2')
            ])
            this.leftBuffCon.add(buffCon);
        }

        this.rightCharCon = self.add.container(0, 0);
        let char_R_x = [580, 630, 520, 650];
        let char_R_y = [400, 470, 400, 300];
        let char_R_scale = [1, 0.75, 0.75, 0.6];
        for (let i = 3; i >= 0; i--) {
            this.rightCharCon.add(self.add.image(char_R_x[i], char_R_y[i], 'Role_lion').setScale(char_R_scale[i]).setVisible(false));
        }

        this.rightBuffCon = self.add.container();
        let buff_R_x = [520, 520, 430, 620];
        let buff_R_y = [210, 210, 150, 150];
        for (let i = 0; i < 4; i++) {
            let buffCon = self.add.container(buff_R_x[i], buff_R_y[i]).setVisible(false);
            buffCon.add([
                self.add.image(0, 0, 'JewelleryContinuousGraph'),
                self.add.image(0, 0, '2')
            ])
            this.rightBuffCon.add(buffCon);
        }
        //#endregion

        this.frameCon = self.add.container();
        this.frameCon.add([
            self.add.image(359, 720, 'G14_topBG3'),
        ])
        //#endregion

        // 當沒有記錄時，顯示這段文字
        this.noHistoryText = self.add.text(360, 640, '無歷史紀錄', { font: '20pt 微軟正黑體', color: '#ffffff' }).setOrigin(0.5).setVisible(false);

        this.hisCon.add([
            this.leftCharCon, this.leftBuffCon, this.rightCharCon, this.rightBuffCon,
            this.wholeRollCon, this.frameCon,
            this.toLeftBtn.main, this.toRightBtn.main, this.returnBtn.main,
            this.recIDText, this.gameModeText, this.gameTurnText,
            gameName, this.moneyText, this.winText, this.totalWinText,
            this.timeText, this.betText, this.finScoreText,
            this.roundText,
            this.noHistoryText
        ]);

        // self.ResetHistory();
        // self.GetHistory(true);
    }

    Occur(occur) {
        let self = this;

        self.isOpen = occur;
        self.tweens.add({
            targets: self.hisCon,
            alpha: occur ? 1 : 0,
            duration: 100, ease: 'Sine.Out',
            onStart: () => {
                if (occur) {
                    self.hisCon.setAlpha(0).setVisible(true);
                    self.GetHistory();
                }
            },
            onComplete: () => {
                if (!occur) {
                    self.hisCon.setVisible(false);
                    self.nowFreeTimes = 0;
                    self.nowWinTimes = 0;
                }
            }
        })
    }

    ToNext(index, setPage = false) {
        let self = this;

        if (self.nowShowAry == null) { self.ShowNoHistory(); return; }
        if (self.nowPage >= self.nowShowAry.length && self.nowShowAry.length != 0) { self.ShowHaveHistory(); self.nowPage = 0; self.ToNext(self.nowPage, true); return; }
        self.totalWinText.setVisible(false);

        let page;
        if (setPage) { page = index; }  // setPage時跳到指定頁
        else {
            if (self.SetTurn(index)) { return; };
            if (self.haveFreeGame) {                            // 當有該局有FreeGame時
                if (!(self.nowFreeTimes <= 0 && index < 0)) {   // 判斷玩家是「上一頁」還是「下一頁」當「上一頁」時不處理，跳回前一局；當「下一頁」時，則跳到FreeGame
                    let freeGameData = self.nowShowAry[self.nowPage].betResult.freeSlotPrize;

                    self.nowFreeTimes += index;
                    self.gameModeText.text = '免費轉輪：' + self.nowFreeTimes + '/' + freeGameData.length;
                    if (self.nowFreeTimes - 1 < 0 || self.nowFreeTimes - 1 >= freeGameData.length) {    //當免費遊戲的頁數超過第１頁或最後一頁時
                        self.haveFreeGame = false;

                        if (self.nowFreeTimes - 1 < 0) { self.ToNext(self.nowPage, true); } //超過第一頁，則回到「當前局數的一般模式」（如第３局的免費遊戲，會回到第３局的一般模式）
                        else { self.ToNext(self.nowPage + index, true); }                                        //超過最後一頁，則前往下一局

                        self.nowFreeTimes = 0;
                    } else {
                        self.SetBuffAns(freeGameData[self.nowFreeTimes - 1].role, freeGameData[self.nowFreeTimes - 1].WayPrizeList[0]);
                        self.myMul = freeGameData[self.nowFreeTimes - 1].mul;
                        self.SetRollAns(freeGameData[self.nowFreeTimes - 1].WayPrizeList, 0);
                    }

                    return;
                }
            }
            //當沒有沒有子遊戲時，則正常換頁
            page = (self.nowPage + index + self.nowShowAry.length) % self.nowShowAry.length;
        }


        self.nowPage = page;
        self.nowWinTimes = 0;
        let data = self.nowShowAry[self.nowPage];

        self.gameModeText.text = '一般模式';
        self.recIDText.text = '局號：' + data.recID;
        self.moneyText.text = '錢包：' + ChangeNumText_Comma(data.money);

        let totalWin;
        if (self.mainGame.phpServer) { totalWin = data.betResult.win; }
        else { totalWin = data.betResult.WinCoin; }
        self.totalWin = totalWin;
        self.totalWinText.text = '總得分：' + ChangeNumText_Comma(totalWin); self.timeText.text = '時間：' + data.time;

        self.betText.text = '總押：' + ChangeNumText_Comma(data.bet);
        self.finScoreText.text = '當局結算：' + ChangeNumText_Comma(data.freeCoin);

        self.roundText.text = (self.nowPage + 1) + '/' + self.nowShowAry.length;

        self.SetBuffAns(data.betResult.mainSlotPrize.role, data.betResult.mainSlotPrize.WayPrizeList[0]);
        self.myMul = data.betResult.mainSlotPrize.mul;
        self.SetRollAns(data.betResult.mainSlotPrize.WayPrizeList, 0);

        // 偵察該局有沒有子遊戲
        self.haveFreeGame = data.betResult.freeSlotPrize != null && data.betResult.freeSlotPrize.length != 0;

        self.totalWinText.setVisible(totalWin != 0);
    }

    SetTurn(index) {
        let self = this;

        self.nowWinTimes += index;
        if (self.nowWinTimes < 0 || self.nowWinTimes >= self.wayPrizeList.length) {
            self.nowWinTimes = 0;
            return false;
        } else {
            self.SetRollAns(self.wayPrizeList, self.nowWinTimes, self.nowShowAry[self.nowPage].betResult.mainSlotPrize.mul);

            self.totalWinText.setVisible(self.totalWin != 0 && self.nowWinTimes == 0 && self.nowFreeTimes == 0);
            return true;
        }
    }
    SetRollAns(wayPrizeList, index = 0) {
        let self = this;

        try {
            self.wayPrizeList = wayPrizeList;
            // self.haveWin = wayPrizeList.length > 1;

            let wheels = wayPrizeList[index].pai;
            for (let i = 0; i < 19; i++) {
                self.wholeRollCon.list[i].list[0].setTexture('Hercules_role_cube', wheels[i]);
            }

            this.gameTurnText.text = '獎項：' + (index + 1) + '/' + wayPrizeList.length;

            let win;
            win = wayPrizeList[index].win;
            win *= self.myMul;
            // console.log(mul);
            self.winText.text = '得分：' + ChangeNumText_Comma(win);
        } catch (e) {
            console.log(e);
            self.ShowNoHistory();
        }
    }
    SetBuffAns(role, wayPrizeList) {
        let self = this;

        let symPrize = wayPrizeList.symPrize == null ? [] : wayPrizeList.symPrize;

        for (let i = 0; i < 4; i++) { self.rightCharCon.list[i].setVisible(false); }
        for (let i = 0; i < self.rightBuffCon.length; i++) {
            self.rightBuffCon.list[i].setVisible(false);
            if (i >= 3) { continue; }
            self.leftBuffCon.list[i].setVisible(false);
        }

        let getBuffNum = [false, false, false];
        for (let i = 0; i < role.length; i++) {
            for (let j = 0; j < symPrize.length; j++) {
                if (role[i].sym == symPrize[j].sym) { getBuffNum[i] = true; continue; }
            }
        }

        for (let i = 0; i < role.length; i++) {
            let charIndex = role.length > 1 ? (3 - i - 1) : 3;
            self.rightCharCon.list[charIndex].setTexture(self.mainGame.JewelleryControl.Role.role_name[role[i].sym]).setVisible(true);

            let _mul = role[i].mul == -1 ? 'freegame' : '' + role[i].mul;
            if (getBuffNum[i]) {
                self.leftBuffCon.list[i].list[1].setTexture(_mul);
                self.leftBuffCon.list[i].setVisible(true);
            } else {

                let buffIndex = role.length > 1 ? i + 1 : i;
                self.rightBuffCon.list[buffIndex].list[1].setTexture(_mul);
                self.rightBuffCon.list[buffIndex].setVisible(true);
            }
        }
    }
    ShowNoHistory(type = 0) {
        let self = this;

        self.noHistoryText.setVisible(true);
        self.noHistoryText.text = type == 0 ? '無歷史紀錄' : '您所檢視的紀錄已超出可檢視的範圍';

        self.toLeftBtn.main.setVisible(type != 0);
        self.toRightBtn.main.setVisible(type != 0);
        self.wholeRollCon.setVisible(false);
        self.frameCon.setVisible(false);
        self.leftCharCon.setVisible(false);
        self.leftBuffCon.setVisible(false);
        self.rightCharCon.setVisible(false);
        self.rightBuffCon.setVisible(false);

        self.recIDText.text = '局號：-';
        self.moneyText.text = '錢包：-';
        self.winText.text = '得分：-';
        self.totalWinText.text = '總得分：-'
        self.timeText.text = '時間：-';
        self.betText.text = '總押：-';
        self.finScoreText.text = '當局結算：-';
        self.roundText.text = '-/-';
    }
    ShowHaveHistory() {
        let self = this;

        self.noHistoryText.setVisible(false);

        self.wholeRollCon.setVisible(true);
        self.frameCon.setVisible(true);
        self.leftCharCon.setVisible(true);
        self.leftBuffCon.setVisible(true);
        self.rightCharCon.setVisible(true);
        self.rightBuffCon.setVisible(true);

        self.toLeftBtn.main.setVisible(true);
        self.toRightBtn.main.setVisible(true);
    }

    SetHistory(result) {
        let self = this;

        // 當收到封包後立即記錄
        // 記錄前先取得現在資料。假如資料數量大過50筆，就刪掉最後一筆
        let ary = JSON.parse(localStorage.getItem(self.dataName));
        if (ary == null) { ary = []; }

        let checkSameID = false;
        let resultID = self.mainGame.phpServer ? result.RecID : result.BetResult.RecID;
        for (let i = 0; i < ary.length; i++) {
            if (resultID == ary[i].recID) { checkSameID = true; break; }
        }
        if (checkSameID) { return; }
        if (ary.length >= 50) { ary.splice(-1, 1); }

        let tmp;
        if (self.mainGame.phpServer) {
            let _betResult = result.Result;
            tmp = {
                recID: resultID,
                betResult: _betResult.prize,
                money: self.mainGame.myMoney,
                win: _betResult.WinCoin,
                time: new Date().toLocaleString(),
                bet: self.mainGame.myTotalBet,
                freeCoin: result.PT,
            }
        } else {
            let _betResult = result.BetResult;
            tmp = {
                recID: resultID,
                betResult: _betResult,
                money: self.mainGame.myMoney,
                win: _betResult.WinCoin,
                time: new Date().toLocaleString(),
                bet: self.mainGame.myTotalBet,
                freeCoin: result.FreeCoin,
            }
        }
        ary.splice(0, 0, tmp);

        localStorage.setItem(self.dataName, JSON.stringify(ary));
        self.nowHisAry = ary;

        // 當有新資料時，固定回到第一頁
        // self.nowPage = 0;
        // self.nowFreeTimes = 0;
        // self.nowWinTimes = 0;
    }
    GetHistory(first = false) {
        let self = this;

        // 開啟歷史記錄時會呼叫
        self.nowHisAry = JSON.parse(localStorage.getItem(self.dataName));
        if (first) { self.nowShowAry = self.nowHisAry; }
        console.log(self.nowHisAry);
        if (self.nowHisAry == null || self.nowHisAry.length == 0) {
            // 沒有記錄時所有滾輪都不顯示，只顯示「沒有記錄」的文字
            self.ShowNoHistory();
        } else {
            self.ShowHaveHistory();
            self.ToNext(self.nowPage, true);
        }
    }
    UpdateNowShowAry() {
        let self = this;

        self.nowShowAry = self.nowHisAry;
        if (!self.isOpen) {
            self.nowPage = 0;
            self.nowFreeTimes = 0;
            self.nowWinTimes = 0;
        } else {
            self.nowPage++;
            if (self.nowPage >= self.nowShowAry.length) { self.ShowNoHistory(1); }
            else { self.roundText.text = (self.nowPage + 1) + '/' + self.nowShowAry.length; }
        }
    }

    ResetHistory() {
        let self = this;

        if (self.dataName == null || self.dataName == '') return;
        // 重置所有資料。在測試時假如資料出錯，可以呼叫此function重置
        localStorage.removeItem(self.dataName);
    }
    SetName(st) {
        let self = this;

        self.dataName = st + '_g014_Result';
        self.GetHistory(true);
    }
}

/*
在其他腳本加的東西:
----------
MainGame:
在preload 裡加入場景
    this.History = new History(this);
    this.scene.add('History', this.History, true, { x: 0, y: 0 });

在create 裡加入「生成按鈕」，理論上加在create哪行都可
    this.historyBtn = new Button(ego, 'his_hisBtn', 'his_hisBtn', 686, 110, (function () {
        this.WinEffectCtrl.StopShow();  //開啟時關閉中獎顯示
        this.History.Occur(true);
    }).bind(this));

在create 底部加入
    this.scene.bringToTop('History');
    this.History.myCreate();

在遊戲進行期間要
    this.historyBtn.disable(disable, 'his_hisBtn');
----------
MySocket:
收到Bet 後要呼叫
    game.History.SetHistory(message);
*/