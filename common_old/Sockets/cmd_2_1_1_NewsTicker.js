import { SocketMsg } from "./SocketMsg.js";
import { NewsTicker } from "./NewsTicker.js";
export { cmd_NewsTicker };

class MSG_NewsTicker_d extends SocketMsg {
  get id1() { return 2; }
  get id2() { return 1; }
  get id3() { return 1; }

  constructor() {
    super();
    this.NewsTicker = null;
    this.IsMime = false;
  }

  set serialize(value) {
    this.parseOK = false;
    try {
      var items = this.parseData(value, 5);
      if (items == null) return;
      this.NewsTicker = new NewsTicker();
      this.NewsTicker.NTID = parseInt(items[0]);
      this.NewsTicker.NTType = parseInt(items[1]);
      this.NewsTicker.NTText = SocketMsg.SafeStringRevert(items[2]);
      this.NewsTicker.ShowTimes = parseInt(items[3]);
      this.IsMime = items[4] == "1";
      this.parseOK = true;
    }
    catch (e) { this.parseErrorMsg = "例外:" + e; }
  }
}

var cmd_NewsTicker = {
  process: function (message) {
    var msg = new MSG_NewsTicker_d();
    msg.serialize = message;
    if (!msg.parseOK) { console.log("(2.1.1) 剖析失敗: " + msg.parseErrorMsg); return null; }
    return {
      name: "NewNewsTicker",
      NTID: msg.NewsTicker.NTID,
      NTType: msg.NewsTicker.NTType,
      NTText: msg.NewsTicker.NTText,
      ShowTimes: msg.NewsTicker.ShowTimes,
      IsMime: msg.IsMime,
    };
  },

};