;(function() {
	this.Gx.MapViewLeaflet = this.Gx.MapView.extend({
		initialize: function(options) {
			this.type = 'l';
			var init = options.lastState;
			var latLng = L.latLng(init.lat, init.lng);
			this.map = L.map(this.$el.attr('id')).setView(latLng, init.zoom);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				maxZoom: 18
			}).addTo(this.map);
			L.control.scale().addTo(this.map);
			this.posMarker = null;
		},
		clearMarker: function() {
			if (this.posMarker) {
				this.map.removeLayer(this.posMarker);
			}
		},
		createMarker: function(lat, lng) {
			this.clearMarker();
			this.posMarker = L.marker(lat, lng);
			this.posMarker.addTo(this.map);
			this.posMarker.on('click', _.bind(function(me) {
				this.setCenter(me.latlng);
			}, this));
		},
		getCenter: function() {
			var c = this.map.getCenter();
			return {
				lat: c.lat,
				lng: c.lng
			};
		},
		setCenter: function(lat, lng) {
			this.map.panTo(L.latLng(lat, lng));
		},
		saveState: function() {
			var center = this.map.getCenter();
			Gx.Utils.localStorageWrapper.data(Gx.lastStateKey, {
				lat: center.lat,
				lng: center.lng,
				zoom: this.map.getZoom()
			});
		}
	});
}).call(this);