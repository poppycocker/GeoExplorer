;(function() {
	this.Gx = this.Gx || {};
	this.Gx.SearcherNominatim = Gx.Searcher.extend({
		options: {
			urlSearch: 'https://nominatim.openstreetmap.org/',
			urlReverse: 'https://nominatim.openstreetmap.org/reverse',
			type: 'GET',
			dataType: 'json'
		},
		initialize: function(app) {
			this.type = Gx.searcherTypes.nominatim.key;
			this.app = app;
		},
		geocode: function(key, callback) {
			var isLatLng = key instanceof Gx.LatLng, param;
			if (isLatLng) {
				param = this.getParamForReverseLatLng(key);
			} else if (key.match(/^\d+,[A-z]$/g)) {
				param = this.getParamForReverseOsmId(key);
			} else {
				param = this.getParamForSearch(key);
			}
			$.ajax(_.extend(param, {
				success: function(data, status) {
					callback(_.flatten([data]), key, isLatLng);
				},
				error: function() {}
			}));
		},
		getParamForSearch: function(key) {
			return {
				url: this.options.urlSearch,
				type: this.options.type,
				dataType: this.options.dataType,
				data: {
					format: this.options.dataType,
					addressdetails: 1,
					q: key
				}
			};
		},
		getParamForReverseLatLng: function(latLng) {
			return {
				url: this.options.urlReverse,
				type: this.options.type,
				dataType: this.options.dataType,
				data: {
					format: this.options.dataType,
					addressdetails: 1,
					lat: latLng.lat,
					lon: latLng.lng,
				}
			};
		},
		getParamForReverseOsmId: function(key) {
			var sp = key.split(',').map(function(v) {
				return '' + v;
			});
			return {
				url: this.options.urlReverse,
				type: this.options.type,
				dataType: this.options.dataType,
				data: {
					format: this.options.dataType,
					addressdetails: 1,
					osm_id: sp[0],
					osm_type: sp[1].toUpperCase()
				}
			};
		},
		geocodeCallback: function(results, key, isLatLng) {
			if (!results.length) {
				this.app.showNoResult();
				return;
			}
			var result = results[0];
			var latLng;
			if (result.error) {
				this.app.showMessage(result.error);
				return;
			}
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
			if (results[0] && results[0].error) {
				this.app.showMessage(results[0].error);
				return [];
			}
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
