export { E_SocketState, E_RoleType, E_LoginState, E_BreakHint, E_NewsTickerType };

const E_SocketState = {
  Init: 0,
  Connecting: 1,
  Connected: 2,
  Disconnected: 3,
  NoParam: 99,
};

const E_RoleType = {
  Unknow: 0,
  正式會員: 1,
  快速會員: 2,
  機器人: 3,
  NPC: 99,
};

const E_LoginState = {
  尚未登錄: 0,
  登入成功: 1,
  發生錯誤: 2,
  不存在或逾期: 3,
  系統異常: 4,
  參數異常: 5,
  訪客數已滿: 6,
  非營運狀態: 7,
};

const E_BreakHint = {
  未知: 0,
  逾時斷線: 3,
  重覆斷線: 4,
  錯誤斷線: 5,
  系統異常斷線: 6,
  系統維修: 7,
  登出: 9,
  安全通道失敗: 91,
};

const E_NewsTickerType = {
  None: 0,       // 未知
  小獎公告: 1,
  大獎公告: 2,
  系統公告: 10,
  維護訊息: 20,  // 同類型的只留一筆
  其他: 99,
};