;(function() {
	this.Gx.MapViewLeaflet = this.Gx.MapView.extend({
		initialize: function(options) {
			this.type = options.type || 'o';
			var init = options.lastState;
			var latLng = L.latLng(init.lat, init.lng);
			this.map = L.map(this.$el.attr('id')).setView(latLng, init.zoom);
			L.tileLayer(options.tileUrl, {
				attribution: options.attribution,
				maxZoom: 21
			}).addTo(this.map);
			L.control.scale().addTo(this.map);
			this.posMarker = null;
			this.setListeners();
		},
		setListeners: function() {
			var map = this.map;
			map.on('click', function(e) {
				app.jump(Gx.latLng(e.latlng));
			});
			map.on('drag', _.bind(function() {
				app.infoView.refreshBounds(this.getCenter(), this.getZoom());
			}, this));
			map.on('moveend dragend zoomend', _.bind(this.updateQyeryString, this));
		},
		clearMarker: function() {
			if (this.posMarker) {
				this.map.removeLayer(this.posMarker);
			}
		},
		createMarker: function(latLng) {
			this.clearMarker();
			this.posMarker = L.marker(latLng.getLeaflet());
			this.posMarker.addTo(this.map);
			this.posMarker.on('click', _.bind(function(me) {
				this.setCenter(Gx.latLng(me.latlng));
			}, this));
		},
		setCenter: function(latLng) {
			this.map.panTo(latLng.getLeaflet());
		},
		fix: function() {
			this.$el.css({
				height: $(window).height() + 'px',
				width: $(window).width() + 'px'
			});
			this.map.invalidateSize();
		}
	});
}).call(this);