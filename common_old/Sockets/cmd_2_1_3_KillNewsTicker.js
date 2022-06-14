import { SocketMsg } from "./SocketMsg.js";
import { NewsTicker } from "./NewsTicker.js";
export { cmd_KillNewsTicker };

class MSG_KillNewsTicker_d extends SocketMsg {
  get id1() { return 2; }
  get id2() { return 1; }
  get id3() { return 3; }

  constructor() {
    super();
    this.Removes = [];
  }

  set serialize(value) {
    this.parseOK = false;
    try {
      var items = this.parseData(value);
      if (items == null) return;
      if (items.length < 1) { this.parseErrorMsg = "參數量不足"; return null; }
      let cc = parseInt(items[0]);
      if (items.length != (cc * 3 + 1)) { this.parseErrorMsg = "參數量不符"; return null; }
      let pos = 1;
      for (pos = 1; pos < items.length; pos += 3) {
        let NT = new NewsTicker();
        NT.NTID = parseInt(items[pos + 0]);
        NT.NTType = parseInt(items[pos + 1]);
        NT.ShowTimes = parseInt(items[pos + 2]);
        this.Removes.push(NT);
      }
      this.parseOK = true;
    }
    catch (e) { this.parseErrorMsg = "例外:" + e; }
  }
}

var cmd_KillNewsTicker = {
  process: function (message) {
    var msg = new MSG_KillNewsTicker_d();
    msg.serialize = message;
    if (!msg.parseOK) { console.log("(2.1.3) 剖析失敗: " + msg.parseErrorMsg); return null; }
    return {
      name: "KillNewsTicker",
      Removes: msg.Removes,
    };
  },

};