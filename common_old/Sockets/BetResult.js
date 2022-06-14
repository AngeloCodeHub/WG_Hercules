export { E_Symbol, E_Role, BetResult, WayRoundPrize, RoleData, WayPrize, LinePrize };

const E_Symbol = {
  SYM1: 0,
  SYM2: 1,
  SYM3: 2,
  SYM4: 3,
  SYM5: 4,
  SYM6: 5,
  SYM7: 6,
  SYM8: 7,
  SYM9: 8,
  WILD: 9,
  SYM10: 10,
  FREE: 11,
  FEVER: 12,
  MAX: 13,
};

const E_Role = {
  X1: 1,         // 人物與連線物件沒匹配
  X2: 2,         // 中獎分數2倍
  X3: 3,         // 中獎分數3倍
  X5: 5,         // 中獎分數5倍
  X10: 10,       // 中獎分數10倍
  FREE: -1,      // 免費遊戲
};

class BetResult {
  constructor() {
    this.RecID = 0;                              // 遊戲局號
    this.WinCoin = 0;
    this.mainSlotPrize = new WayRoundPrize();
    this.freeSlotPrize = [];
  }
};

// 當局中獎資料
class WayRoundPrize {
  constructor() {
    this.win = 0;                   // 當局總贏分數	
    this.winBase = 0;               // 未算人物加成的分數
    this.mul = 0;                   // 人物倍率
    this.addFreeTimes = 0;          // 增加的免費遊戲次數
    this.role = [];                 // 左邊人物與倍率
    this.WayPrizeList = [];         // 主遊戲牌面的獎項
  }
};

// 左邊人物與倍率
class RoleData {
  constructor() {
    this.sym = 0;                     // 人物
    this.mul = 0;                     // 倍率(E_ROLE)
  }
};

// 每個牌面的中獎資料
class WayPrize {
  constructor() {
    this.win = 0;               // 目前牌面贏分
    this.mask = 0;              // 中獎MASK			
    this.pai = [];              // 目前牌型資料	
    this.symPrize = [];            // 中獎物件資料
  }
};

//線中獎的資料
class LinePrize {
  constructor() {
    this.sym = 0;       // 中獎SYMBOL
    this.num = 0;       // 中獎SYMBOL數量
    this.mul = 0;       // 中獎倍率  
    this.times = 0;     // 連線次數        
    this.mask = 0;      // 中獎位置MASK
  }
};