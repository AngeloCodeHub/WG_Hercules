import { GeneralMethods } from "../GeneralMethods.js";
export { RunParam };

var RunParam = {
  ReqID: "",
  OTC: "",
  Lobby: "",

  check: function () {
    this.ReqID = GeneralMethods.queryString("R");
    this.OTC = GeneralMethods.queryString("O");
    this.Lobby = GeneralMethods.queryString("L");

    if ((this.ReqID != "") && (this.OTC != "")) {
      //console.log("Normal Mode (" + this.ReqID + "," + this.OTC + ")");
      let LoginInfo = {
        ReqID: this.ReqID,
        OTC: this.OTC,
        Lobby: this.Lobby,
      }
      return LoginInfo;
    }
    return "Login Error";
  },

};