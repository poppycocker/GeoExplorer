$(function() {

	// map fixer
	(function(f) {
		f();
		$(window).resize(f);
	})(function() {
		$('#map_canvas').css({
			height: $(window).height() + 'px'
		});
	});

	var AppView = Backbone.View.extend({
		el: '#wrapper',
		events: {
			'click #btn_address': 'onSearch',
			'keypress #input_address': 'onEnter'
		},
		initialize: function() {
			this.mapView = new MapView({});
			this.infoView = new InfoView({});

			_.bindAll(this, 'setClickListener', 'setBoundsChangeListener');
			this.setClickListener();
			this.setBoundsChangeListener();
		},
		setClickListener: function() {
			var self = this;
			google.maps.event.addListener(self.mapView.map, 'click', function(me) {
				// マップにマーカーを出す
				self.mapView.createMarker(me.latLng);
				// geocoding
				self.mapView.geocode(me.latLng, function(results) {
					self.infoView.setGeocodeResult(results);
				});
			});
		},
		setBoundsChangeListener: function() {
			var self = this;
			google.maps.event.addListener(self.mapView.map, 'bounds_changed', function() {
				// AreaInfoを書き換える
				self.infoView.refreshBounds(self.mapView.map);
			});
		},
		onEnter: function(e) {
			if (e.keyCode === 13) {
				this.onSearch();
			}
		},
		onSearch: function() {
			var self = this;
			this.mapView.onSearch($('#input_address').val(), function(results) {
				self.infoView.setGeocodeResult(results);
			});
		}
	});

	var MapView = Backbone.View.extend({
		el: '#map_canvas',
		initialize: function() {
			// map生成
			var latlng = new google.maps.LatLng(35.5291699, 139.6958934);
			var options = {
				zoom: 9,
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

			// short-cut key settings 
			var map = this.map;
			shortcut.add("Shift+PageUp", function() {
				map.setZoom(map.getZoom() + 1);
			}, {
				'type': 'keydown',
				'propagate': true,
				'target': document
			});
			shortcut.add("Shift+PageDown", function() {
				map.setZoom(map.getZoom() - 1);
			}, {
				'type': 'keydown',
				'propagate': true,
				'target': document
			});
		},
		onSearch: function(key, callback) {
			var coord = this.getLatLngFromString(key);
			if (coord.OK) {
				key = new google.maps.LatLng(coord.lat, coord.lng);
			}

			var self = this;
			this.geocode(key, function(results) {
				var latLng;
				if (results[0] && results[0].geometry) {
					latLng = results[0].geometry.location;
				}
				if (latLng) {
					self.createMarker(latLng);
					self.setCenter(latLng);
				}
				callback(results);
			});
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
			this.areaInfoView = new AreaInfoView({
				model: new AreaInfoModel()
			});
			this.clickedPointView = new ClickedPointView({
				model: new ClickedPointModel()
			});
			this.addressResultsView = new AddressResultsView({
				collection: new AddressCollection()
			});
		},
		refreshBounds: function(map) {
			var c = map.getCenter();
			var b = map.getBounds();
			var sw = b.getSouthWest();
			var ne = b.getNorthEast();

			this.areaInfoView.model.set({
				meshcode: c.get2MeshCode(),
				center: c.getLatLonStr(),
				southwest: sw.getLatLonStr(),
				northeast: ne.getLatLonStr()
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
					clicked: latLng.getLatLonStr(),
					lat: latLng.lat(),
					lng: latLng.lng()
				});
			}
			// loop results
			this.addressResultsView.collection.reset();
			_.each(results, function(result) {
				var model = new AddressModel({
					address: result.formatted_address,
					types: result.types.join(', '),
					addressCompos: result.address_components.map(function(compo) {
						return {
							types: compo.types.join(', '),
							longName: compo.long_name
						};
					})
				});
				this.addressResultsView.collection.add(model);
			}, this);

		}
	});

	var AreaInfoView = Backbone.View.extend({
		el: '#area_info',
		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
			this.template = _.template($('#tmpl_area_info').html());
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}
	});
	var AreaInfoModel = Backbone.Model.extend({
		defaults: function() {
			return {
				meshcode: '',
				center: '',
				southwest: '',
				northeast: ''
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
	var ClickedPointModel = Backbone.Model.extend({
		defaults: function() {
			return {
				meshcode: '',
				clicked: '',
				lat: '',
				lng: ''
			};
		}
	});

	var AddressResultsView = Backbone.View.extend({
		el: '#address_info',
		initialize: function() {
			_.bindAll(this, 'render', 'clear');
			this.collection.bind('add', this.render);
			this.collection.bind('reset', this.clear);
		},
		render: function(model) {
			var view = new AddressUnitView({
				model: model
			});
			this.$el.append(view.render().$el);
			return this;
		},
		clear: function() {
			this.$el.html('');
		}
	});
	var AddressUnitView = Backbone.View.extend({
		tagName: 'p',
		initialize: function() {
			_.bindAll(this, 'render', 'remove');
			this.template = _.template($('#tmpl_address_info').html());
			this.model.bind('destroy', this.remove);
		},
		render: function() {
			this.$el.append(this.template(this.model.attributes));
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

	// short-cut key settings 
	shortcut.add("Ctrl+Enter", function() {
		$('#informations').slideToggle('fast');
	}, {
		'type': 'keydown',
		'propagate': true,
		'target': document
	});
	shortcut.add("Ctrl+Q", function() {
		$('#input_address').focus();
	}, {
		'type': 'keydown',
		'propagate': true,
		'target': document
	});

	// finally, kick AppView to start the application.
	window.appView = new AppView();

});