;(function() {
	this.Gx = this.Gx || {};
	this.Gx.MapSwitchView = Gx.SwitchView.extend({
		el: '#map-switch',
		getTypes: function() {
			return Gx.mapTypes;
		},
		toggle: function() {
			Gx.app.toggleMap(this.$el.val());
		},
	});
}).call(this);