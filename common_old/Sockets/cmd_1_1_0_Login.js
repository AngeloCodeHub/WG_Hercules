import { socketClient } from "./SocketClient.js";
import { SocketMsg, SocketMsgD } from "./SocketMsg.js";
import { RunParam } from "./RunParam.js";
import { E_RoleType, E_LoginState } from "./enum.js";
export { cmd_Login };

var cmd_Login = {
  send: function () {
    var u = new MSG_Login_u();
    u.ReqID = RunParam.ReqID;
    u.OTC = RunParam.OTC;
    //console.log("發訊: ", u.serialize);
    socketClient.sendMessage(u.serialize);
  },
  process: function (message) {
    var msg = new MSG_Login_d();
    msg.serialize = message;
    if (!msg.parseOK) { console.log("(1.1.0) 剖析失敗: " + msg.parseErrorMsg); socketClient.close("(1.1.0) 剖析失敗"); return null; }
    if (!msg.Success) {
      console.log("(1.1.0) 登入失敗: " + msg.ErrMsg); socketClient.close("(1.1.0) 登入失敗");
      console.log("Lobby URL: " + msg.LobbyURL);
      if (msg.LobbyURL != "") location = msg.LobbyURL;
      return null;
    }

    if (socketClient.onConnected != null) socketClient.onConnected({
      socketID: msg.socket_id,
      roleID: msg.roleID,
      roleName: msg.roleName,
      roleType: msg.roleType,
      coin: msg.coin,
      CoinName: msg.CoinName,
      lobbyURL: msg.LobbyURL,
    });
    return {
      name: "Login",
      socketID: msg.socket_id,
      roleID: msg.roleID,
      roleName: msg.roleName,
      roleType: msg.roleType,
      coin: msg.coin,
      CoinName: msg.CoinName,
      lobbyURL: msg.LobbyURL,
    };
  },
};

// 1.1.0 MSG_Login_u  登入(client)
class MSG_Login_u extends SocketMsg {
  get id1() { return 1; }
  get id2() { return 1; }
  get id3() { return 0; }

  constructor() {
    super();
    this.ReqID = "";
    this.OTC = "";
  }

  get serialize() {
    return this.baseData +
      "|" + this.ReqID +
      "|" + this.OTC;
  }
  set serialize(value) {
    this.parseOK = false;
    try {
      datas = this.parseData(value, 2);
      if (datas == null) return;
      this.ReqID = datas[0];
      this.OTC = datas[1];
      this.parseOK = true;
    }
    catch (e) { this.parseErrorMsg = "剖析例外 " + e; }
  }
};

// 1.1.0 MSG_Login_d  登入(server)
class MSG_Login_d extends SocketMsgD {
  get id1() { return 1; }
  get id2() { return 1; }
  get id3() { return 0; }

  constructor() {
    super();

    this.socket_id = 0;                  // 陣列索引
    this.roleID = 0;                     // 角色編號
    this.roleName = "";                  // 角色暱稱
    this.roleType = E_RoleType.Unknow;   
    this.coin = 0;                       // 遊戲幣金額
    this.CoinName = ""                   // 遊戲幣名稱   
    this.LobbyURL = "";                  // 平台大廳網址 (返回用)
  }

  get serialize() {
    return this.baseData +
      "|" + this.socket_id.ToString() +
      "|" + this.roleID.ToString() +
      "|" + this.roleName.ToString() +
      "|" + this.roleType.ToString() +
      "|" + this.coin.ToString() +
      "|" + this.CoinName +
      "|" + this.LobbyURL;
  }
  set serialize(value) {
    this.parseOK = false;
    try {
      let datas = this.parseData(value, 7);
      if (datas == null) return;

      this.socket_id = parseInt(datas[0]);
      this.roleID = parseInt(datas[1]);
      this.roleName = datas[2];
      this.roleType = parseInt(datas[3]);
      this.coin = parseInt(datas[4]);
      this.CoinName = datas[5];
      this.LobbyURL = datas[6];
      this.parseOK = true;
    }
    catch (e) { this.parseErrorMsg = "剖析例外 " + e; }
  }
};
