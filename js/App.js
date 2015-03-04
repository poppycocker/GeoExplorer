;(function() {
	this.Gx = this.Gx || {};
	this.Gx.AppView = Backbone.View.extend({
		el: '#wrapper',
		initialize: function() {
			_.bindAll(this, 'updateQyeryString')
			L.Icon.Default.imagePath = 'images';
			// Generate the Map, get last state from localStorage
			var lastState = this.getLastState();
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
				type: lastState.mapType
			});
			this.setCurrentMapVisible();
			this.searchers = [
				new Gx.SearcherGoogle(this),
				new Gx.SearcherNominatim(this)
			];
			this.searcher = _.findWhere(this.searchers, {
				type: lastState.searcherType
			});
			this.searchView = new Gx.SearchView({
				searcher: this.searcher
			});
			this.infoView = new Gx.InfoView();
			this.bookmarkView = new Gx.BookmarkView();
			_.each(this.mapViews, function(view) {
				view.setListeners(this);
			}, this);
			this.mapSwitchView = new Gx.MapSwitchView({
				initialType: lastState.mapType
			});
			this.searcherSwitchView = new Gx.SearcherSwitchView({
				initialType: lastState.searcherType
			});
		},
		getLastState: function() {
			var state = Gx.Utils.localStorageWrapper.data(Gx.lastStateKey) || {};
			state = _.pick(state, function(v, k, o) {
				return v !== null;
			})
			return _.defaults(state, {
				lat: Gx.defaultState.lat,
				lng: Gx.defaultState.lng,
				zoom: Gx.defaultState.zoom,
				mapType: Gx.mapTypes.google.key,
				searcherType: Gx.searcherTypes.google.key
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
					geocodeResults: this.searcher.generateModels(results, latLng)
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
			var next = _.findWhere(this.mapViews, {
				type: nextType
			});
			if (!next) {
				return;
			}
			this.mapView = next;
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
			this.updateQyeryString();
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
		toggleSearcher: function(nextType) {
			var current = this.searcher;
			if (current.type === nextType) {
				return;
			}
			var next = _.findWhere(this.searchers, {
				type: nextType
			});
			if (!next) {
				return;
			}
			this.searcher = next;
			this.searchView.setSearcher(this.searcher);
			var markerPos = this.mapView.getMarkerPos();
			if (!markerPos) {
				return;
			}
			this.jump(markerPos);
			this.updateQyeryString();
		},
		updateQyeryString: function() {
			var m = this.mapView;
			if (!Gx.router || !m.isVisible()) {
				return;
			}
			var c = m.getCenter();
			var queries = [c.lat, c.lng, m.getZoom()].map(function(v) {
				return Gx.Utils.round(+v, 7);
			});
			queries.push(m.type);
			queries.push(this.searcher.type);
			Gx.router.navigate(queries.join(','), {
				replace: true
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
	Gx.app = new Gx.AppView();

	// Start Router
	var Router = Backbone.Router.extend({
		routes: {
			'(:query)': 'jump'
		},
		jump: function(query) {
			query = query || '';
			var states = this.splitQuery(query);
			if (states.valid) {
				Gx.app.toggleMap(states.mapType);
				Gx.app.toggleSearcher(states.searcherType);
			} else {
				states = {
					latLng: Gx.app.mapView.getCenter(),
					zoom: Gx.app.mapView.getZoom()
				};
				Gx.app.infoView.refreshBounds(Gx.app.mapView);
			}
			Gx.app.jump(states.latLng, true).render({
				zoom: states.zoom
			});
			Gx.app.mapSwitchView.setOption(Gx.app.mapView.type);
			Gx.app.searcherSwitchView.setOption(Gx.app.searcher.type);
		},
		splitQuery: function(query) {
			// 35.6894875,139.6917064
			// or
			// 35.6894875,139.6917064,13,g,n
			if (!query.match(/^-{0,1}\d+\.{0,1}\d+,-{0,1}\d+\.{0,1}\d+$/g) &&
				!query.match(/^(-{0,1}\d+\.{0,1}\d+,){2}\d+(,[A-z]){2}$/g)) {
				return {
					valid: false
				};
			}
			var sp = query.split(',');
			var coords = sp.slice(0, 3).map(function(v) {
				return +v;
			});
			var ret = {
				valid: true,
				latLng: Gx.latLng(coords[0], coords[1])
			};
			if (sp.length == 2) {
				return ret;
			}
			return _.extend(ret, {
				zoom: coords[2],
				mapType: sp[3],
				searcherType: sp[4]
			});
		}
	});
	Gx.router = new Router();
	Backbone.history.start();

	// Save current state to localStorage on closing App
	window.onbeforeunload = function() {
		var m = Gx.app.mapView;
		var c = m.getCenter();
		Gx.Utils.localStorageWrapper.data(Gx.lastStateKey, {
			lat: c.lat,
			lng: c.lng,
			zoom: m.getZoom(),
			mapType: m.type,
			searcherType: Gx.app.searcher.type
		});

		Gx.app.bookmarkView.save();
	};

	// Set short-cut keys
	(function() {
		var opts = {
			'type': 'keydown',
			'propagate': true,
			'target': document
		};
		shortcut.add('Shift+PageUp', function() {
			Gx.app.mapView.setZoom(Gx.app.mapView.getZoom() + 1);
		}, opts);
		shortcut.add('Shift+PageDown', function() {
			Gx.app.mapView.setZoom(Gx.app.mapView.getZoom() - 1);
		}, opts);
		shortcut.add('Ctrl+Enter', function() {
			Gx.app.infoView.toggle();
		}, opts);
		shortcut.add('Ctrl+Q', function() {
			Gx.app.searchView.focus();
		}, opts);
		shortcut.add('Ctrl+M', function() {
			Gx.app.bookmarkView.toggleBookmark();
		}, opts);

	})();

	// map & address_info & bookmark box fixer
	(function(f) {
		f();
		$(window).resize(f);
	})(_.bind(Gx.app.fixer, Gx.app));
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