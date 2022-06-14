import { GeneralMethods } from "../GeneralMethods.js";
import { GameParamConfig } from "./GameParamConfig.js";
export { RunParam };

var RunParam = {
  ReqID: "",
  OTC: "",
  Lobby: "",
  RoleID: 0,

  check: function () {
    this.ReqID = GeneralMethods.queryString("R");
    this.OTC = GeneralMethods.queryString("O");
    this.Lobby = GeneralMethods.queryString("L");

    this.isDemoServer();
    if (GameParamConfig.isGameConsole) GameParamConfig.C_ServerIP = GameParamConfig.C_ServerIP_GC;
    else if (GameParamConfig.isDemoServer) GameParamConfig.C_ServerIP = GameParamConfig.C_ServerIP_Demo;

    if ((this.ReqID != "") && (this.OTC != "")) {
      //console.log("Normal Mode (" + this.ReqID + "," + this.OTC + ")");
      return true;
    }
    return false;
  },

  isDemoServer: function () {
    // [].game.tfm.1465.tw
    // [].demogame.tfm.1465.tw
    // gcserver1.tfm.1465.tw
    // appassets.androidplatform.net/Download/[].game.tfm.1465.tw
    if (location.host == "gcserver1.tfm.1465.tw") {
      GameParamConfig.isDemoServer = false;
      GameParamConfig.isGameConsole = true;
      return;
    }
    GameParamConfig.isGameConsole = false;

    if ((location.host.length > 17) && (location.host.substr(location.host.length - 17, 17) == ".game.tfm.1465.tw")) {
      GameParamConfig.isDemoServer = false;
      return;
    }
    GameParamConfig.isDemoServer = true;

    if ((location.host.length > 21) && (location.host.substr(location.host.length - 21, 21) == ".demogame.tfm.1465.tw")) {
      return;
    }

    if (location.host != "appassets.androidplatform.net") return;
    if (location.pathname.length < 11) return;
    if (location.pathname.substr(0, 10) != "/Download/") return;

    if (location.pathname.indexOf(".game.tfm.1465.tw/") > 0) {
      GameParamConfig.isDemoServer = false;
      return;
    }
  },

};