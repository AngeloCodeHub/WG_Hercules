import { GameParamConfig } from "./GameParamConfig.js";
export { cmd_HeartBeat };

var cmd_HeartBeat = {
    send: function (tk) {
        if (tk == null) return "Error，缺少參數";

        let HBUrl = GameParamConfig.C_ServerIP + "api/user/heartbeat?tk=" + tk.toString();

        fetch(HBUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error, status = " + response.status);
                }
                return response.json();
            })
            .then(json => {
                if (json.Error != null) {
                    console.log("HeartBeat Error: " + json.Error.reason);
                    return {
                        Error: "HeartBeat Error",
                        Reason: json.Error.reason,
                    };
                }
                else {
                    console.log("HeartBeat: Ok")
                    cmd_HeartBeat.nextTime(tk);
                    return null;
                }
            }).catch(error => {
                console.log('Fetch to HeartBeat Error: ' + error.message);
                return {
                    Error: "Fetch to HeartBeat Error",
                    ErrMsg: error.message,
                };
            });
    },

    nextTime: function (tk) {
        console.log("HeartBeat will send after 120s");
        setTimeout(function () { cmd_HeartBeat.send(tk); }, GameParamConfig.C_AliveTime);
    }

};
