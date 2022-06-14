export { SocketMsg, SocketMsgD };

class SocketMsg {
  get id1() { return 0; }
  get id2() { return 0; }
  get id3() { return 0; }

  constructor() {
    this.parseOK = false;
    this.parseErrorMsg = "";
    this.originalData = "";
  }

  get baseData() { return this.id1 + "|" + this.id2 + "|" + this.id3; }

  parseData(value, len = -1) {
    this.originalData = value;
    var items = value.split('|');
    if (len < 0) { if (items.length < 3) { this.parseErrorMsg = "數量過少"; return null; } }
    else if ((3 + len) != items.length) { this.parseErrorMsg = "數量不符"; return null; }
    if (items[0] != this.id1) { this.parseErrorMsg = "代碼不符"; return null; }
    if (items[1] != this.id2) { this.parseErrorMsg = "代碼不符"; return null; }
    if (items[2] != this.id3) { this.parseErrorMsg = "代碼不符"; return null; }
    items.splice(0, 3);
    return items;
  };

  static getIDs(message) {
    var items = message.split('|');
    try { return [parseInt(items[0]), parseInt(items[1]), parseInt(items[2])]; }
    catch (e) { return null; }
  };

  static SafeStringRevert(data) {
    return data.replace("\\n", "\n").replace("\\r", "\r").replace("\\s", "|").replace("\\\\", "\\");
  }
};

class SocketMsgD extends SocketMsg {
  constructor() {
    super();
    this.Success = false;
    this.ErrMsg = "";
  }

  get baseData() { return super.baseData + "|" + (this.Success ? "T" : "F") + "|" + this.ErrMsg; }

  //constructor() { super(); }

  parseData(value, len = -1) {
    var items = super.parseData(value, len < 0 ? -1 : len + 2);
    if (items == null) return null;
    if ((len < 0) && (items.length < 2)) { this.parseErrorMsg = "數量過少"; return null; }
    this.Success = (items[0] == "T") || (items[0] == "1");
    this.ErrMsg = items[1];
    items.splice(0, 2);
    return items;
  }
};
