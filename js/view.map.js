;
(function() {
	this.Gx = this.Gx || {};
	this.Gx.MapView = Backbone.View.extend({
		el: '#map_canvas',
		initialize: function() {
			// Generate the Map, get last state from localStorage
			var lastState = window.localStorageWrapper.data(Gx.lastStateKey) || {};
			var latlng = new google.maps.LatLng(lastState.lat || 35.5291699, lastState.lng || 139.6958934);
			var options = {
				zoom: lastState.zoom || 9,
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

			this.map = new google.maps.Map(document.getElementById('map_canvas'), options);
			this.posMarker = null;
		},
		clearMarker: function() {
			if (this.posMarker) {
				this.posMarker.setMap(null);
			}
		},
		createMarker: function(latLng) {
			this.clearMarker();
			this.posMarker = new google.maps.Marker({
				map: this.map,
				position: latLng
			});
			this.posMarker.addListener('click', _.bind(function(me) {
				this.setCenter(me.latLng);
			}, this));
		},
		setCenter: function(latLng) {
			this.map.setCenter(latLng);
		},
		saveState: function() {
			var center = this.map.getCenter();
			window.localStorageWrapper.data(Gx.lastStateKey, {
				lat: center.lat(),
				lng: center.lng(),
				zoom: this.map.getZoom()
			});
		}
	});
}).call(this);