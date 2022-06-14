export { GameParamConfig };
let gid = '014';     //各遊戲 GameID

var GameParamConfig = {
  C_ServerIP: "https://gs.shop.localnet:12" + gid + "/",
  C_ServerIPDemo: "https://gs.shop.localnet:22" + gid + "/",
  C_AliveTime: 120 * 1000,                 // 多久送一次 alive 封包 (單位: ms)
  isDemoServer: false,
  isChecked: false,

  checkServer: function () {
    if (this.isChecked) return;
    this.isChecked = true;

    if (location.port == '20'.concat(gid)) {
      this.isDemoServer = true;
      this.C_ServerIP = this.C_ServerIPDemo;
    }
  }
};

GameParamConfig.checkServer();