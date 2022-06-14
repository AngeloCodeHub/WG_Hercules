import { SocketMsg } from "./SocketMsg.js";
import { socketClient } from "./SocketClient.js";
import { GameParamConfig } from "./GameParamConfig.js";
import { E_SocketState } from "./enum.js";
export { cmd_Alive };

// 1.0.2
class MSG_alive extends SocketMsg {
	get id1() { return 1; }
	get id2() { return 0; }
	get id3() { return 2; }

	get serialize() {
		return this.baseData;
	}

	set serialize(value) {
		parseOK = false;
		try {
			var items = this.parseData(value, 0);
			if (items == null) return;
			this.parseOK = true;
		}
		catch (e) { this.parseErrorMsg = "例外:" + e; }
	}
};

var cmd_Alive = {
	send: function () {
		var u = new MSG_alive();
		socketClient.sendMessage(u.serialize, true);
		if (socketClient.status == E_SocketState.Connected) cmd_Alive.nextTime();
	},
	nextTime: function () { setTimeout(function () { cmd_Alive.send(); }, GameParamConfig.C_AliveTime); },
};