import { SocketMsg } from "./SocketMsg.js";
import { NewsTicker } from "./NewsTicker.js";
export { cmd_OldNewsTickers };

class MSG_OldNewsTickers_d extends SocketMsg {
  get id1() { return 2; }
  get id2() { return 1; }
  get id3() { return 2; }

  constructor() {
    super();
    this.NewsTickers = [];
  }

  set serialize(value) {
    this.parseOK = false;
    try {
      //console.log(value);
      var items = this.parseData(value);
      if (items == null) return;
      if (items.length < 1) { this.parseErrorMsg = "參數量不足"; return null; }
      let cc = parseInt(items[0]);
      if (items.length != (cc * 4 + 1)) { this.parseErrorMsg = "參數量不符"; return null; }
      let pos = 1;
      for (let pos = 1; pos < items.length; pos += 4) {
        let NT = new NewsTicker();
        NT.NTID = parseInt(items[pos + 0]);
        NT.NTType = parseInt(items[pos + 1]);
        NT.NTText = SocketMsg.SafeStringRevert(items[pos + 2]);
        NT.ShowTimes = parseInt(items[+3]);
        this.NewsTickers.push(NT);
      }
      this.parseOK = true;
    }
    catch (e) { this.parseErrorMsg = "例外:" + e; }
  }
}

var cmd_OldNewsTickers = {
  process: function (message) {
    var msg = new MSG_OldNewsTickers_d();
    msg.serialize = message;
    if (!msg.parseOK) { console.log("(2.1.2) 剖析失敗: " + msg.parseErrorMsg); return null; }
    return {
      name: "OldNewsTickers",
      NewsTickers: msg.NewsTickers,
    };
  },

};