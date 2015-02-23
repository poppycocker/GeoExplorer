;(function() {
	this.Gx = this.Gx || {};
	this.Gx.PositionModel = Backbone.Model.extend({
		defaults: function() {
			return {
				meshcode: '',
				latLngStr: '',
				lat: 0,
				lng: 0,
				lat256s: 0,
				lng256s: 0,
				zoom: 18,
				mapType: Gx.mapTypes.google.key
			};
		},
		setAttrs: function(latLng, zoom, mapType) {
			// latLng: Gx.LatLng
			var r = Gx.Utils.round;
			var attrs = {};
			if (latLng) {
				attrs.meshcode = latLng.get2MeshCode();
				attrs.latLngStr = latLng.getLatLonStr();
				attrs.lat = r(latLng.lat, 7);
				attrs.lng = r(latLng.lng, 7);
				attrs.lat256s = latLng.getLat256s();
				attrs.lng256s = latLng.getLng256s();
			}
			if (zoom) {
				attrs.zoom = zoom;
			}
			if (mapType) {
				attrs.mapType = mapType;
			}
			this.set(attrs);
		},
		isGoogle: function() {
			return this.attributes.mapType === Gx.mapTypes.google.key;
		},
		isOsm: function() {
			return this.attributes.mapType === Gx.mapTypes.osm.key;
		}
	});
}).call(this);