Number.prototype.round = function(d) {
	d = Math.pow(10, d || 1);
	return Math.round(this * d) / d;
};

$(function() {

	var lastStateKey = 'lastState_GeoExplorer';
	var bookmarkKey = 'bookmarks_GeoExplorer';
	var defaultBookmark = [{
		"locationName": "Amsterdam",
		"lat": 52.3702157,
		"lng": 4.895167899999933
	}, {
		"locationName": "Bangkok",
		"lat": 13.7278956,
		"lng": 100.52412349999997
	}, {
		"locationName": "Brussels",
		"lat": 50.8503396,
		"lng": 4.351710300000036
	}, {
		"locationName": "Buenos Aires",
		"lat": -34.6037232,
		"lng": -58.38159310000003
	}, {
		"locationName": "Detroit",
		"lat": 42.331427,
		"lng": -83.0457538
	}, {
		"locationName": "Honolulu",
		"lat": 21.3069444,
		"lng": -157.85833330000003
	}, {
		"locationName": "Jakarta",
		"lat": -6.211544,
		"lng": 106.84517200000005
	}, {
		"locationName": "London",
		"lat": 51.51121389999999,
		"lng": -0.11982439999997041
	}, {
		"locationName": "Los Angels",
		"lat": 34.0522342,
		"lng": -118.2436849
	}, {
		"locationName": "Melbourne",
		"lat": -37.814107,
		"lng": 144.96327999999994
	}, {
		"locationName": "Mexico City",
		"lat": 19.4326077,
		"lng": -99.13320799999997
	}, {
		"locationName": "Moscow",
		"lat": 55.755826,
		"lng": 37.6173
	}, {
		"locationName": "Mumbai",
		"lat": 19.0759837,
		"lng": 72.87765590000004
	}, {
		"locationName": "Munich",
		"lat": 48.1367203,
		"lng": 11.576753999999937
	}, {
		"locationName": "New Delhi",
		"lat": 28.635308,
		"lng": 77.22496000000001
	}, {
		"locationName": "New York",
		"lat": 40.7143528,
		"lng": -74.0059731
	}, {
		"locationName": "Paris",
		"lat": 48.856614,
		"lng": 2.3522219000000177
	}, {
		"locationName": "Rio de Janeiro",
		"lat": -22.9035393,
		"lng": -43.20958689999998
	}, {
		"locationName": "Rome",
		"lat": 41.8929163,
		"lng": 12.482519899999943
	}, {
		"locationName": "Singapore",
		"lat": 1.352083,
		"lng": 103.81983600000001
	}, {
		"locationName": "Vancouver",
		"lat": 49.261226,
		"lng": -123.1139268
	}, {
		"locationName": "台北",
		"lat": 25.04053925219744,
		"lng": 121.55210973803707
	}, {
		"locationName": "東京",
		"lat": 35.6894875,
		"lng": 139.69170639999993
	}, {
		"locationName": "香港",
		"lat": 22.396428,
		"lng": 114.10949700000003
	}];

	var AppView = Backbone.View.extend({
		el: '#wrapper',
		events: {
			'keypress #input_address': 'onSearch',
			'click #btn_bookmark': 'toggleBookmark',
			'keypress #input_bookmark': 'onAddBookmark',
			'click #close_info': 'toggleInformation'
		},
		initialize: function() {
			this.mapView = new MapView({});
			this.infoView = new InfoView({});
			this.bookmarkView = new BookmarkView({
				collection: new BookmarkCollection()
			});

			// elements
			this.$inputBookmark = $('#input_bookmark');
			this.$informations = $('#informations');
			this.$inputAddress = $('#input_address');
			this.$bookmark = $('#bookmark');

			_.bindAll(this, 'setClickListener', 'setBoundsChangeListener', 'setShortcutKeys');
			this.setClickListener();
			this.setBoundsChangeListener();
			this.setShortcutKeys();

			// Save current state to localStorage on close
			window.onbeforeunload = _.bind(function() {
				var center = this.mapView.map.getCenter();
				window.localStorageWrapper.data(lastStateKey, {
					lat: center.lat(),
					lng: center.lng(),
					zoom: this.mapView.map.getZoom()
				});
			}, this);
		},
		setClickListener: function() {
			google.maps.event.addListener(this.mapView.map, 'click', _.bind(function(me) {
				this.jump(me.latLng);
			}, this));
		},
		setBoundsChangeListener: function() {
			var map = this.mapView.map;
			google.maps.event.addListener(map, 'bounds_changed', _.bind(function() {
				this.infoView.refreshBounds(map);
			}, this));
			this.jump(map.getCenter());
		},
		setShortcutKeys: function() {
			// short-cut key settings 
			var opts = {
				'type': 'keydown',
				'propagate': true,
				'target': document
			}, map = this.mapView.map;

			shortcut.add("Shift+PageUp", function() {
				map.setZoom(map.getZoom() + 1);
			}, opts);
			shortcut.add("Shift+PageDown", function() {
				map.setZoom(map.getZoom() - 1);
			}, opts);

			shortcut.add("Ctrl+Enter", _.bind(function() {
				this.toggleInformation();
			}, this), opts);
			shortcut.add("Ctrl+Q", _.bind(function() {
				this.$inputAddress.focus().select();
			}, this), opts);
			shortcut.add("Ctrl+M", _.bind(function() {
				this.toggleBookmark();
			}, this), opts);
		},
		toggleBookmark: function() {
			this.$bookmark.slideToggle('fast', _.bind(function() {
				this.$inputBookmark.focus().select();
			}, this));
		},
		toggleInformation: function() {
			this.$informations.slideToggle('fast');
		},
		onSearch: function(e) {
			var str = this.$inputAddress.val();
			if (e.keyCode === 13 && str !== '') {
				this.mapView.onSearch(str, _.bind(function(results) {
					this.infoView.setGeocodeResult(results);
					this.$inputBookmark.val(str);
				}, this));
			}
		},
		onAddBookmark: function(e) {
			if (e.keyCode === 13) {
				this.bookmarkView.add(this.$inputBookmark.val(), this.mapView.map.getCenter());
				this.$inputBookmark.val('');
			}
		},
		jump: function(latLng, centering) {
			if (centering) {
				this.mapView.setCenter(latLng);
			}
			this.mapView.createMarker(latLng);
			this.mapView.geocode(latLng, _.bind(function(results) {
				this.infoView.setGeocodeResult(results);
			}, this));
			this.$bookmark.hide();
		}
	});

	var MapView = Backbone.View.extend({
		el: '#map_canvas',
		initialize: function() {
			// Generate the Map, get last state from localStorage
			var lastState = window.localStorageWrapper.data(lastStateKey) || {};
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
			this.geocoder = new google.maps.Geocoder();
			this.posMarker = null;
		},
		onSearch: function(key, callback) {
			var coord = this.getLatLngFromString(key);
			if (coord.OK) {
				key = new google.maps.LatLng(coord.lat, coord.lng);
				this.createMarker(key);
				this.setCenter(key);
			}

			this.geocode(key, _.bind(function(results) {
				var latLng;
				if (results[0] && results[0].geometry) {
					latLng = results[0].geometry.location;
				}
				if (!coord.OK && latLng) {
					this.createMarker(latLng);
					this.setCenter(latLng);
				}
				callback(results);
			}, this));
		},
		getLatLngFromString: function(latlng) {
			var translated = latlng.replace('北緯', 'N').replace('南緯', 'S').replace('西経', 'W').replace('東経', 'E').trim();
			if (!translated.match(/(N|S)(\s\d{1,3}){4}\s(E|W)(\s\d{1,3}){3,4}/)) {
				return {
					lat: 0,
					lng: 0,
					OK: false
				};
			}

			var ar = translated.split(' ').map(function(v) {
				return parseInt(v, 10);
			});
			var lat = ar[1] + ar[2] / 60 + ar[3] / 3600 + ar[4] / 3600 / 1000;
			var lng = ar[6] + ar[7] / 60 + ar[8] / 3600 + (ar[9] ? ar[9] / 3600 / 1000 : 0);

			return {
				lat: (translated.match(/S/)) ? lat * (-1) : lat,
				lng: (translated.match(/W/)) ? lng * (-1) : lng,
				OK: true
			};
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
		},
		setCenter: function(latLng) {
			this.map.setCenter(latLng);
		},
		geocode: function(key, callback) {
			var q = {};
			if (key instanceof google.maps.LatLng) {
				q.latLng = key;
			} else {
				q.address = key;
			}

			this.geocoder.geocode(q, function(results, status) {
				if (status !== google.maps.GeocoderStatus.OK) {
					results = {};
				}
				callback(results);
			});
		}
	});

	var InfoView = Backbone.View.extend({
		el: '#informations',
		initialize: function() {
			this.centerInfoView = new CenterInfoView({
				model: new PositionModel()
			});
			this.clickedPointView = new ClickedPointView({
				model: new PositionModel()
			});
			this.addressResultsView = new AddressResultsView({
				collection: new AddressCollection()
			});
		},
		refreshBounds: function(map) {
			var c = map.getCenter();

			this.centerInfoView.model.set({
				meshcode: c.get2MeshCode(),
				latLngStr: c.getLatLonStr(),
				lat: c.lat().round(6),
				lng: c.lng().round(6)
			});
		},
		setGeocodeResult: function(results) {
			var latLng;
			if (results[0] && results[0].geometry) {
				latLng = results[0].geometry.location;
			}
			if (latLng) {
				this.clickedPointView.model.set({
					meshcode: latLng.get2MeshCode(),
					latLngStr: latLng.getLatLonStr(),
					lat: latLng.lat().round(6),
					lng: latLng.lng().round(6)
				});
			}
			// clear all
			this.addressResultsView.clear();
			// add results
			_.each(results, function(result) {
				this.addressResultsView.add(result);
			}, this);

		}
	});

	var CenterInfoView = Backbone.View.extend({
		el: '#center_info',
		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
			this.template = _.template($('#tmpl_center_info').html());
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}
	});
	var PositionModel = Backbone.Model.extend({
		defaults: function() {
			return {
				meshcode: '',
				latLngStr: '',
				lat: 0,
				lng: 0
			};
		}
	});

	var ClickedPointView = Backbone.View.extend({
		el: '#clicked_point',
		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
			this.template = _.template($('#tmpl_clicked_point').html());
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}
	});

	var AddressResultsView = Backbone.View.extend({
		el: '#address_info',
		initialize: function() {
			_.bindAll(this, 'render', 'add', 'clear');
			this.collection.bind('add', this.render);
		},
		render: function(model) {
			var view = new AddressUnitView({
				model: model
			});
			this.$el.append(view.render().$el);
			return this;
		},
		add: function(data) {
			var model = new AddressModel({
				address: data.formatted_address,
				types: data.types.join(', '),
				addressCompos: data.address_components.map(function(compo) {
					return {
						types: compo.types.join(', '),
						longName: compo.long_name
					};
				})
			});
			this.collection.add(model);
		},
		clear: function() {
			var model;
			while (model = this.collection.first()) {
				model.destroy();
			}
		}
	});
	var AddressUnitView = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			_.bindAll(this, 'render', 'remove');
			this.template = _.template($('#tmpl_address_info').html());
			this.model.bind('destroy', this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}
	});
	var AddressModel = Backbone.Model.extend({
		defaults: function() {
			return {
				address: '',
				types: '',
				addressCompos: []
			};
		}
	});
	var AddressCollection = Backbone.Collection.extend({});


	var BookmarkView = Backbone.View.extend({
		el: '#bookmark ul',
		initialize: function() {
			_.bindAll(this, 'load', 'add', 'onDelete', 'save', 'render');
			this.collection.bind('add', this.render);
			this.collection.bind('remove', this.onDelete);
			this.load();
		},
		load: function() {
			var bookMarks = window.localStorageWrapper.data(bookmarkKey) || defaultBookmark;
			if (bookMarks instanceof Array) {
				_.each(bookMarks.sort(function(a, b) {
					return a.locationName > b.locationName;
				}), function(bookmark) {
					this.collection.add(bookmark);
				}, this);
			}
		},
		add: function(locationName, latLng) {
			this.collection.add({
				locationName: locationName,
				lat: latLng.lat(),
				lng: latLng.lng()
			});
			this.save();
		},
		onDelete: function() {
			this.save();
		},
		save: function() {
			var data = [];
			this.collection.each(function(model) {
				data.push(model.attributes);
			}, this);
			window.localStorageWrapper.data(bookmarkKey, data);
		},
		render: function(model) {
			var view = new BookmarkUnitView({
				model: model
			}),
				$bookmark = view.render().$el,
				$bookmarks = this.$el.children(),
				idx = this.collection.indexOf(model);

			// add at sorted position (same as collection)
			if ($bookmarks.length < 1) {
				this.$el.append($bookmark);
			} else if (idx === 0) {
				$bookmarks.eq(0).before($bookmark);
			} else {
				$bookmarks.eq(idx - 1).after($bookmark);
			}

			// animate inserted element
			$bookmark.css({
				backgroundColor: '#87CEEB'
			}).animate({
				backgroundColor: '#EEEEEE'
			}, function() {
				$(this).attr('style', '');
			});

			return this;
		}
	});
	var BookmarkUnitView = Backbone.View.extend({
		tagName: 'li',
		events: {
			'click': 'onClick',
			'click .icon-delete-bookmark': 'onDelete'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'remove');
			this.template = _.template($('#tmpl_bookmark_unit').html());
			this.model.bind('destroy', this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		},
		onClick: function() {
			if (this.removeFlg) {
				return;
			}
			appView.jump(new google.maps.LatLng(this.model.get('lat'), this.model.get('lng')), true);
		},
		onDelete: function() {
			this.removeFlg = true;
			this.$el.hide('fast', _.bind(function() {
				this.model.destroy();
			}, this));
		}
	});
	var BookmarkModel = Backbone.Model.extend({
		defaults: function() {
			return {
				locationName: '',
				lat: 0,
				lng: 0
			};
		}
	});
	var BookmarkCollection = Backbone.Collection.extend({
		comparator: function(bookmark) {
			return bookmark.get('locationName');
		}
	});


	// finally, create AppView to start the application.
	window.appView = new AppView();


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