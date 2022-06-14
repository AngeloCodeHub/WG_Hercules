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

};