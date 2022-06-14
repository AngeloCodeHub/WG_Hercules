import { GameParamConfig } from "./GameParamConfig.js";
export { cmd_ServerTime };

var cmd_ServerTime = {
    send: function (tk, callback, i) {
        if (tk == null) {
            let ErrMsgs = {
                Error: "Error : Wrong Data Format",
            };
            callback(ErrMsgs, i);
        }

        let rtt = -1;
        let alpha = 0.7;

        let t1 = window.performance.now();
        let t2 = t1;

        if (arguments.length == 2) i = null;

        let serverTimeURL = GameParamConfig.C_ServerIP + "api/time"

        fetch(serverTimeURL)
            .then(response => {
                t2 = window.performance.now();
                // if (t2 > t1)
                //    console.log('Round-trip delay: ' + (t2 - t1) + ' ms');
                if (!response.ok) {
                    throw new Error("HTTP error, status = " + response.status);
                }
                return response.json();
            })
            .then(json => {
                if (t2 > t1) {
                    let new_rtt = t2 - t1;  // in ms
                    rtt = (rtt <= 0) ? new_rtt : alpha * rtt + (1 - alpha) * new_rtt;
                    //  console.log('RTT: ' + rtt);
                    let serverTime = parseInt(json.sec) + parseFloat(json.usec) + rtt / 2000;
                    let clientTime = Date.now() / 1000;
                    //  console.log("Client is faster than Server {" + (clientTime - serverTime) + "} sec");
                    let TimeInfo = {
                        Name: "Get ServerTime",
                        ServerTime: serverTime,
                        ClientTime: clientTime,
                    };
                    callback(TimeInfo, i);
                }
            })
            .catch(error => {
                let ErrMsgs = {
                    Error: "Fetch to GetServerTime Error",
                    ErrMsg: error.message,
                };
                console.log(ErrMsgs.Error + " : " + ErrMsgs.ErrMsg);
                callback(ErrMsgs, i);
            });
    }
};