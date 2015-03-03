;(function() {
	this.Gx = this.Gx || {};
	this.Gx.AddressModelNominatim = Gx.AddressModel.extend({
		defaults: function() {
			return {
				latLng: null,
				osm_type: '',
				osm_id: '',
				place_id: '',
				type: '',
				cls: '',
				icon: '',
				display_name: '',
				address: []
			};
		}
	});
}).call(this);