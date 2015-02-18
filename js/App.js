;(function() {
	this.Gx = this.Gx || {};
	this.Gx.lastStateKey = 'lastState_GeoExplorer';
	this.Gx.bookmarkKey = 'bookmarks_GeoExplorer';

	this.Gx.AppView = Backbone.View.extend({
		el: '#wrapper',
		initialize: function() {
			L.Icon.Default.imagePath = 'images';
			// Generate the Map, get last state from localStorage
			var lastState = Gx.Utils.localStorageWrapper.data(Gx.lastStateKey) || {};
			lastState.lat = lastState.lat || 35.5291699;
			lastState.lng = lastState.lng || 139.6958934;
			lastState.zoom = lastState.zoom || 9;
			lastState.type = lastState.type || 'g';
			this.mapViews = [
				new Gx.MapViewGoogle({
					el: '#map_google',
					lastState: lastState
				}),
				new Gx.MapViewLeaflet({
					el: '#map_osm',
					lastState: lastState,
					type: 'o',
					tileUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
				})
			];
			this.searcher = new Gx.Searcher(this);
			this.searchView = new Gx.SearchView(this.searcher);
			this.infoView = new Gx.InfoView();
			this.bookmarkView = new Gx.BookmarkView();
			this.toggleMap(lastState.type);
		},
		jump: function(latLng, centering) {
			// latLng: Gx.LatLng
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
		},
		toggleMap: function(type) {
			var prev = this.mapView;
			this.mapViews.forEach(function(view) {
				if (type) {
					view.show(view.type === type);
				} else {
					view.toggle();
				}
			});
			this.mapView = this.mapViews.filter(function(view) {
				return view.isVisible();
			})[0] || this.mapViews[0];
			if (prev) {
				this.mapView.setCenter(prev.getCenter());
				this.mapView.setZoom(prev.getZoom());
			}
			this.mapView.updateQyeryString();
			this.jump(this.mapView.getCenter(), true);
			setTimeout(this.fixer(), 100);
		},
		fixer: function() {
			this.mapView.fix();
			var info = this.infoView.$el.height(),
				centerInfo = this.infoView.centerInfoView.$el.height() || 80,
				clicked = this.infoView.clickedPointView.$el.height() || 80,
				h2 = this.infoView.$el.children('h2').outerHeight(),
				h = info - (centerInfo + clicked + h2 * 2) - 15;
			this.infoView.addressResultsView.$el.css({
				maxHeight: h + 'px'
			});
			this.bookmarkView.bookmarkListView.$el.css({
				maxHeight: $(window).height() * 0.8 + 'px'
			});
		}
	});

}).call(this);

$(function() {
	// Finally, create AppView to start the application.
	window.app = new Gx.AppView();

	// Start Router
	var Router = Backbone.Router.extend({
		routes: {
			'(:states)': 'jump'
		},
		jump: function(states) {
			if (!states || !states.match(/^(-{0,1}\d+\.{0,1}\d+,){2}\d+,[A-z]$/g)) {
				return;
			}
			var sp = states.split(',');
			var coords = sp.slice(0, 3).map(function(v) {
				return +v;
			});
			app.toggleMap(sp[3]);
			app.jump(Gx.latLng(coords[0], coords[1]), true).render({
				zoom: coords[2]
			});
		}
	});
	Gx.router = new Router();
	Backbone.history.start();

	// Save current state to localStorage on closing App
	window.onbeforeunload = function() {
		app.mapView.saveState();
		app.bookmarkView.save();
	};

	// Set short-cut keys
	(function() {
		var opts = {
			'type': 'keydown',
			'propagate': true,
			'target': document
		};
		shortcut.add('Shift+PageUp', function() {
			app.mapView.setZoom(app.mapView.getZoom() + 1);
		}, opts);
		shortcut.add('Shift+PageDown', function() {
			app.mapView.setZoom(app.mapView.getZoom() - 1);
		}, opts);
		shortcut.add('Ctrl+Enter', function() {
			app.infoView.toggle();
		}, opts);
		shortcut.add('Ctrl+Q', function() {
			app.searchView.focus();
		}, opts);
		shortcut.add('Ctrl+M', function() {
			app.bookmarkView.toggleBookmark();
		}, opts);

		shortcut.add('Ctrl+I', function() {
			app.toggleMap();
		}, opts);
	})();

	// map & address_info & bookmark box fixer
	(function(f) {
		f();
		$(window).resize(f);
	})(_.bind(app.fixer, app));
});