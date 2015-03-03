;(function() {
	this.Gx = this.Gx || {};
	this.Gx.SwitchUnitModel = Backbone.Model.extend({
		defaults: function() {
			return {
				key: '',
				name: ''
			};
		}
	});
	this.Gx.SwitchUnitCollection = Backbone.Collection.extend({});
}).call(this);