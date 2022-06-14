import { GameParamConfig } from "./GameParamConfig.js";
export { cmd_ReBet };

var cmd_ReBet = {
    send: function (tk, bc, bs, lastid, callback, i) {
        if (tk == null || bc == null || bs == null || lastid == null) {
            let ErrMsgs = {
                Error: "Error : Wrong Data Format",
            };
            callback(ErrMsgs, i);
        }
        if (arguments.length == 5) i = null;

        let ReBetURL = GameParamConfig.C_ServerIP + "api/rebet";

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var rebet_info = new URLSearchParams();
        rebet_info.append("tk", tk.toString());
        rebet_info.append("bc", bc.toString());
        rebet_info.append("bs", bs.toString());
        rebet_info.append("lastid", lastid.toString());

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: rebet_info,
            redirect: 'follow'
        };

        fetch(ReBetURL, requestOptions).then(response => {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.json();
        })
            .then(json => {
                if (json.bet == null) {
                    let ErrMsgs = {
                        Error: "ReBet Error",
                        Reason: json.Error.reason,
                    };
                    console.log("ReBet Error: " + json.Error.reason);
                    callback(ErrMsgs, i);
                }
                else {
                    let ReBetResult = {
                        Name: "Re_BetResult",
                        RecID: json.bet.RecID,
                        RoleID: json.bet.roleid,
                        PT: json.bet.newPT,
                        RC: json.bet.newRC,
                        BetCoin: json.bet.betcoin,
                        SubGame: json.bet.SubGame,
                        WinCoin: json.bet.WinCoin,
                        Result: JSON.parse(json.bet.Original_Result),
                        NewsTicker: JSON.parse(json.bet.NewsTicker),
                        RemoveNT: JSON.parse(json.bet.RemoveNT),
                    }
                    callback(ReBetResult, i);
                }
            }).catch(error => {
                let ErrMsgs = {
                    Error: "Fetch to ReBet Error",
                    ErrMsg: error.message,
                };
                console.log(ErrMsgs.Error + " : " + ErrMsgs.ErrMsg);
                callback(ErrMsgs, i);
            });
    }
};
