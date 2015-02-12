;
(function() {
	this.Gx = this.Gx || {};
	this.Gx.PositionModel = Backbone.Model.extend({
		defaults: function() {
			return {
				meshcode: '',
				latLngStr: '',
				lat: 0,
				lng: 0,
				lat256s: 0,
				lng256s: 0,
				zoom: 18
			};
		}
	});
}).call(this);