;
(function() {
	this.Gx = this.Gx || {};
	this.Gx.AddressModel = Backbone.Model.extend({
		defaults: function() {
			return {
				address: '',
				types: '',
				addressCompos: []
			};
		}
	});
	this.Gx.AddressCollection = Backbone.Collection.extend();
}).call(this);