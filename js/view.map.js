;(function() {
	this.Gx = this.Gx || {};
	this.Gx.MapView = Backbone.View.extend({
		saveState: function() {
			var c = this.getCenter();
			Gx.Utils.localStorageWrapper.data(Gx.lastStateKey, {
				lat: c.lat,
				lng: c.lng,
				zoom: this.getZoom(),
				type: this.type
			});
		},
		getZoom: function() {
			return this.map.getZoom();
		},
		setZoom: function(val) {
			this.map.setZoom(val);
		},
		show: function(flg) {
			if (flg) {
				this.$el.show();
			} else {
				this.$el.hide();
			}
		},
		toggle: function() {
			this.$el.toggle();
		}
	});
}).call(this);