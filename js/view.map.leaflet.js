;(function() {
	this.Gx.MapViewLeaflet = this.Gx.MapView.extend({
		initialize: function(options) {
			this.type = options.type || Gx.mapTypes.osm.key;
			var init = options.lastState;
			var latLng = L.latLng(init.lat, init.lng);
			this.map = L.map(this.$el.attr('id')).setView(latLng, init.zoom);
			L.tileLayer(options.tileUrl, {
				attribution: options.attribution,
				maxZoom: 21,
				errorTileUrl: 'images/no_map_available.png'
			}).addTo(this.map);
			L.control.scale().addTo(this.map);
			this.posMarker = null;
		},
		setListeners: function(app) {
			var map = this.map;
			map.on('click', function(e) {
				app.jump(Gx.latLng(e.latlng));
			});
			map.on('drag moveend', _.bind(function() {
				app.infoView.refreshBounds(this);
			}, this));
			map.on('moveend dragend zoomend', _.bind(app.updateQyeryString, this));
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
				this.setCenter(Gx.latLng(me.latlng), true);
			}, this));
		},
		getMarkerPos: function() {
			var p = this.posMarker;
			return p ? Gx.latLng(p.getLatLng()) : null;
		},
		setCenter: function(latLng, animate) {
			this.map.panTo(latLng.getLeaflet(), {
				animate: !!animate
			});
		},
		setZoom: function(val, animate) {
			this.map.setZoom(val, {
				animate: !!animate
			});
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