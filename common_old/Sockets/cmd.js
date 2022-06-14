import { SocketMsg } from "./SocketMsg.js";
import { cmd_LineInfo } from "./cmd_1_0_1_LineInfo.js";
import { cmd_SetKey } from "./cmd_1_0_3_SetKey.js";
import { cmd_ServerTime } from "./cmd_1_0_4_ServerTime.js";
import { cmd_PTInfo } from "./cmd_1_0_5_PTInfo.js";
import { cmd_BreakHint } from "./cmd_1_0_9_BreakHint.js";
import { cmd_Login } from "./cmd_1_1_0_Login.js";
import { cmd_Bet } from "./cmd_14_1_1_Bet.js";
import { cmd_NewsTicker } from "./cmd_2_1_1_NewsTicker.js";
import { cmd_OldNewsTickers } from "./cmd_2_1_2_OldNewsTickers.js";
import { cmd_KillNewsTicker } from "./cmd_2_1_3_KillNewsTicker.js";
export { cmd };

var cmd = {
  process: function (message) {
    var ids = SocketMsg.getIDs(message);
    if (ids == null) return;
    switch (ids[0]) {
      case 1:
        switch (ids[1]) {
          case 0:
            switch (ids[2]) {
              case 1: return cmd_LineInfo.process(message);
              case 3: return cmd_SetKey.process(message);
              case 4: return cmd_ServerTime.process(message);
              case 5: return cmd_PTInfo.process(message);
              case 9: return cmd_BreakHint.process(message);
            }
            break;
          case 1:
            switch (ids[2]) {
              case 0: return cmd_Login.process(message);
            }
            break;
        }
        break;

      case 2:
        switch (ids[1]) {
          case 1:
            switch (ids[2]) {
              case 1: return cmd_NewsTicker.process(message);
              case 2: return cmd_OldNewsTickers.process(message);
              case 3: return cmd_KillNewsTicker.process(message);
            }
            break;
        }
        break;

      case 14:
        switch (ids[1]) {
          case 1:
            switch (ids[2]) {
              case 1: return cmd_Bet.process(message);
            }
            break;
        }
        break;
    }
    console.log("未知封包: (" + ids[0] + "." + ids[1] + "." + ids[2] + ")");
    return null;
  },

};