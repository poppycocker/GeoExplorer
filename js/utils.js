;(function() {
	this.Gx = this.Gx || {};
	this.Gx.Utils = {};
	this.Gx.Utils.localStorageWrapper = {
		data: function(key, val) {
			var ls = window.localStorage, item;
			if (!ls || !key) {
				return null;
			}
			if (val) {
				// write
				ls.setItem(key, JSON.stringify(val));
			} else {
				// read
				item = ls.getItem(key);
				return item ? JSON.parse(item) : null;
			}
		},
		remove: function(key) {
			window.localStorage.removeItem(key);
		}
	};
	this.Gx.Utils.round = function(val, digit) {
		var d = Math.pow(10, digit || 1);
		return Math.round(val * d) / d;
	};
}).call(this);