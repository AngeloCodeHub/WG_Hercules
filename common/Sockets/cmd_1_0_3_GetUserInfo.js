import { GameParamConfig } from "./GameParamConfig.js";
export { cmd_GetUserInfo };

var cmd_GetUserInfo = {
    send: function (tk, callback, i) {
        if (tk == null) {
            let ErrMsgs = {
                Error: "Error : Wrong Data Format",
            };
            callback(ErrMsgs, i);
        }
        if (arguments.length == 2) i = null;

        let GetUserURL = GameParamConfig.C_ServerIP + "api/user?tk=" + tk.toString();

        fetch(GetUserURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error, status = " + response.status);
                }
                return response.json();
            })
            .then(json => {
                if (json.Error != null) {
                    let ErrMsgs = {
                        Error: "Get UserInfo Error",
                        Reason: json.Error.reason,
                    };
                    console.log("Get UserInfo Error: " + json.Error.reason);
                    callback(ErrMsgs, i);
                }
                else {
                    let UserInfo = {
                        Name: "UserInfo",
                        LobbyName: json.user.lobby_name,
                        RoleID: json.user.roleid,
                        RoleName: json.user.name,
                        NickName: json.user.nickname,
                        PT: json.user.pt,
                        RC: json.user.rc,
                        photo: json.user.photo,
                        Aestk: json.user.aestk,
                        NewNT: JSON.parse(json.user.New_NewsTickers),
                        RemoveNT: JSON.parse(json.user.Remove_NewsTickers),
                    }
                    callback(UserInfo, i);
                }
            }).catch(error => {
                let ErrMsgs = {
                    Error: "Fetch to UserInfo Error",
                    ErrMsg: error.message,
                };
                console.log(ErrMsgs.Error + " : " + ErrMsgs.ErrMsg);
                callback(ErrMsgs, i);
            });
    }
};
