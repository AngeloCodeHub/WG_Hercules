import { socketClient } from "../common_old/Sockets/SocketClient.js";
import { E_SocketState } from "../common_old/Sockets/enum.js";
import { GameParamConfig } from "../common_old/Sockets/GameParamConfig.js";
import { GeneralMethods } from "../common_old/GeneralMethods.js";
// import { Message } from '../tools/Message.js';
// import { cmd_Bet } from "../common_old/Sockets/cmd_14_1_1_Bet.js";
export { MySocket };
var message_stack = [];
var MySocket = {
  originalSocketStatus: E_SocketState.Init,
  // stateText: null,
  // lineID: null,
  // socketID: null,
  // roleID: null,
  // roleName: null,
  // roleType: null,
  // freeCoin: null,

  reLink_index: 0,
  reLink_timeout: null,

  breakHint_reasonCode: null,
  breakHint_reason: null,


  init: function (game) {
    MySocket.parents = game;
    // MySocket.stateText = game.add.text(550, 10, "", { fontSize: '14px', fill: "#000" });
    // this.lineID = game.add.text(10, 550, "", { fontSize: "14px", fill: "#ffffff" });
    // this.socketID = game.add.text(10, 570, "", { fontSize: "14px", fill: "#ffffff" });
    // this.roleID = game.add.text(200, 550, "", { fontSize: "14px", fill: "#ffffff" });
    // this.roleName = game.add.text(200, 570, "", { fontSize: "14px", fill: "#ffffff" });
    // this.roleType = game.add.text(300, 550, "", { fontSize: "14px", fill: "#ffffff" });
    // this.freeCoin = game.add.text(300, 570, "", { fontSize: "14px", fill: "#ffffff" });

    socketClient.onConnected = function (roleInfo) {
      console.log("MySocket: Connected");

      game.isTest = GameParamConfig.isDemoServer;
      if (game.isTest) { console.log(GameParamConfig.isDemoServer ? "測試服" : "正式服"); }

      //console.log(roleInfo);
      // MySocket.lineID.setText(socketClient.LineID);
      // MySocket.socketID.setText(roleInfo.socketID.toString());
      // MySocket.roleID.setText(roleInfo.roleID.toString());
      // MySocket.roleName.setText(roleInfo.roleName);
      // MySocket.roleType.setText(roleInfo.roleType.toString());
      // MySocket.freeCoin.setText(roleInfo.coin.toString());
    };

    socketClient.onDisconnected = function (event, disconnectByMyCode) {
      console.log("MySocket: Disconnected");

      game.disLink = true;
      if (MySocket.reLink_timeout != null) { clearTimeout(MySocket.reLink_timeout); }
      if (MySocket.breakHint_reason == '[cmd_1_1_0] 登入時dup檢查') MySocket.reLink_index = 100;
      if (MySocket.reLink_index > 5) {
        console.log(event);
        console.log(disconnectByMyCode);

        let st = "服務斷線";
        st += "\n" + "ws:" + event.code;
        if (MySocket.breakHint_reasonCode != null) { st += "\n" + "BC:[" + MySocket.breakHint_reasonCode + "]" + MySocket.breakHint_reason; }
        if (disconnectByMyCode != "") { st += "\n" + "BC:" + disconnectByMyCode };

        game.Message.ShowMessage(st, true, false, true);
        return;
      }
      MySocket.reLink_index += 1;
      setTimeout(() => { socketClient.setClient(); }, 1000);
    };

    socketClient.onError = function (errorType, message, event) {
      var self = game;
      console.log(event);
      switch (errorType) {
        case "NoParam":  // 缺乏參數, 無法進遊戲
          console.log("NoParam: " + message);
          // 應顯示訊息 "請回遊戲平台操作"
          message_stack.push({ 0: "請由平台大廳連入遊戲", 1: true, 2: false, 3: true })
          //self.message.ShowMessage(message,true,false,true);
          break;
        case "WSError":  // 網路報錯
          message_stack.push({ 0: message, 1: true, 2: false, 3: true })
          console.log("WSError: " + message);
          break;
      }
    };

    socketClient.onGetMessage = function (message) {
      var self = game;
      switch (message.name) {
        case 'BreakHint':
          console.log(message);
          MySocket.breakHint_reasonCode = message.reasonCode;
          MySocket.breakHint_reason = message.reason;
          return;
        case "Login":
          console.log("登入成功\nRoleID=", message.roleID, "\nRoleName=", message.roleName,
            "\nCoin=" + message.coin,
            "\nCoinName=" + message.CoinName,
            "\n房卡=" + message.RoomCard,
            "\n免費=" + message.freeCount,
            "\n大廳網址=", message.lobbyURL);

          if (game.disLink) {
            MySocket.reLink_timeout = setTimeout(() => {
              game.disLink = false;
              MySocket.reLink_index = 0;
              MySocket.reLink_timeout = null;
              game.ReShowBetResult();
              game.BtnAllDisable(false);
              if (game.status > 0) {
                game.SetFailToBet();
                game.JewelleryControl.PacketFinish = true;
              }
              else {
                if (game.auto) { game.StartRolling(); }
                if (game.Message.messageCon.alpha != 0) { game.Message.ShowMessage('', false, false, false); }
              }
            }, 1000);
          }

          game.SetMyMoney(message.coin);//更新Coin金額
          // self.CoinName = message.CoinName;//幣名   
          game.CoinName = '金額';
          if (self.scrollText.playerNameText != null) { self.scrollText.playerNameText.setText(message.roleName); }//玩家名稱
          game.BtnAllDisable(false);//解除全部按鈕禁用狀態

          //#region 機台相關(取資料 判定環境 回大廳)
          if (self.UseSetting == 'ROBOT1') {
            CefSharp.BindObjectAsync("ApiCtrl").then(function (result) {
              self.ApiCtrl = ApiCtrl;
              self.url = self.ApiCtrl.getGlobalHome();//回大廳網址
              if (self.upUI != null) { self.upUI.url = self.ApiCtrl.getGlobalHome(); }

              game.ApiCtrl.sendBetToBigJackpot(game.myTotalBet);
            }.bind(self));

            game.exchangeText.setVisible(true);
          }
          else {
            self.url = message.lobbyURL;//回大廳網址
            if (self.upUI != null) { self.upUI.url = message.lobbyURL; }

            game.exchangeText.setVisible(false);
          }
          //#endregion

          game.Message.ShowMessage('', false, false, false);//解除等待資料遮罩畫面
          game.History.SetName(message.roleName);

          return;
        case "Bet":
          game.JewelleryControl.PacketFinish = true;//告訴滾輪 封包已完成 停止隨機掉落
          if (!message.Success) {
            game.SetFailToBet(message.ErrMsg);
            console.log("押注失敗: ", message.ErrMsg);
            return;
          }

          // if (message.BetResult.freeSlotPrize.length == 0) {
          //   cmd_Bet.send(game.myBet);
          //   return;
          // }

          game.SetAns(message.BetResult, message.BetResult.mainSlotPrize);
          if (message.BetResult.freeSlotPrize.length != 0) { game.SetFreeGame(message.BetResult.freeSlotPrize); }
          game.History.SetHistory(message);

          if (game.isTest) {
            // console.log(message);
            console.log(message.BetResult);
            if (message.BetResult.freeSlotPrize.length != 0) { console.log(message.BetResult.freeSlotPrize); }
          }
          return;

        case "OldNewsTickers":
          if (game.UseSetting == 'ROBOT1') { return; }
          if (game.isTest) { console.log("OldNewsTickers", message.NewsTickers); }
          for (let i = 0; i < message.NewsTickers.length; i++) {
            game.scrollText.PlusNewSt(0, message.NewsTickers[i], true);
          }
          return;

        case "NewNewsTicker":       // message.NewsTickerType -->  1: 中獎公告     2: 系統公告      3: 其他公告
          if (game.UseSetting == 'ROBOT1') { return; }
          if (game.isTest) {
            console.log("NTID:" + message.NTID + ", NTType:" + message.NTType + ",       ShowTimes:" + message.ShowTimes);
            console.log("NTText:" + message.NTText);
          }
          game.scrollText.PlusNewSt(message.NTType, message);
          return;

        case "KillNewsTicker":
          if (game.UseSetting == 'ROBOT1') { return; }
          if (game.isTest) { console.log("KillNewsTicker: " + message.NTID); }
          for (let i = 0; i < message.Removes.length; i++) {
            game.scrollText.DeleteScrollText(message.Removes[i]);
          }
          return;

        case "PTInfo":
          game.PointsMoney = message.PT;
          game.haveMoneyfromSer = true;
          if (game.AllFinish) { game.SetMyMoney(message.PT); game.haveMoneyfromSer = false; }
          console.log("角色餘額: 公道幣=", message.PT, "房卡=", message.RC);
          return;
        default:
          console.log("[MySocket.GetMessage]\n", message);
          return;
      }
    };

    socketClient.setClient();
    MySocket.originalSocketStatus = socketClient.status;
    console.log("Client Status: " + MySocket.originalSocketStatus);
    if (MySocket.originalSocketStatus == E_SocketState.NoParam) return;
  },

  update: function () {
    // if (message_stack.length != 0) {
    //   let tmp = message_stack.shift();
    //   this.parents.message.ShowMessage(tmp[0], tmp[1], tmp[2], tmp[3]);
    // }


    let now = new Date();

    if (MySocket.originalSocketStatus != socketClient.status) {
      MySocket.originalSocketStatus = socketClient.status;
      console.log("Socket: " + MySocket.originalSocketStatus);
    }
  },

  setLobbyURL: function () {
    self.url = this.ApiCtrl.Global_home;//回大廳網址
    if (self.upUI != null) { self.upUI.url = this.ApiCtrl.Global_home; }
  }

};