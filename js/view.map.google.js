;(function() {
	this.Gx.MapViewGoogle = this.Gx.MapView.extend({
		initialize: function(options) {
			this.type = 'g';
			var init = options.lastState;
			var latlng = new google.maps.LatLng(init.lat, init.lng);
			var mapOpts = {
				zoom: init.zoom,
				center: latlng,
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.DEFAULT
				},
				zoomControl: true,
				scaleControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			this.map = new google.maps.Map(this.$el.get(0), mapOpts);
			this.posMarker = null;
		},
		clearMarker: function() {
			if (this.posMarker) {
				this.posMarker.setMap(null);
			}
		},
		createMarker: function(lat, lng) {
			this.clearMarker();
			this.posMarker = new google.maps.Marker({
				map: this.map,
				position: new google.maps.LatLng(lat, lng)
			});
			this.posMarker.addListener('click', _.bind(function(me) {
				this.setCenter(me.latLng.lat(), me.latLng.lng());
			}, this));
		},
		getCenter: function() {
			var c = this.map.getCenter();
			return {
				lat: c.lat(),
				lng: c.lng()
			};
		},
		setCenter: function(lat, lng) {
			this.map.setCenter(new google.maps.LatLng(lat, lng));
		},
		saveState: function() {
			var center = this.map.getCenter();
			Gx.Utils.localStorageWrapper.data(Gx.lastStateKey, {
				lat: center.lat(),
				lng: center.lng(),
				zoom: this.map.getZoom()
			});
		}
	});
}).call(this);