var WatchMe = {
  SessionCode: "",
  GameID: "",
  LineID: "",
  ClientInfo: {},
  URL_GameLog: "",

  init: function () {
    console.log("WatchMe: init");

    let now = new Date();
    this.SessionCode =
      String((1900 + now.getYear()) * 10000 + (1 + now.getMonth()) * 100 + now.getDate())
      + String((100 + now.getHours()) * 10000000 + now.getMinutes() * 100000 + now.getSeconds() * 1000 + now.getMilliseconds())
      + String(Math.ceil(Math.random() * 1000000 + 1000000));

    let serverInfo = this.isDemoServer();
    this.URL_GameLog = serverInfo.isDemo
      ? "https://zips.demogame.tfm.1465.tw/api/gamelog.ashx"
      : "https://zips.game.tfm.1465.tw/api/gamelog.ashx";
    this.GameID = serverInfo.GameID;

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/event
    window.onerror = this.onWindowError;
    //window.onpageshow = this.onPageShow;
    //window.onpagehide = this.onPageHide;
    //window.addEventListener('pageshow', this.onPageShow);
    //window.addEventListener('pagehide', this.onPageHide);

    this.SendLive();
  },

  SendLive: function () {
    this.SendToServer('WatchMe.Live', this.ClientInfo);
    setTimeout(function () { WatchMe.SendLive(); }, 60000);
  },

  SendMessage: function (Source, msg) {
    this.SendToServer(Source, msg);
  },

  onWindowError: function (message, filename, lineNo, columnNo, errorObj) {
    WatchMe.SendToServer("onWindowError", { 'message': message, 'filename': filename, 'lineNo': lineNo, 'columnNo': columnNo, 'errorObj': errorObj });
  },
  onPageShow: function (event) {
    console.log("onPageShow:");
    console.log(event);
  },
  onPageHide: function (event) {
    console.log("onPageHide:");
    console.log(event);
  },

  SendToServer: function (source, message) {
    try {
      let now = new Date();
      let nowTime = (1900 + now.getYear()) + "/" + (1 + now.getMonth()) + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds();
      let msg = JSON.stringify(
        {
          SessionCode: this.SessionCode,
          GameID: this.GameID,
          LineID: this.LineID,
          Source: source,
          Time: nowTime,
          msg: message,
        });
      //console.log(msg);

      let promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", WatchMe.URL_GameLog, true);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(msg);
      });
      //promise.then((successMessage) => {});
    } catch (e) { console.log("WatchMe.SendToServer error: " + e.message); }
  },

  isDemoServer: function () {
    let res = { isDemo: true, GameID: '' };
    let host = location.host;
    let hostLen = host.length;
    let pathName = location.pathname;
    let pathNameLen = pathName.length;
    //console.log(host);
    //console.log("[" + location.origin + "]\n[" + location.pathname + "]");

    if ((hostLen > 17) && (host.substr(hostLen - 17, 17) == ".game.tfm.1465.tw")) {
      res.isDemo = false;
      res.GameID = host.substr(0, hostLen - 17);
      return res;
    }
    if ((hostLen > 21) && (host.substr(hostLen - 21, 21) == ".demogame.tfm.1465.tw")) {
      res.isDemo = true;
      res.GameID = host.substr(0, hostLen - 21);
      return res;
    }

    // https://appassets.androidplatform.net/Download/g011.game.tfm.1465.tw/index.html
    if (host == "appassets.androidplatform.net") {
      if (pathNameLen < 11) return res;
      if (pathName.substr(0, 10) != "/Download/") return res;
      let p1 = pathName.indexOf(".game.tfm.1465.tw/");
      if (p1 > 0) {
        res.isDemo = false;
        res.GameID = pathName.substr(10, p1);
        return res;
      }
      p1 = pathName.indexOf(".demogame.tfm.1465.tw/");
      if (p1 > 0) {
        res.isDemo = true;
        res.GameID = pathName.substr(10, p1);
        return res;
      }
    }

    return res;
  },
};

WatchMe.init();