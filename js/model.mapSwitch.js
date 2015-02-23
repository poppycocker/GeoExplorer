;(function() {
	this.Gx = this.Gx || {};
	this.Gx.MapSwitchUnitModel = Backbone.Model.extend({
		defaults: function() {
			return {
				key: '',
				mapName: ''
			};
		}
	});
	this.Gx.MapSwitchUnitCollection = Backbone.Collection.extend({});
}).call(this);