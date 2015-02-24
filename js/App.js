;(function() {
	this.Gx = this.Gx || {};
	this.Gx.AppView = Backbone.View.extend({
		el: '#wrapper',
		initialize: function() {
			L.Icon.Default.imagePath = 'images';
			// Generate the Map, get last state from localStorage
			var lastState = Gx.Utils.localStorageWrapper.data(Gx.lastStateKey) || {};
			lastState.lat = lastState.lat || Gx.defaultState.lat;
			lastState.lng = lastState.lng || Gx.defaultState.lng;
			lastState.zoom = lastState.zoom || Gx.defaultState.zoom;
			lastState.type = lastState.type || Gx.mapTypes.google.key;
			this.mapViews = [
				new Gx.MapViewGoogle({
					el: '#map_google',
					lastState: lastState
				}),
				new Gx.MapViewLeaflet({
					el: '#map_osm',
					lastState: lastState,
					type: Gx.mapTypes.osm.key,
					tileUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
				})
			];
			this.mapView = _.findWhere(this.mapViews, {
				type: lastState.type
			});
			this.setCurrentMapVisible();
			this.searcher = new Gx.Searcher(this);
			this.searchView = new Gx.SearchView({
				searcher: this.searcher
			});
			this.infoView = new Gx.InfoView();
			this.bookmarkView = new Gx.BookmarkView();
			this.mapViews.forEach(function(view) {
				view.setListeners();
			});
			this.mapSwitchView = new Gx.MapSwitchView({
				initialType: lastState.type
			});
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
			var animate = !!params.animate;
			if (params.centerPos) {
				this.mapView.setCenter(params.centerPos, animate);
			}
			if (params.markerPos) {
				this.mapView.createMarker(params.markerPos);
			}
			if (params.geocodeResults) {
				this.infoView.setGeocodeResult(params.geocodeResults, this.mapView.type);
			}
			if (params.bookmarkTitle) {
				this.bookmarkView.setSearchKey(params.bookmarkTitle);
			}
			if (params.zoom) {
				this.mapView.setZoom(params.zoom, animate);
			}
			return this;
		},
		toggleMap: function(nextType) {
			var current = this.mapView;
			if (current.type === nextType) {
				return;
			}
			// select next map
			if (nextType) {
				this.mapView = _.findWhere(this.mapViews, {
					type: nextType
				});
			} else {
				this.mapView = _.filter(this.mapViews, function(v) {
					return v.type !== current.type;
				})[0];
			}
			this.setCurrentMapVisible();
			this.mapView.fix();
			if (current) {
				this.render({
					centerPos: current.getCenter(),
					markerPos: current.getMarkerPos(),
					zoom: current.getZoom(),
					animate: false
				});
			}
			this.infoView.refreshBounds(this.mapView);
			this.infoView.clickedPointView.model.set({
				mapType: nextType
			});
			this.mapView.updateQyeryString();
		},
		setCurrentMapVisible: function() {
			var m = this.mapView;
			if (!m) {
				return;
			}
			this.mapViews.forEach(function(v) {
				v.show(v.cid === m.cid);
			});
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
			'(:query)': 'jump'
		},
		jump: function(query) {
			query = query || '';
			var states;
			if (query.match(/^(-{0,1}\d+\.{0,1}\d+,){2}\d+,[A-z]$/g)) {
				states = this.splitQuery(query);
				app.toggleMap(states.type);
			} else {
				states = {
					latLng: app.mapView.getCenter(),
					zoom: app.mapView.getZoom()
				};
				app.infoView.refreshBounds(app.mapView);
			}
			app.jump(states.latLng, true).render({
				zoom: states.zoom
			});
			app.mapSwitchView.setOption(app.mapView.type);
		},
		splitQuery: function(query) {
			var sp = query.split(',');
			var coords = sp.slice(0, 3).map(function(v) {
				return +v;
			});
			return {
				latLng: Gx.latLng(coords[0], coords[1]),
				zoom: coords[2],
				type: sp[3]
			};
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

	})();

	// map & address_info & bookmark box fixer
	(function(f) {
		f();
		$(window).resize(f);
	})(_.bind(app.fixer, app));
	// control box fixer
	(function(el) {
		var w = Array.prototype.slice.call(el.children()).map(function(child) {
			return $(child).width();
		}).reduce(function(prev, current) {
			return prev + current;
		}) + 1;
		el.css({
			width: w + 'px'
		});
	})($('#controls'));
});