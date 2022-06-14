
export { GeneralMethods };

var GeneralMethods = {

  dateToShow: function (dt) {
    return "" +
      (100 + dt.getHours()).toString().substring(1) + ":" +
      (100 + dt.getMinutes()).toString().substring(1) + ":" +
      (100 + dt.getSeconds()).toString().substring(1) + "." +
      (1000 + dt.getMilliseconds()).toString().substring(1);
  },

  queryString: function (name) {
    name = name.toUpperCase();
    var AllVars = window.location.search.substring(1);
    var Vars = AllVars.split("&");
    for (var i = 0; i < Vars.length; i++) {
      var Var = Vars[i].split("=");
      if (Var[0].toUpperCase() == name) return Var[1];
    }
    return "";
  },

  // 型態 = 0 -- > 需按[確定]鈕.按[確定]鈕 則關閉訊息窗, 並呼叫網頁的 "Callback"
  //               例如: javaCall.ShowMessage("這是訊息,按鍵繼續", 0, "doNextJob()")
  // 型態 = 1 -- > 顯示訊息, 一個短時間後自動消失
  // 型態 = 2 -- > 顯示訊息, 一個長時間後自動消失
  ShowMessage: function (msg, showType, callBack) {
    try {
      javaCall.ShowMessage(msg, showType, callBack);
    } catch (e) { }
  },

  //var xhr = new XMLHttpRequest();
  //xhr.onreadystatechange = function () {
  //    if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
  //        var response = xhr.responseText;
  //        console.log(response);
  //    }
  //};
  //xhr.open("GET", url, true);
  //xhr.send();

  MakeAssetArray: function (firstIndex, lastIndex, Name_Head, AssetName_Head, AssetName_Tail) {
    let res = [];
    for (let i = firstIndex; i <= lastIndex; i++)
      res.push([Name_Head + i, AssetName_Head + i + AssetName_Tail]);
    return res;
  },

};