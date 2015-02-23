;(function() {
	this.Gx = this.Gx || {};
	this.Gx.mapTypes = {
		google: {
			key: 'g',
			name: 'GoogleMap'
		},
		osm: {
			key: 'o',
			name: 'OpenStreetMap'
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