;(function() {
	this.Gx = this.Gx || {};
	this.Gx.AddressModel = Backbone.Model.extend();
	this.Gx.AddressCollection = Backbone.Collection.extend({
		model: Gx.AddressModel
	});
}).call(this);