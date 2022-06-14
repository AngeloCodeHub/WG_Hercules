import { GameParamConfig } from "./GameParamConfig.js";
export { cmd_UserLeave };

var cmd_UserLeave = {
    send: function (tk, callback, i) {
        if (tk == null) {
            let ErrMsgs = {
                Error: "Error : Wrong Data Format",
            };
            callback(ErrMsgs, i);
        }
        if (arguments.length == 2) i = null;

        let UserLeaveURL = GameParamConfig.C_ServerIP + "api/user/leave?tk=" + tk.toString();

        fetch(UserLeaveURL).then(response => {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.json();
        })
            .then(json => {
                if (json.Error != null) {
                    let ErrMsgs = {
                        Error: "User Leave Error",
                        Reason: json.Error.reason,
                    };
                    console.log("User Leave Error: " + json.Error.reason);
                    callback(ErrMsgs, i);
                }
                else {
                    let Leave = {
                        Name: "UserLeave",
                        UserLeave_State: json.OK.code,
                    }
                    callback(Leave, i);
                }
            }).catch(error => {
                let ErrMsgs = {
                    Error: "Fetch to UserLeave Error",
                    ErrMsg: error.message,
                };
                console.log(ErrMsgs.Error + " : " + ErrMsgs.ErrMsg);
                callback(ErrMsgs, i);
            });
    }
};
