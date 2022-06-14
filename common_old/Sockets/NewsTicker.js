import { E_NewsTickerType } from "./enum.js";
export { NewsTicker };

class NewsTicker {
  constructor() {
    this.NTID = 0;                        // 訊息編號
    this.NTType = E_NewsTickerType.None;  // 訊息種類
    this.NTText = "";                     // 訊息內容
    this.ShowTimes = 0;                   // 顯示次數
  }
}