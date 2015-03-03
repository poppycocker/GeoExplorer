;(function() {
	this.Gx = this.Gx || {};
	this.Gx.SearcherNominatim = Gx.Searcher.extend({
		options: {
			url: 'http://nominatim.openstreetmap.org/',
			type: 'GET',
			dataType: 'json'
		},
		initialize: function(app) {
			this.type = Gx.searcherTypes.nominatim.key;
			this.app = app;
		},
		geocode: function(key, callback) {
			var isLatLng = key instanceof Gx.LatLng;
			if (isLatLng) {
				key = key.getString();
			}
			$.ajax({
				url: this.options.url,
				type: this.options.type,
				dataType: this.options.dataType,
				data: {
					format: this.options.dataType,
					addressdetails: 1,
					// limit: 1,
					q: key
				},
				success: function(data, status) {
					callback(data, key, isLatLng);
				},
				error: function() {

				}
			});
		},
		geocodeCallback: function(results, key, isLatLng) {
			var result = results[0];
			var latLng;
			if (result.lat && result.lon) {
				latLng = Gx.latLng(result.lat, result.lon);
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
				return new Gx.AddressModelNominatim({
					latLng: this.getLatLngFromResult(result),
					osm_type: result.osm_type,
					osm_id: result.osm_id,
					place_id: result.place_id,
					type: result.type,
					cls: result.cls,
					icon: result.icon,
					display_name: result.display_name,
					address: Object.keys(result.address).map(function(p) {
						return {
							type: p,
							val: result.address[p]
						};
					})
				});
			}, this);
		},
		getLatLngFromResult: function(result) {
			if (result.lat && result.lon) {
				return Gx.latLng(result.lat, result.lon);
			}
		}
	});

}).call(this);