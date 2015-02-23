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
		getCenter: function() {
			return Gx.latLng(this.map.getCenter());
		},
		getZoom: function() {
			return this.map.getZoom();
		},
		show: function(flg) {
			var state = flg ? 'visible' : 'hidden';
			this.$el.css({
				visibility: state
			});
		},
		isVisible: function() {
			return this.$el.css('visibility') === 'visible';
		},
		updateQyeryString: function() {
			if (!Gx.router || !this.isVisible()) {
				return;
			}
			var c = this.getCenter();
			var queries = [c.lat, c.lng, this.getZoom()].map(function(v) {
				return Gx.Utils.round(+v, 7);
			});
			queries.push(this.type);
			Gx.router.navigate(queries.join(','), false);
		}
	});
}).call(this);