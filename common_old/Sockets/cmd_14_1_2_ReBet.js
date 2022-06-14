import { socketClient } from "./SocketClient.js";
import { SocketMsg, SocketMsgD } from "./SocketMsg.js";
export { cmd_ReBet };

var cmd_ReBet = {
  send: function (BetState, BetCoin, LastRecID) {
    var ru = new MSG_Bet_ru();
    ru.BetState = BetState;
    ru.BetCoin = BetCoin;
    ru.LastRecID = LastRecID;
    socketClient.sendMessage(ru.serialize);
  },
};

class MSG_Bet_ru extends SocketMsg {
  get id1() { return 14; }
  get id2() { return 1; }
  get id3() { return 2; }

  constructor() {
    super();
    this.BetState = 0;
    this.BetCoin = 0;
    this.LastRecID = 0;
  }

  get serialize() {
    return this.baseData +
      "|" + this.BetState + "|" + this.BetCoin + "|" + this.LastRecID;
  }
  set serialize(value) {
    this.parseOK = false;
    try {
      let datas = this.parseData(value, 3);
      if (datas == null) return;

      this.BetState = parseInt(datas[0]);
      this.BetCoin = parseInt(datas[1]);
      this.LastRecID = parseInt(datas[2]);
      this.parseOK = true;
    }
    catch (e) { this.parseErrorMsg = "剖析例外:" + e; }
  }
};
