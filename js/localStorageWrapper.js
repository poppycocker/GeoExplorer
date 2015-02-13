;(function() {
	this.localStorageWrapper = {
		data: function(key, val) {
			var ls = window.localStorage, item;
			if (!ls || !key) {
				return null;
			}
			if (val) {
				ls.setItem(key, JSON.stringify(val));
			} else {
				item = ls.getItem(key);
				return item ? JSON.parse(item) : null;
			}
		},
		remove: function(key) {
			window.localStorage.removeItem(key);
		}
	};
}).call(this);