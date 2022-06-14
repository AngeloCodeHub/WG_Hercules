import { SocketMsg, SocketMsgD } from "./SocketMsg.js";
import { socketClient } from "./SocketClient.js";
import { cmd_ServerTime } from "./cmd_1_0_4_ServerTime.js";
import { cmd_Login } from "./cmd_1_1_0_Login.js";
export { cmd_SetKey };

// 1.0.3 MSG_SetKey_u
class MSG_SetKey_u extends SocketMsg {
	get id1() { return 1; }
	get id2() { return 0; }
	get id3() { return 3; }

	constructor() {
		super();
		this.KeyInfo = "";
	}

	get serialize() {
		return this.baseData +
			"|" + this.KeyInfo;
	};

	set serialize(value) {
		this.parseOK = false;
		try {
			var items = this.parseData(value, 1);
			if (items == null) return;
			this.KeyInfo = items[0];
			this.parseOK = true;
		} catch (e) { this.parseErrorMsg = "剖析例外 " + e; }
	}
};

// 1.0.3 MSG_SetKey_d
class MSG_SetKey_d extends SocketMsgD {
	get id1() { return 1; }
	get id2() { return 0; }
	get id3() { return 3; }

	constructor() {
		super();
		this.KeyInfo = "";
	}

	get serialize() {
		return this.baseData +
			"|" + this.KeyInfo;
	};

	set serialize(value) {
		this.parseOK = false;
		try {
			var items = this.parseData(value, 1);
			if (items == null) return;
			this.KeyInfo = items[0];
			this.parseOK = true;
		} catch (e) { this.parseErrorMsg = "剖析例外 " + e; }
	}
};

var cmd_SetKey = {
	send: function () {
		var key1 = "";
		for (var i = Math.floor(20 + Math.random() * 10); i > 0; i--) key1 += String.fromCharCode(Math.floor(32 + Math.random() * (256 - 32)));
		var keyInfo = CryptoJS.enc.Utf8.parse(key1).toString(CryptoJS.enc.Base64);

		socketClient.DESKey = CryptoJS.SHA256(socketClient.LineID + "jeAjd2jSODfjdsf" + key1);
		//var desKey = socketClient.DESKey.toString(CryptoJS.enc.Base64);

		var setKey = new MSG_SetKey_u();
		setKey.KeyInfo = keyInfo;
		socketClient.sendMessage(setKey.serialize);
		console.log(setKey.serialize);
	},

	process: function (message) {
		var msg = new MSG_SetKey_d();
		msg.serialize = message;
		if (!msg.parseOK) { console.log("(1.0.3) 剖析失敗: " + msg.praseErrorMsg); return msg; }
		if (!msg.Success) { console.log("(1.0.3) 失敗: " + msg.ErrMsg); return msg; }

		var key1 = CryptoJS.enc.Base64.parse(msg.KeyInfo);
		var key2 = key1.toString(CryptoJS.enc.Utf8);
		var key3 = CryptoJS.SHA256(socketClient.LineID + "jk34SAksdfjSIDed43i" + key2).toString(CryptoJS.enc.Hex);
		var key4 = key3.substring(0, 32);
		socketClient.DESIV = CryptoJS.enc.Hex.parse(key4);

		console.log("(1.0.3) 安全通道建立完成");

		cmd_ServerTime.send();
		cmd_Login.send();

		return null;
	},
};
