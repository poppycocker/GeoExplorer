;(function() {
	this.Gx = this.Gx || {};
	this.Gx.LatLng = (function() {
		var c = function(lat, lng) {
			if (lat instanceof google.maps.LatLng || lat instanceof L.LatLng) {
				this.set(lat);
			} else {
				this.lat = lat;
				this.lng = lng;
			}
		};
		c.prototype = {
			set: function(ll) {
				this.lat = (typeof ll.lat === 'function') ? ll.lat() : ll.lat;
				this.lng = (typeof ll.lng === 'function') ? ll.lng() : ll.lng;
			},
			getGoogle: function() {
				return new google.maps.LatLng(this.lat, this.lng);
			},
			getLeaflet: function() {
				return L.latLng(this.lat, this.lng);
			},
			getString: function() {
				return [this.lat, this.lng].join(', ');
			}
		};
		return c;
	})();
	// alias
	this.Gx.latLng = function(lat, lng) {
		return new Gx.LatLng(lat, lng);
	};
}).call(this);

;(function() {
	this.prototype.get2MeshCode = function() {
		var lat_m1 = Math.floor(this.lat / 2 * 3 + 90 / 2 * 3);
		var lng_m1 = Math.floor(this.lng + 180);
		var lat_m2 = lat_m1 * 10 + Math.floor(((this.lat / 2 * 3 + 90 / 2 * 3) - lat_m1) * 8);
		var lng_m2 = lng_m1 * 10 + Math.floor(((this.lng + 180) - lng_m1) * 8);

		var strlat_m1 = lat_m1.toString();
		var strlng_m1 = lng_m1.toString();
		var tmpl, i;
		tmpl = strlat_m1.length;
		for (i = 0; i < 3 - tmpl; i++) {
			strlat_m1 = '0' + strlat_m1;
		}
		tmpl = strlng_m1.length;
		for (i = 0; i < 3 - tmpl; i++) {
			strlng_m1 = '0' + strlng_m1;
		}
		var m2str = strlat_m1 + strlng_m1 + lat_m2 % 10 + '' + lng_m2 % 10;
		return m2str;
	};

	var myfloor = function(val, n) {
		var s = Math.pow(10, n);
		return Math.floor(val * s) / s;
	};

	var getDMS = function(d) {
		var tmp = d;
		var nD = Math.floor(d);
		tmp = (tmp - nD) * 60;
		var nM = Math.floor(tmp);
		tmp = (tmp - nM) * 60;
		var nS = tmp;

		return [nD, nM, myfloor(nS, 3)];
	};

	var limitLngRange = function(v) {
		var d = (v > 0) ? -1 : 1;
		while (Math.abs(v) > 180) {
			v += 360 * d;
		}
		return v;
	};

	this.prototype.getLatLonStr = function() {
		var lat = this.lat;
		var lng = limitLngRange(this.lng);

		var nsstr = (lat < 0) ? 'S' : 'N';
		lat = Math.abs(lat);
		var ewstr = (lng < 0) ? 'W' : 'E';
		lng = Math.abs(lng);

		var lat_array = getDMS(lat);
		var lng_array = getDMS(lng);

		var latstr = nsstr + ' ' + lat_array[0] + ' ' + lat_array[1] + ' ' + lat_array[2];
		var lngstr = ewstr + ' ' + lng_array[0] + ' ' + lng_array[1] + ' ' + lng_array[2];

		var tmp_array = lat_array[2].toString().split('.');
		var latstrK = nsstr + ' ' + lat_array[0] + ' ' + lat_array[1];
		for (i = 0; i < tmp_array.length; i++) {
			latstrK += ' ' + tmp_array[i];
		}

		tmp_array = lng_array[2].toString().split('.');
		var lngstrK = ewstr + ' ' + lng_array[0] + ' ' + lng_array[1];
		for (var i = 0; i < tmp_array.length; i++) {
			lngstrK += ' ' + tmp_array[i];
		}
		var m2str = latstrK + ' ' + lngstrK;
		return m2str;
	};

	var get256s = function(deg) {
		return Math.round(deg * 3600 * 256);
	};

	this.prototype.getLat256s = function() {
		return get256s(this.lat);
	};

	this.prototype.getLng256s = function() {
		return get256s(this.lng);
	};

}).call(Gx.LatLng);