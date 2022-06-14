import { socketClient } from "./SocketClient.js";
import { SocketMsg, SocketMsgD } from "./SocketMsg.js";
import { BetResult, RoleData, WayRoundPrize, WayPrize, LinePrize } from "./BetResult.js";
export { cmd_Bet };

var cmd_Bet = {
  send: function (BetCoin) {
    var u = new MSG_Bet_u();
    u.BetCoin = BetCoin;
    //console.log("發訊: ", u.serialize);
    socketClient.sendMessage(u.serialize);
  },
  process: function (message) {
    var msg = new MSG_Bet_d();
    msg.serialize = message;
    if (!msg.parseOK) {
      console.log("(14.1.1) 剖析失敗: " + msg.parseErrorMsg);
      socketClient.close("(14.1.1) 剖析失敗");
      return {
        name: "Bet",
        Success: false,
        ErrMsg: "封包剖析失敗:" + msg.ErrMsg,
      };
    }
    if (!msg.Success) {
      console.log("(14.1.1) 押注失敗: " + msg.ErrMsg);
      return {
        name: "Bet",
        Success: false,
        ErrMsg: msg.ErrMsg,
      };
    }
    //  console.log(msg.Result);
    return {
      name: "Bet",
      Success: true,
      FreeCoin: msg.FreeCoin,
      BetResult: msg.Result,
    };
  },
};

class MSG_Bet_u extends SocketMsg {
  get id1() { return 14; }
  get id2() { return 1; }
  get id3() { return 1; }

  constructor() {
    super();
    this.BetCoin = 0;
  }

  get serialize() {
    return this.baseData +
      "|" + this.BetCoin;
  }
  set serialize(value) {
    this.parseOK = false;
    try {
      let datas = this.parseData(value, 1);
      if (datas == null) return;

      this.BetCoin = parseInt(datas[0]);
      this.parseOK = true;
    }
    catch (e) { this.parseErrorMsg = "剖析例外:" + e; }
  }
};

class MSG_Bet_d extends SocketMsgD {
  get id1() { return 14; }
  get id2() { return 1; }
  get id3() { return 1; }

  constructor() {
    super();
    this.FreeCoin = 0;
    this.Result = null;
  }

  set serialize(value) {
    this.parseOK = false;
    try {
      let datas = this.parseData(value);
      var debug = 0;
      if (datas.length > 0) {
        debug = 1;        // 基本欄位
        this.Result = new BetResult();
        this.FreeCoin = parseInt(datas[0]);
        this.Result.RecID = parseInt(datas[1]);
        this.Result.WinCoin = parseInt(datas[2]);
        this.Result.mainSlotPrize.win = parseInt(datas[3]);
        this.Result.mainSlotPrize.winBase = parseInt(datas[4]);
        this.Result.mainSlotPrize.mul = parseInt(datas[5]);
        this.Result.mainSlotPrize.addFreeTimes = parseInt(datas[6]);

        debug = 2;      // RoleData
        let cc_mr = parseInt(datas[7]);
        let pos = 8;
        if ((pos + 2 * cc_mr) > datas.length) return;
        let role = null;
        for (; cc_mr > 0; cc_mr--) {
          role = new RoleData();
          role.sym = parseInt(datas[pos++]);
          role.mul = parseInt(datas[pos++]);
          this.Result.mainSlotPrize.role.push(role);
        }
        debug = 3;     // WayPrize
        let cc_mw = parseInt(datas[pos++]);
        if ((pos + 21) > datas.length) return;
        let wayPrize = null;
        let linePrize = null;
        let cc_mwl = 0;
        for (; cc_mw > 0; cc_mw--) {
          wayPrize = new WayPrize();
          wayPrize.win = parseInt(datas[pos++]);
          wayPrize.mask = parseInt(datas[pos++]);
          for (let i = 0; i < 19; i++) wayPrize.pai[i] = parseInt(datas[pos++]);
          debug = 4;      // LinePrize
          cc_mwl = parseInt(datas[pos++]);
          for (; cc_mwl > 0; cc_mwl--) {
            linePrize = new LinePrize();
            linePrize.sym = parseInt(datas[pos++]);
            linePrize.num = parseInt(datas[pos++]);
            linePrize.mul = parseInt(datas[pos++]);
            linePrize.times = parseInt(datas[pos++]);
            linePrize.mask = parseInt(datas[pos++]);
            wayPrize.symPrize.push(linePrize);
          }
          this.Result.mainSlotPrize.WayPrizeList.push(wayPrize);
        }

        debug = 5;        // 免費遊戲
        let cc_f = parseInt(datas[pos++]);
        let cc_fr = 0;
        let cc_fw = 0;
        let cc_fwl = 0;
        let wayRoundPrize = null;
        for (; cc_f > 0; cc_f--) {
          wayRoundPrize = new WayRoundPrize();
          wayRoundPrize.win = parseInt(datas[pos++]);
          wayRoundPrize.winBase = parseInt(datas[pos++]);
          wayRoundPrize.mul = parseInt(datas[pos++]);
          wayRoundPrize.addFreeTimes = parseInt(datas[pos++]);
          debug = 6;      // Free_RoleData
          cc_fr = parseInt(datas[pos++]);
          for (; cc_fr > 0; cc_fr--) {
            role = new RoleData();
            role.sym = parseInt(datas[pos++]);
            role.mul = parseInt(datas[pos++]);
            wayRoundPrize.role.push(role);
          }
          debug = 7;      // Free_WayPrize
          cc_fw = parseInt(datas[pos++]);
          for (; cc_fw > 0; cc_fw--) {
            wayPrize = new WayPrize();
            wayPrize.win = parseInt(datas[pos++]);
            wayPrize.mask = parseInt(datas[pos++]);
            for (let i = 0; i < 19; i++) wayPrize.pai[i] = parseInt(datas[pos++]);
            debug = 8;      // Free_LinePrize
            cc_fwl = parseInt(datas[pos++]);
            for (; cc_fwl > 0; cc_fwl--) {
              linePrize = new LinePrize();
              linePrize.sym = parseInt(datas[pos++]);
              linePrize.num = parseInt(datas[pos++]);
              linePrize.mul = parseInt(datas[pos++]);
              linePrize.times = parseInt(datas[pos++]);
              linePrize.mask = parseInt(datas[pos++]);
              wayPrize.symPrize.push(linePrize);
            }
            wayRoundPrize.WayPrizeList.push(wayPrize);
          }
          this.Result.freeSlotPrize.push(wayRoundPrize);
        }
      }
      this.parseOK = true;
    } catch (e) { this.parseErrorMsg = "剖析例外[" + debug.toString() + "]:" + e + ""; }
  }
};