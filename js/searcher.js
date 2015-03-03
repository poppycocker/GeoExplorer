;(function() {
	this.Gx = this.Gx || {};
	this.Gx.Searcher = L.Class.extend({
		search: function(key) {
			var coord = this.getLatLngFromString(key);
			if (coord.OK) {
				key = Gx.latLng(coord.lat, coord.lng);
				this.app.render({
					centerPos: key,
					markerPos: key
				});
			}
			this.geocode(key, _.bind(this.geocodeCallback, this));
		},
		getLatLngFromString: function(llStr) {
			var translated, tmp1 = llStr.replace('北緯', 'N').replace('南緯', 'S').replace('西経', 'W').replace('東経', 'E').trim(),
				tmp2 = llStr.replace(/\.|,|\'/g, ' ').replace(/"/g, '').replace('N', 'N ').replace('S', 'S ').replace('E', 'E ').replace('W', 'W ');
			var tmp2idx = tmp2.search(/N|S/);
			tmp2 = tmp2.substr(tmp2idx) + '00 ' + tmp2.substr(0, tmp2idx - 1) + '00';
			if (tmp1.match(/(N|S)(\s\d{1,3}){4}\s(E|W)(\s\d{1,3}){3,4}/)) {
				translated = tmp1;
			} else if (tmp2.match(/(N|S)(\s\d{1,3}){4}\s(E|W)(\s\d{1,3}){3,4}/)) {
				translated = tmp2;
			} else {
				return {
					lat: 0,
					lng: 0,
					OK: false
				};
			}

			var ar = translated.split(' ').map(function(v) {
				return parseInt(v, 10);
			});
			var lat = ar[1] + ar[2] / 60 + ar[3] / 3600 + ar[4] / 3600 / 1000;
			var lng = ar[6] + ar[7] / 60 + ar[8] / 3600 + (ar[9] ? ar[9] / 3600 / 1000 : 0);

			return {
				lat: (translated.match(/S/)) ? lat * (-1) : lat,
				lng: (translated.match(/W/)) ? lng * (-1) : lng,
				OK: true
			};
		}
	});

}).call(this);