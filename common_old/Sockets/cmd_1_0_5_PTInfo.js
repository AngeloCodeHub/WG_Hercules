import { SocketMsg } from "./SocketMsg.js";
export { cmd_PTInfo };

// 1.0.5 MSG_PTInfo_d  更新角色餘額 (server)
class MSG_PTInfo_d extends SocketMsg {
  get id1() { return 1; }
  get id2() { return 0; }
  get id3() { return 5; }

  constructor() {
    super();
    this.PT = 0;
    this.RC = 0;
  }

  get serialize() { return this.baseData + "|" + this.PT.toString() + "|" + this.RC.toString(); }
  set serialize(value) {
    this.parseOK = false;
    try {
      var items = this.parseData(value, 2);
      if (items == null) return;
      this.PT = parseInt(items[0]);
      this.RC = parseInt(items[1]);
      this.parseOK = true;
    }
    catch (e) { this.parseErrorMsg = "例外:" + e; }
  }
}

var cmd_PTInfo = {
  process: function (message) {
    var msg = new MSG_PTInfo_d();
    msg.serialize = message;
    if (!msg.parseOK) { console.log("(1.0.5) 剖析失敗: " + msg.parseErrorMsg); return null; }
    console.log("角色餘額: 遊戲幣=", msg.PT, "房卡=", msg.RC);
    return { name: "PTInfo", PT: msg.PT, RC: msg.RC };
  },

};
