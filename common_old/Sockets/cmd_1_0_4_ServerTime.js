import { SocketMsg } from "./SocketMsg.js";
import { socketClient } from "./SocketClient.js";
export { cmd_ServerTime };

// 1.0.4 MSG_ServerTime_u  取得server時間 (client)
class MSG_ServerTime_u extends SocketMsg {
	get id1() { return 1; }
	get id2() { return 0; }
	get id3() { return 4; }

	constructor() {
		super();
		this.tc1 = 0;  // number tick unit:ms client
	}

	get serialize() { return this.baseData + "|" + this.tc1.toString(); }
	set serialize(value) {
		this.parseOK = false;
		try {
			var items = this.parseData(value, 1);
			if (items == null) return;
			this.tc1 = parseInt(items[0]);
			this.parseOK = true;
		}
		catch (e) { this.parseErrorMsg = "例外:" + e; }
	}
}

// 1.0.4 MSG_ServerTime_d  取得server時間 (server)
class MSG_ServerTime_d extends SocketMsg {
	get id1() { return 1; }
	get id2() { return 0; }
	get id3() { return 4; }

	constructor() {
		super();
		this.tc1 = 0;    // number tick unit:ms client
		this.tc2 = 0;    // number tick unit:ms server
	}

	get serialize() { return this.baseData + "|" + this.tc1.toString() + "|" + this.tc2.toString(); }
	set serialize(value) {
		this.parseOK = false;
		try {
			var items = this.parseData(value, 2);
			if (items == null) return;
			this.tc1 = parseInt(items[0]);  // double
			this.tc2 = parseInt(items[1]);
			this.parseOK = true;
		}
		catch (e) { this.parseErrorMsg = "例外:" + e; }
	}
}

var cmd_ServerTime = {
	msLocalFastThenServer: 0,  // local 比 server 快這麼多 ms

	serverNowTime: function () {
		return new Date(Date.now() - cmd_ServerTime.msLocalFastThenServer);
	},

	serverTime2LocalTime: function (date) {
		return new Date(date.getTime() + cmd_ServerTime.msLocalFastThenServer);
	},

	serverMS2LocalTime: function (msDate) {
		return new Date(msDate + cmd_ServerTime.msLocalFastThenServer);
	},

	send: function () {
		var ts = Date.now() + 62135596800000;  // unit:ms 加的數值是 0000/1/1 ~ 1970/1/1 的毫秒數
		var getTime = new MSG_ServerTime_u();
		getTime.tc1 = ts;
		socketClient.sendMessage(getTime.serialize);
	},

	process: function (message) {
		var msg = new MSG_ServerTime_d();
		msg.serialize = message;
		if (!msg.parseOK) { console.log("(1.0.4) 剖析失敗: " + msg.parseErrorMsg); return null; }
		var tc3 = Date.now() + 62135596800000;
		cmd_ServerTime.msLocalFastThenServer = ((tc3 + msg.tc1) / 2 - msg.tc2);
		//console.log("(1.0.4)\ntc1=" + msg.tc1 + "\ntc2=" + msg.tc2 + "\ntc3=" + tc3);
		console.log("Client 比 Server 快了 " + (cmd_ServerTime.msLocalFastThenServer / 1000) + "s");

		var st = cmd_ServerTime.serverNowTime();
		console.log(st +
			"\n" + cmd_ServerTime.serverTime2LocalTime(st) +
			"\n" + cmd_ServerTime.serverMS2LocalTime(st.getTime()));

		return { name: "ServerTime", clientFast: cmd_ServerTime.msLocalFastThenServer, };
	},

};
