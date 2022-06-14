import { GameParamConfig } from "./GameParamConfig.js";
export { cmd_Bet };

var cmd_Bet = {
    send: function (tk, bc, callback, i) {
        if (tk == null || bc == null) {
            let ErrMsgs = {
                Error: "Error : Wrong Data Format",
            };
            callback(ErrMsgs, i);
        }
        if (arguments.length == 3) i = null;

        let BetURL = GameParamConfig.C_ServerIP + "api/bet";

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var bet_info = new URLSearchParams();
        bet_info.append("tk", tk.toString());
        bet_info.append("bc", bc.toString());

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: bet_info,
            redirect: 'follow'
        };

        fetch(BetURL, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error, status = " + response.status);
                }
                return response.json();
            })
            .then(json => {
                if (json.bet == null) {
                    let ErrMsgs = {
                        Error: "Bet Error",
                        Reason: json.Error.reason,
                    };
                    console.log("Bet Error: " + json.Error.reason);
                    callback(ErrMsgs, i);
                }
                else {
                    let BetResult = {
                        Name: "BetResult",
                        RecID: json.bet.RecID,
                        RoleID: json.bet.roleid,
                        PT: json.bet.newPT,
                        RC: json.bet.newRC,
                        BetCoin: json.bet.betcoin,
                        SubGame: json.bet.SubGame,
                        WinCoin: json.bet.WinCoin,
                        Result: JSON.parse(json.bet.Original_Result),
                        NewsTicker: json.bet.NewsTicker,
                        RemoveNT: json.bet.RemoveNT,
                    }
                    callback(BetResult, i);
                }
            }).catch(error => {
                let ErrMsgs = {
                    Error: "Fetch to Bet Error",
                    ErrMsg: error.message,
                };
                console.log(ErrMsgs.Error + " : " + ErrMsgs.ErrMsg);
                callback(ErrMsgs, i);
            });
    }
};
