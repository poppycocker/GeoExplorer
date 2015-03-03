;(function() {
	this.Gx = this.Gx || {};
	this.Gx.MapView = Backbone.View.extend({
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
		}
	});
}).call(this);