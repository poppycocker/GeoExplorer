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
	this.Gx.lastStateKey = 'lastState_GeoExplorer';
	this.Gx.bookmarkKey = 'bookmarks_GeoExplorer';
}).call(this);