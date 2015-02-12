Number.prototype.round = function(d) {
	d = Math.pow(10, d || 1);
	return Math.round(this * d) / d;
};

(function() {
	var lastStateKey = 'lastState_GeoExplorer';
	var bookmarkKey = 'bookmarks_GeoExplorer';

	this.Gx = this.Gx || {};
	this.Gx.AppView = Backbone.View.extend({
		el: '#wrapper',
		initialize: function() {
			this.searcher = new Gx.Searcher(this);
			this.mapView = new MapView();
			this.searchView = new SearchView(this.searcher);
			this.infoView = new InfoView();
			this.bookmarkView = new BookmarkView();

		},
		jump: function(latLng, centering) {
			this.updateViews({
				centerPos: (centering ? latLng : null),
				markerPos: latLng
			});
			this.searcher.geocode(latLng, _.bind(function(results) {
				this.updateViews({
					geocodeResults: results
				});
			}, this));
			this.bookmarkView.hide();
		},
		updateViews: function(params) {
			if (params.centerPos) {
				this.mapView.setCenter(params.centerPos);
			}
			if (params.markerPos) {
				this.mapView.createMarker(params.markerPos);
			}
			if (params.geocodeResults) {
				this.infoView.setGeocodeResult(params.geocodeResults);
			}
			if (params.bookmarkKey) {
				this.bookmarkView.setSearchKey(params.bookmarkKey);
			}
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
			this.posMarker = null;
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
			this.posMarker.addListener('click', _.bind(function(me) {
				this.setCenter(me.latLng);
			}, this));
		},
		setCenter: function(latLng) {
			this.map.setCenter(latLng);
		},
		saveState: function() {
			var center = this.map.getCenter();
			window.localStorageWrapper.data(lastStateKey, {
				lat: center.lat(),
				lng: center.lng(),
				zoom: this.map.getZoom()
			});
		}
	});

	var SearchView = Backbone.View.extend({
		el: '#input_address',
		events: {
			'keyup': 'onSearch'
		},
		initialize: function(searcher) {
			_.bindAll(this, 'onSearch', 'focus');
			this.searcher = searcher;
			this.$el.val('');
		},
		onSearch: function(e) {
			var str = this.$el.val();
			if (e.keyCode === 13 && str !== '') {
				this.searcher.search(str);
			}
		},
		focus: function() {
			this.$el.focus().select();
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
				lng: c.lng().round(6),
				lat256s: c.getLat256s(),
				lng256s: c.getLng256s(),
				zoom: map.getZoom()
			});
			this.clickedPointView.model.set({
				zoom: map.getZoom()
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
					lng: latLng.lng().round(6),
					lat256s: latLng.getLat256s(),
					lng256s: latLng.getLng256s()
				});
			}
			// clear all
			this.addressResultsView.clear();
			// add results
			_.each(results, function(result) {
				this.addressResultsView.add(result);
			}, this);
		},
		toggle: function() {
			this.$el.slideToggle('fast');
		}
	});

	var CenterInfoView = Backbone.View.extend({
		el: '#center_info',
		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
			this.template = _.template($('#tmpl_point_info').html());
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			$('.llstring').click(function() {
				$(this).select();
			});
			return this;
		}
	});
	var PositionModel = Backbone.Model.extend({
		defaults: function() {
			return {
				meshcode: '',
				latLngStr: '',
				lat: 0,
				lng: 0,
				lat256s: 0,
				lng256s: 0,
				zoom: 18
			};
		}
	});

	var ClickedPointView = Backbone.View.extend({
		el: '#clicked_point',
		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
			this.template = _.template($('#tmpl_point_info').html());
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			$('.llstring').click(function() {
				$(this).select();
			});
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
			if (!data.formatted_address)
				return;
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
	var AddressCollection = Backbone.Collection.extend();


	var BookmarkView = Backbone.View.extend({
		el: '#bookmark_box',
		events: {
			'click #btn_bookmark': 'toggleBookmark'
		},
		initialize: function() {
			this.bookmarkListView = new BookmarkListView({
				collection: new BookmarkCollection()
			});
		},
		toggleBookmark: function() {
			this.bookmarkListView.toggle();
		},
		save: function() {
			this.bookmarkListView.save();
		},
		setSearchKey: function(str) {
			this.bookmarkListView.setSearchKey(str);
		},
		hide: function() {
			this.bookmarkListView.hide();
		}
	});

	var BookmarkListView = Backbone.View.extend({
		el: '#bookmark',
		events: {
			'keydown #input_bookmark': 'onKeyDown',
			'click .icon-plus': 'add'
		},
		initialize: function() {
			this.$ul = this.$el.find('ul');
			this.$input = this.$el.find('input');
			_.bindAll(this, 'load', 'add', 'save', 'render');
			this.collection.bind('add', this.render);
			this.load();
			this.idx = 0;
		},
		load: function() {
			var bookMarks = window.localStorageWrapper.data(bookmarkKey) || Gx.defaultBookmark;
			if (bookMarks instanceof Array) {
				_.each(bookMarks.sort(function(a, b) {
					return a.locationName > b.locationName;
				}), function(bookmark) {
					this.collection.add(bookmark);
				}, this);
			}
		},
		onKeyDown: function(e) {
			if (e.keyCode === 13) {
				this.onEnter(e);
			} else if (e.keyCode === 38 || e.keyCode === 40) {
				this.onUpDown(e);
			} else if (e.keyCode === 46) {
				this.onDelete();
			}
		},
		onEnter: function(e) {
			if (this.$el.find('.bkm_li_hover').length !== 0) {
				this.collection.each(function(model) {
					model.trigger('deselect:byKey');
				});
				this.collection.at(this.idx).trigger('jump:byKey');
			} else {
				this.add();
			}
		},
		onUpDown: function(e) {
			if (this.$el.find('li').length === 0) {
				return;
			}
			this.adjustIdx();
			if (this.$el.find('.bkm_li_hover').length === 0) {
				this.collection.at(this.idx).trigger('select:byKey');
				return;
			}
			if (e.keyCode === 38) {
				// Up
				this.idx--;
			} else {
				// Down
				this.idx++;
			}
			this.adjustIdx();
			this.collection.each(function(model) {
				model.trigger('deselect:byKey');
			});
			this.collection.at(this.idx).trigger('select:byKey');
		},
		onDelete: function() {
			if (this.$el.find('.bkm_li_hover').length !== 0) {
				this.collection.at(this.idx).trigger('delete:byKey');
			}
		},
		adjustIdx: function() {
			if (this.idx < 0) {
				this.idx = this.collection.length - 1;
			} else if (this.idx >= this.collection.length) {
				this.idx = 0;
			}
		},
		add: function() {
			var latLng = app.mapView.map.getCenter();
			var val = this.$input.val();
			if (val === '') {
				return;
			}
			this.collection.add({
				locationName: val,
				lat: latLng.lat(),
				lng: latLng.lng()
			});
			this.$input.val('');
		},
		save: function() {
			var data = this.collection.map(function(model) {
				return model.attributes;
			});
			if (data.length)
				window.localStorageWrapper.data(bookmarkKey, data);
			else
				window.localStorageWrapper.remove(bookmarkKey);
		},
		render: function(model) {
			var view = new BookmarkUnitView({
					model: model
				}),
				$bookmark = view.render().$el,
				$bookmarks = this.$ul.children(),
				idx = this.collection.indexOf(model);

			// add at sorted position (same as collection)
			if ($bookmarks.length < 1) {
				this.$ul.append($bookmark);
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
		},
		setSearchKey: function(str) {
			this.$input.val(str);
		},
		focusInput: function() {
			this.$input.focus().select();
		},
		toggle: function() {
			this.$el.slideToggle('fast', _.bind(function() {
				this.focusInput();
			}, this));
		},
		hide: function() {
			this.$el.hide();
		}
	});
	var BookmarkUnitView = Backbone.View.extend({
		tagName: 'li',
		events: {
			'click': 'onClick',
			'click .icon-delete-bookmark': 'onDelete'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'remove', 'onClick', 'onSelect', 'onDeselect', 'onDelete');
			this.template = _.template($('#tmpl_bookmark_unit').html());
			this.model.bind('destroy', this.remove);
			this.model.bind('select:byKey', this.onSelect);
			this.model.bind('deselect:byKey', this.onDeselect);
			this.model.bind('delete:byKey', this.onDelete);
			this.model.bind('jump:byKey', this.onClick);
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		},
		onClick: function() {
			if (this.removeFlg) {
				return;
			}
			app.jump(new google.maps.LatLng(this.model.get('lat'), this.model.get('lng')), true);
		},
		onSelect: function() {
			this.$el.addClass('bkm_li_hover');
		},
		onDeselect: function() {
			this.$el.removeClass('bkm_li_hover');
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
			return bookmark.get('locationName').toUpperCase();
		}
	});

}).call(this);

$(function() {
	// finally, create AppView to start the application.
	window.app = new Gx.AppView();

	// Set listeners
	(function() {
		// Save current state to localStorage on close
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