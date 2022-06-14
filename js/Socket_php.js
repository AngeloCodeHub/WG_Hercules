import { RunParam } from "../common/Sockets/RunParam.js";
import { cmd_UserLogin } from "../common/Sockets/cmd_1_0_2_UserLogin.js";
import { cmd_UserLeave } from "../common/Sockets/cmd_1_1_0_UserLeave.js";
import { cmd_GetUserInfo } from "../common/Sockets/cmd_1_0_3_GetUserInfo.js";

import { cmd_Bet } from "../common/Sockets/cmd_14_1_1_Bet.js";


var game;
var tk;
var gamebreak = false;
export var Socket_php = {
    init: function (_game) {
        game = _game;

        let param = RunParam.check();
        if (typeof param == 'string') { game.Message.ShowMessage('請重新登入', true, false, true); return; }

        cmd_UserLogin.send(param.ReqID, param.OTC, param.Lobby,
            function (result) {
                if (result.Error != null) { game.Message.ShowMessage('請重新登入', true, false, true); return; }
                // if (CmdCommon(result, false, true) == -1) { return; };
                console.log(result);

                tk = result.tk;

                game.url = result.LobbyUrl;
                game.finalScore = result.PT;
                game.SetMyMoney(result.PT);

                game.BtnAllDisable(false);
                if (game.scrollText.playerNameText != null) { game.scrollText.playerNameText.setText(result.NickName); }
                game.Message.ShowMessage('', false, false, false);

                game.History.SetName(result.roleName);
                
                if (game.UseSetting != 'ROBOT1' && result.Old_NewsTickers != null) {
                    for (let i = 0; i < result.Old_NewsTickers.length; i++) {
                        game.ScrollText.PlusNewSt(0, result.Old_NewsTickers[i], true);
                    }
                }
                game.CoinName = '金額';

                Socket_php.userInfo();
                if (tk !== '') {
                    window.addEventListener('beforeunload', () => {
                        cmd_UserLeave.send(tk, () => { });
                    }, false);
                }

                //#region 機台相關(取資料 判定環境 回大廳)
                if (game.UseSetting == 'ROBOT1') {
                    //#region 機台getInfo
                    try {
                        CefSharp.BindObjectAsync("ApiCtrl").then(function (result) {
                            game.ApiCtrl = ApiCtrl;
                            game.url = game.ApiCtrl.getGlobalHome();//回大廳網址
                            if (game.upUI != null) { game.upUI.url = game.ApiCtrl.getGlobalHome(); }

                            game.ApiCtrl.sendBetToBigJackpot(game.myTotalBet);
                        }.bind(game));
                    } catch (e) { console.log(e); }
                    //#endregion

                    game.exchangeText.setVisible(true);
                }
                else {
                    game.url = result.lobbyURL;//回大廳網址
                    if (game.upUI != null) { game.upUI.url = result.lobbyURL; }
                    // console.log(Vars[1]);

                    game.exchangeText.setVisible(false);
                }
                //#endregion
            })
    },

    bet: function (betCoin) {
        let betIndex = 0;
        let bet = function () {
            cmd_Bet.send(tk, betCoin, function (result) {
                game.JewelleryControl.PacketFinish = true;

                if (result.Error != null || gamebreak) {
                    if (++betIndex < 3) { bet(); }
                    else {
                        game.SetFailToBet(result.Error);
                        game.Message.ShowMessage("押注失敗:" + result.Error + '\n已退還金額', true, true, false);
                    }
                    console.log("BetAgain: " + betIndex);
                    return;
                }

                console.log(result);
                game.SetAns(result.Result.prize, result.Result.prize.mainSlotPrize);
                if (result.Result.prize.freeSlotPrize != null && result.Result.prize.freeSlotPrize.length != 0) { game.SetFreeGame(result.Result.prize.freeSlotPrize); }

                game.History.SetHistory(result);

            })
        }
        bet();
    },


    userInfo: function () {
        let cmdLoop = function () {
            cmd_GetUserInfo.send(tk, function (result) {
                setTimeout(() => { if (!gamebreak) cmdLoop(); }, 15000);
                if (result.Error != null) {
                    if (result.Reason == 'SystemError[UserInfo][1]: 請重新登入') { Socket_php.gameBreak('請重新登入'); }
                    return;
                }
                // console.log(result);
                if (result.PT == null) { return; }


                game.PointsMoney = result.PT;
                game.haveMoneyfromSer = true;
                if (game.AllFinish) { game.SetMyMoney(result.PT); game.haveMoneyfromSer = false; }

                Socket_php.newNT(result.NewNT);
                Socket_php.removeNT(result.RemoveNT);
            })
        }
        cmdLoop();
    },

    newNT: function (nt) {
        if (game.UseSetting == 'ROBOT1') { return; }
        if (nt != null) {
            console.log("HaveNew");
            for (let i = 0; i < nt.length; i++) {
                game.scrollText.PlusNewSt(nt[i].NTType, nt[i]);
            }
        }
    },

    removeNT: function (nt) {
        if (game.UseSetting == 'ROBOT1') { return; }
        if (nt != null) {
            console.log("HaveKill");
            for (let i = 0; i < nt.length; i++) {
                game.scrollText.DeleteScrollText(nt[i]);
            }
        }
    },

    gameBreak: function (st) {
        if (st != null) { game.Message.ShowMessage('請重新登入', true, false, true); }
        gamebreak = true;
    }

}