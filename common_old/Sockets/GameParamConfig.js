export { GameParamConfig };

var GameParamConfig = {
  C_GameID: "G014",
  C_ServerIP: "wss://g014.game.tfm.1465.tw:12014",
  C_ServerIP_Demo: "wss://g014.demogame.tfm.1465.tw:12014",
  C_ServerIP_GC: "wss://gcserver1.tfm.1465.tw:12014",
  C_AliveTime: 5 * 60 * 1000,                 // 多久送一次 alive 封包 (單位: ms)
  isDemoServer: false,
  isGameConsole: false,
};