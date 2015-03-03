;(function() {
	this.Gx = this.Gx || {};
	this.Gx.AddressModelGoogle = Gx.AddressModel.extend({
		defaults: function() {
			return {
				latLng: null,
				address: '',
				types: '',
				addressCompos: []
			};
		}
	});
}).call(this);