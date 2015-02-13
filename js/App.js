;(function() {
	this.Gx = this.Gx || {};
	this.Gx.lastStateKey = 'lastState_GeoExplorer';
	this.Gx.bookmarkKey = 'bookmarks_GeoExplorer';

	this.Gx.AppView = Backbone.View.extend({
		el: '#wrapper',
		initialize: function() {
			this.searcher = new Gx.Searcher(this);
			this.mapView = new Gx.MapView();
			this.searchView = new Gx.SearchView(this.searcher);
			this.infoView = new Gx.InfoView();
			this.bookmarkView = new Gx.BookmarkView();
		},
		jump: function(latLng, centering) {
			this.render({
				centerPos: (centering ? latLng : null),
				markerPos: latLng
			});
			this.searcher.geocode(latLng, _.bind(function(results) {
				this.render({
					geocodeResults: results
				});
			}, this));
			this.bookmarkView.hide();
			return this;
		},
		render: function(params) {
			if (params.centerPos) {
				this.mapView.setCenter(params.centerPos);
			}
			if (params.markerPos) {
				this.mapView.createMarker(params.markerPos);
			}
			if (params.geocodeResults) {
				this.infoView.setGeocodeResult(params.geocodeResults);
			}
			if (params.bookmarkTitle) {
				this.bookmarkView.setSearchKey(params.bookmarkTitle);
			}
			if (params.zoom) {
				this.mapView.map.setZoom(params.zoom);
			}
			return this;
		}
	});

}).call(this);

$(function() {
	// Finally, create AppView to start the application.
	window.app = new Gx.AppView();

	// Start Router
	var Router = Backbone.Router.extend({
		routes: {
			'(:coord)': 'jump'
		},
		jump: function(coord) {
			if (!coord || !coord.match(/^(-{0,1}\d+\.{0,1}\d+,){2}\d+$/g)) {
				return;
			}
			var sp = coord.split(',').map(function(v) {
				return +v;
			});
			app.jump(new google.maps.LatLng(sp[0], sp[1]), true).render({
				zoom: sp[2]
			});
		}
	});
	Gx.router = new Router();
	Backbone.history.start();

	// Set listeners
	(function() {
		// Save current state to localStorage on closing App
		window.onbeforeunload = function() {
			app.mapView.saveState();
			app.bookmarkView.save();
		};
		var map = app.mapView.map;
		google.maps.event.addListener(map, 'click', function(me) {
			app.jump(me.latLng);
		});
		google.maps.event.addListener(map, 'bounds_changed', function() {
			app.infoView.refreshBounds(map);
		});
		google.maps.event.addListener(map, 'idle', function() {
			var m = app.mapView.map;
			var c = m.getCenter();
			var query = [c.lat(), c.lng(), m.getZoom()].map(function(v) {
				return Gx.Utils.round(+v, 7);
			}).join(',');
			Gx.router.navigate(query, false);
		});
		app.jump(map.getCenter());
	})();

	// Set short-cut keys
	(function() {
		var opts = {
				'type': 'keydown',
				'propagate': true,
				'target': document
			},
			map = app.mapView.map;

		shortcut.add('Shift+PageUp', function() {
			map.setZoom(map.getZoom() + 1);
		}, opts);
		shortcut.add('Shift+PageDown', function() {
			map.setZoom(map.getZoom() - 1);
		}, opts);
		shortcut.add('Ctrl+Enter', _.bind(function() {
			app.infoView.toggle();
		}, this), opts);
		shortcut.add('Ctrl+Q', _.bind(function() {
			app.searchView.focus();
		}, this), opts);
		shortcut.add('Ctrl+M', _.bind(function() {
			app.bookmarkView.toggleBookmark();
		}, this), opts);
	})();

	// map & address_info & bookmark box fixer
	(function(f) {
		f();
		$(window).resize(f);
	})(function() {
		$('#map_canvas').css({
			height: $(window).height() + 'px'
		});
		var info = $('#informations').height(),
			centerInfo = $('#center_info').height() || 80,
			clicked = $('#clicked_point').height() || 80,
			h2 = $('#informations h2').outerHeight(),
			h = info - (centerInfo + clicked + h2 * 2) - 15;
		$('#address_info').css({
			maxHeight: h + 'px'
		});
		$('#bookmark').css({
			maxHeight: $(window).height() * 0.8 + 'px'
		});
	});

});