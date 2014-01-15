(function() {

	this.prototype.get2MeshCode = function() {
		var lat_m1 = Math.floor(this.lat() / 2 * 3 + 90 / 2 * 3);
		var lng_m1 = Math.floor(this.lng() + 180);
		var lat_m2 = lat_m1 * 10 + Math.floor(((this.lat() / 2 * 3 + 90 / 2 * 3) - lat_m1) * 8);
		var lng_m2 = lng_m1 * 10 + Math.floor(((this.lng() + 180) - lng_m1) * 8);

		var strlat_m1 = lat_m1.toString();
		var strlng_m1 = lng_m1.toString();
		var tmpl;
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

	this.prototype.distanceFrom = function(newLatLng) {
		var radianLat1 = this.lat() * (Math.PI / 180);
		var radianLng1 = this.lng() * (Math.PI / 180);
		var radianLat2 = newLatLng.lat() * (Math.PI / 180);
		var radianLng2 = newLatLng.lng() * (Math.PI / 180);
		var earth_radius = 6378.1;
		var sinLat = Math.sin((radianLat1 - radianLat2) / 2);
		var sinLng = Math.sin((radianLng1 - radianLng2) / 2);
		var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
		return earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
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
		var lat = this.lat();
		var lng = limitLngRange(this.lng());

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
		for (i = 0; i < tmp_array.length; i++) {
			lngstrK += ' ' + tmp_array[i];
		}
		var m2str = latstrK + ' ' + lngstrK;
		return m2str;
	};

}).call(google.maps.LatLng);