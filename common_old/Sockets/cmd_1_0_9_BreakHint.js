import { SocketMsg } from "./SocketMsg.js";
export { cmd_BreakHint };

// 1.0.9 MSG_breakHint_d  斷線提示(server)
var cmd_BreakHint = {
	process: function (message) {
		var msg = new MSG_breakHint_d();
		msg.serialize = message;
		if (!msg.parseOK) { console.log("(1.0.9) 剖析失敗: " + msg.parseErrorMsg); return null; }
		console.log("(1.0.9) 即將斷線: [" + msg.reasonCode + "] " + msg.reason);
		return { name: "BreakHint", reasonCode: msg.reasonCode, reason: msg.reason, };
	},
};

class MSG_breakHint_d extends SocketMsg {
	get id1() { return 1; }
	get id2() { return 0; }
	get id3() { return 9; }

	constructor() {
		super();
		this.reasonCode = 0;     // 代碼  E_BreakHint
		this.reason = "";        // 原因描述
	}

	get serialize() { return this.baseData + "|@{reasonCode}|@{reason}"; }
	set serialize(value) {
		this.parseOK = false;
		try {
			var items = this.parseData(value, 2);
			if (items == null) return;
			this.reasonCode = parseInt(items[0]);
			this.reason = items[1];
			this.parseOK = true;
		}
		catch (e) { this.parseErrorMsg = "例外:" + e; }
	}
};