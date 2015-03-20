;(function() {
	this.Gx = this.Gx || {};
	this.Gx.mapTypes = {
		google: {
			key: 'ggm',
			name: 'GoogleMap'
		},
		osm: {
			key: 'osm',
			name: 'OpenStreetMap'
		},
		gsi_std: {
			key: 'gss',
			name: 'GSI std.'
		}
	};
	this.Gx.searcherTypes = {
		google: {
			key: 'ggc',
			name: 'Google Geocoding API'
		},
		nominatim: {
			key: 'nmn',
			name: 'OSM Nominatim'
		}
	};
	this.Gx.defaultState = {
		// Tokyo
		lat: 35.5291699,
		lng: 139.6958934,
		zoom: 9
	};
	this.Gx.lastStateKey = 'lastState_GeoExplorer';
	this.Gx.bookmarkKey = 'bookmarks_GeoExplorer';
}).call(this);