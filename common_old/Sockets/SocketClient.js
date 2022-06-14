import { E_SocketState } from "./enum.js";
import { cmd } from "./cmd.js";
import { cmd_Alive } from "./cmd_1_0_2_Alive.js";
import { GameParamConfig } from "./GameParamConfig.js";
import { RunParam } from "./RunParam.js";
export { socketClient };

let socketClient = {
  status: E_SocketState.Init,
  ws: null,
  DESKey: null,
  DESIV: null,
  LineID: "",

  onConnected: null,
  onDisconnected: null,
  onGetMessage: null,
  onError: null,

  disconnectByMyCode: "",

  setClient: function () {
    if (!RunParam.check()) {
      socketClient.status = E_SocketState.NoParam; console.log("未指定參數, 請回到平台大廳.");
      if (socketClient.onError != null) socketClient.onError("NoParam", "未指定參數, 請由平台大廳連入遊戲");
      return;
    }

    socketClient.disconnectByMyCode = "";
    socketClient.ws = null;
    socketClient.DESKey = null;
    socketClient.DESIV = null;
    socketClient.LineID = "";

    //console.log(GameParamConfig.isDemoServer ? "測試服" : "正式服");
    console.log("Connect to " + GameParamConfig.C_ServerIP);
    socketClient.status = E_SocketState.Connecting;
    socketClient.ws = new WebSocket(GameParamConfig.C_ServerIP);

    socketClient.ws.onopen = function (event) {
      console.log("WS was opened.");
      socketClient.status = E_SocketState.Connected;
      cmd_Alive.nextTime();
    };

    socketClient.ws.onmessage = function (event) {
      var message = socketClient.parseMessage(event.data);
      //console.log("訊息: " + message + " ");
      var msg = cmd.process(message);
      if ((msg != null) && (socketClient.onGetMessage != null)) socketClient.onGetMessage(msg);
    };

    socketClient.ws.onerror = function (event) {
      console.log("WS raise an error.");
      if (socketClient.onError != null) socketClient.onError("WSError", "WS raise an error.", event);
    };

    socketClient.ws.onclose = function (event) {
      console.log("WS was disconnected.");
      socketClient.status = E_SocketState.Disconnected;
      if (socketClient.onDisconnected != null) socketClient.onDisconnected(event, socketClient.disconnectByMyCode);
    };
  },

  parseMessage: function (message) {
    if (message.length == 0) return "";
    var MC = message.substring(0, 1);
    if (MC == "M") return message.substring(1);
    if (MC == "C") {
      var cData = { ciphertext: CryptoJS.enc.Base64.parse(message.substring(1)) };
      var decrypted = CryptoJS.AES.decrypt(cData, socketClient.DESKey, { iv: socketClient.DESIV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    return message;
  },

  sendMessage: function (message, noEncryp = false) {
    if (noEncryp || (socketClient.DESIV == null)) message = "M" + message;
    else {
      var mData = message;
      var encrypted = CryptoJS.AES.encrypt(mData, socketClient.DESKey, { iv: socketClient.DESIV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      var strEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
      message = "C" + strEncrypted;
    }
    //console.log("發訊: " + message);
    socketClient.ws.send(message);
  },

  close: function (reason) {
    if ((reason == null) || (reason == "")) socketClient.disconnectByMyCode = "前端程式要求斷線";
    else socketClient.disconnectByMyCode = "前端程式要求斷線: " + reason;
    console.log("主動斷線");
    socketClient.ws.close();
  },

};