import { cmd_HeartBeat } from "./cmd_1_0_4_HeartBeat.js";
import { GameParamConfig } from "./GameParamConfig.js";
export { cmd_UserLogin };

var cmd_UserLogin = {
    send: function (rq, otc, ln, callback, i) {
        if (ln == null || rq == null || otc == null) {
            let ErrMsgs = {
                Error: "Error : Wrong Data Format",
            };
            callback(ErrMsgs, i);
        }
        if (arguments.length == 4) i = null;

        let UserLoginUrl = GameParamConfig.C_ServerIP + "api/user/login";

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var url_Login = new URLSearchParams();
        url_Login.append("r", rq);
        url_Login.append("o", otc);
        url_Login.append("l", ln);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: url_Login,
            redirect: 'follow'
        };

        fetch(UserLoginUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error, status = " + response.status);
                }
                return response.json();
            })
            .then(json => {
                if (json.Error != null) {
                    let ErrMsgs = {
                        Error: "User Login Error",
                        Reason: json.Error.reason,
                    };
                    console.log("Error: " + json.Error.reason);
                    callback(ErrMsgs, i);
                }
                else {
                    cmd_HeartBeat.nextTime(json.user.tk);
                    let LoginInfo = {
                        Name: "User Login",
                        LobbyName: json.user.lobby_name,
                        LobbyUrl: json.user.lobby_url,
                        RoleName: json.user.name,
                        NickName: json.user.nickname,
                        PT: json.user.pt,
                        RC: json.user.rc,
                        tk: json.user.tk,
                        aestk: json.user.aestk,
                        Old_NewsTickers: json.user.OldNewsTickers,
                    }

                    let tk = json.user.tk;
                    let url = GameParamConfig.C_ServerIP;
                    /**
                    * sendBeacon to server when user leaves the page
                    */
                    if (!('sendBeacon' in navigator))
                        navigator.sendBeacon = (url, data) => window.fetch(url, { method: 'POST', body: data, credentials: 'include' });

                    if (tk !== '') {
                        window.addEventListener('pagehide', () => {
                            navigator.sendBeacon(url + 'api/user/leave?tk=' + tk, '');
                        }, false);
                    }

                    callback(LoginInfo, i);
                }
            }).catch(error => {
                let ErrMsgs = {
                    Error: "Fetch to UserLogin Error",
                    ErrMsg: error.message,
                    Url: UserLoginUrl,
                    R: rq,
                    O: otc,
                    L: ln,
                };
                console.log(ErrMsgs.Error + " : " + ErrMsgs.ErrMsg);
                callback(ErrMsgs, i);
            });
    }
};