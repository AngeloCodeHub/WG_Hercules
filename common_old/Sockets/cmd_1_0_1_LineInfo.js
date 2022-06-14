import { SocketMsg } from "./SocketMsg.js";
import { socketClient } from "./SocketClient.js";
import { cmd_SetKey } from "./cmd_1_0_3_SetKey.js";
export { cmd_LineInfo };

class MSG_LineInfo_d extends SocketMsg {
	get id1() { return 1; }
	get id2() { return 0; }
	get id3() { return 1; }

	constructor() {
		super();
		this.LineID = "";  // 連線編號
	}

	get serialize() {
		return this.baseData +
			"|" + this.LineID;
	}

	set serialize(value) {
		this.parseOK = false;
		try {
			var items = this.parseData(value, 1);
			if (items == null) return;
			this.LineID = items[0];
			this.parseOK = true;
		} catch (e) { this.parseErrorMsg = "剖析例外" + e; }
	}
};

var cmd_LineInfo = {
	process: function (message) {
		var msg = new MSG_LineInfo_d();
		msg.serialize = message;
		if (!msg.parseOK) { console.log("(1.0.1) 剖析失敗: " + msg.praseErrorMsg); return msg; }
		socketClient.LineID = msg.LineID;
		console.log("(1.0.1): LineID=" + msg.LineID);

		try { WatchMe.LineID = msg.LineID; WatchMe.SendMessage("LineInfo", { LineID: msg.LineID }); } catch (e) { }

		cmd_SetKey.send();

		return { name: "LineInfo", LineID: msg.LineID };
	},
};
