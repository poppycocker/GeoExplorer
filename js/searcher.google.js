;(function() {
	this.Gx = this.Gx || {};
	this.Gx.SearcherGoogle = Gx.Searcher.extend({
		initialize: function(app) {
			this.type = Gx.searcherTypes.google.key;
			this.app = app;
			this.geocoder = new google.maps.Geocoder();
		},
		geocode: function(key, callback) {
			var q = {};
			var isLatLng = key instanceof Gx.LatLng;
			if (isLatLng) {
				q.latLng = key.getGoogle();
			} else {
				q.address = key;
			}
			this.geocoder.geocode(q, function(results, status) {
				if (status !== google.maps.GeocoderStatus.OK) {
					results = [];
					if (q.latLng) {
						results.push({
							geometry: {
								location: q.latLng
							}
						});
					}
				}
				callback(results, key, isLatLng);
			});
		},
		geocodeCallback: function(results, key, isLatLng) {
			var latLng;
			if (results[0] && results[0].geometry) {
				latLng = Gx.latLng(results[0].geometry.location);
			}
			if (!isLatLng && latLng) {
				this.app.render({
					centerPos: latLng,
					markerPos: latLng
				});
			}
			this.app.render({
				geocodeResults: this.generateModels(results),
				bookmarkTitle: key
			});
		},
		generateModels: function(results) {
			return _.map(results, function(result) {
				return new Gx.AddressModelGoogle({
					latLng: this.getLatLngFromResult(result),
					address: result.formatted_address,
					types: result.types.join(', '),
					addressCompos: result.address_components.map(function(compo) {
						return {
							types: compo.types.join(', '),
							longName: compo.long_name
						};
					})
				});
			}, this);
		},
		getLatLngFromResult: function(result) {
			if (!result.geometry) {
				return null;
			}
			return Gx.latLng(result.geometry.location);
		}
	});

}).call(this);