;(function() {
	this.Gx.MapViewGoogle = this.Gx.MapView.extend({
		initialize: function(options) {
			this.type = Gx.mapTypes.google.key;
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
		setListeners: function() {
			var map = this.map;
			google.maps.event.addListener(map, 'click', function(me) {
				app.jump(Gx.latLng(me.latLng));
			});
			google.maps.event.addListener(map, 'bounds_changed', _.bind(function() {
				app.infoView.refreshBounds(this);
			}, this));
			google.maps.event.addListener(map, 'idle', _.bind(this.updateQyeryString, this));
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
				position: latLng.getGoogle()
			});
			this.posMarker.addListener('click', _.bind(function(me) {
				this.setCenter(Gx.latLng(me.latLng));
			}, this));
		},
		getMarkerPos: function() {
			var p = this.posMarker;
			return p ? Gx.latLng(p.position) : null;
		},
		setCenter: function(latLng) {
			this.map.setCenter(latLng.getGoogle());
		},
		setZoom: function(val) {
			this.map.setZoom(val);
		},
		fix: function() {
			this.$el.css({
				height: $(window).height() + 'px'
			});
			google.maps.event.trigger(this.map, 'resize');
		}
	});
}).call(this);