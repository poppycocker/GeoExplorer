(function() {
"use strict";

;(function() {
	this.prototype.get2MeshCode = function() {
		var lat_m1 = Math.floor(this.lat() / 2 * 3 + 90 / 2 * 3);
		var lng_m1 = Math.floor(this.lng() + 180);
		var lat_m2 = lat_m1 * 10 + Math.floor(((this.lat() / 2 * 3 + 90 / 2 * 3) - lat_m1) * 8);
		var lng_m2 = lng_m1 * 10 + Math.floor(((this.lng() + 180) - lng_m1) * 8);

		var strlat_m1 = lat_m1.toString();
		var strlng_m1 = lng_m1.toString();
		var tmpl, i;
		tmpl = strlat_m1.length;
		for (i = 0; i < 3 - tmpl; i++) {
			strlat_m1 = '0' + strlat_m1;
		}
		tmpl = strlng_m1.length;
		for (i = 0; i < 3 - tmpl; i++) {
			strlng_m1 = '0' + strlng_m1;
		}
		var m2str = strlat_m1 + strlng_m1 + lat_m2 % 10 + '' + lng_m2 % 10;
		return m2str;
	};

	var myfloor = function(val, n) {
		var s = Math.pow(10, n);
		return Math.floor(val * s) / s;
	};

	var getDMS = function(d) {
		var tmp = d;
		var nD = Math.floor(d);
		tmp = (tmp - nD) * 60;
		var nM = Math.floor(tmp);
		tmp = (tmp - nM) * 60;
		var nS = tmp;

		return [nD, nM, myfloor(nS, 3)];
	};

	var limitLngRange = function(v) {
		var d = (v > 0) ? -1 : 1;
		while (Math.abs(v) > 180) {
			v += 360 * d;
		}
		return v;
	};

	this.prototype.getLatLonStr = function() {
		var lat = this.lat();
		var lng = limitLngRange(this.lng());

		var nsstr = (lat < 0) ? 'S' : 'N';
		lat = Math.abs(lat);
		var ewstr = (lng < 0) ? 'W' : 'E';
		lng = Math.abs(lng);

		var lat_array = getDMS(lat);
		var lng_array = getDMS(lng);

		var latstr = nsstr + ' ' + lat_array[0] + ' ' + lat_array[1] + ' ' + lat_array[2];
		var lngstr = ewstr + ' ' + lng_array[0] + ' ' + lng_array[1] + ' ' + lng_array[2];

		var tmp_array = lat_array[2].toString().split('.');
		var latstrK = nsstr + ' ' + lat_array[0] + ' ' + lat_array[1];
		for (i = 0; i < tmp_array.length; i++) {
			latstrK += ' ' + tmp_array[i];
		}

		tmp_array = lng_array[2].toString().split('.');
		var lngstrK = ewstr + ' ' + lng_array[0] + ' ' + lng_array[1];
		for (var i = 0; i < tmp_array.length; i++) {
			lngstrK += ' ' + tmp_array[i];
		}
		var m2str = latstrK + ' ' + lngstrK;
		return m2str;
	};

	var get256s = function(deg) {
		return Math.round(deg * 3600 * 256);
	};

	this.prototype.getLat256s = function() {
		return get256s(this.lat());
	};

	this.prototype.getLng256s = function() {
		return get256s(this.lng());
	};

}).call(google.maps.LatLng);
/*
 Color animation 20120928
 http://www.bitstorm.org/jquery/color-animation/
 Copyright 2011, 2012 Edwin Martin <edwin@bitstorm.org>
 Released under the MIT and GPL licenses.
*/
(function(d){function m(){var b=d("script:first"),a=b.css("color"),c=false;if(/^rgba/.test(a))c=true;else try{c=a!=b.css("color","rgba(0, 0, 0, 0.5)").css("color");b.css("color",a)}catch(e){}return c}function j(b,a,c){var e="rgb"+(d.support.rgba?"a":"")+"("+parseInt(b[0]+c*(a[0]-b[0]),10)+","+parseInt(b[1]+c*(a[1]-b[1]),10)+","+parseInt(b[2]+c*(a[2]-b[2]),10);if(d.support.rgba)e+=","+(b&&a?parseFloat(b[3]+c*(a[3]-b[3])):1);e+=")";return e}function g(b){var a,c;if(a=/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(b))c=
[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16),1];else if(a=/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(b))c=[parseInt(a[1],16)*17,parseInt(a[2],16)*17,parseInt(a[3],16)*17,1];else if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))c=[parseInt(a[1]),parseInt(a[2]),parseInt(a[3]),1];else if(a=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(b))c=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),parseFloat(a[4])];return c}
d.extend(true,d,{support:{rgba:m()}});var k=["color","backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","outlineColor"];d.each(k,function(b,a){d.Tween.propHooks[a]={get:function(c){return d(c.elem).css(a)},set:function(c){var e=c.elem.style,i=g(d(c.elem).css(a)),h=g(c.end);c.run=function(f){e[a]=j(i,h,f)}}}});d.Tween.propHooks.borderColor={set:function(b){var a=b.elem.style,c=[],e=k.slice(2,6);d.each(e,function(h,f){c[f]=g(d(b.elem).css(f))});var i=g(b.end);
b.run=function(h){d.each(e,function(f,l){a[l]=j(c[l],i,h)})}}}})(jQuery);

/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
/**
 * changed　by poppycocker
 * [2015/02/13]
 * - wrap by anonymous function.
 * - adapt to 'use strict' directive.
 */
;(function() {
	this.shortcut = {
		'all_shortcuts': {}, //All the shortcuts are stored in this array
		'add': function(shortcut_combination, callback, opt) {
			//Provide a set of default options
			var default_options = {
				'type': 'keydown',
				'propagate': false,
				'disable_in_input': false,
				'target': document,
				'keycode': false
			};
			if (!opt) opt = default_options;
			else {
				for (var dfo in default_options) {
					if (typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
				}
			}

			var ele = opt.target;
			if (typeof opt.target == 'string') ele = document.getElementById(opt.target);
			var ths = this;
			shortcut_combination = shortcut_combination.toLowerCase();

			//The function to be called at keypress
			var func = function(e) {
				e = e || window.event;

				if (opt.disable_in_input) { //Don't enable shortcut keys in Input, Textarea fields
					var element;
					if (e.target) element = e.target;
					else if (e.srcElement) element = e.srcElement;
					if (element.nodeType == 3) element = element.parentNode;

					if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
				}

				//Find Which key is pressed
				var code;
				if (e.keyCode) code = e.keyCode;
				else if (e.which) code = e.which;
				var character = String.fromCharCode(code).toLowerCase();

				if (code == 188) character = ","; //If the user presses , when the type is onkeydown
				if (code == 190) character = "."; //If the user presses , when the type is onkeydown

				var keys = shortcut_combination.split("+");
				//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
				var kp = 0;

				//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
				var shift_nums = {
					"`": "~",
					"1": "!",
					"2": "@",
					"3": "#",
					"4": "$",
					"5": "%",
					"6": "^",
					"7": "&",
					"8": "*",
					"9": "(",
					"0": ")",
					"-": "_",
					"=": "+",
					";": ":",
					"'": "\"",
					",": "<",
					".": ">",
					"/": "?",
					"\\": "|"
				};
				//Special Keys - and their codes
				var special_keys = {
					'esc': 27,
					'escape': 27,
					'tab': 9,
					'space': 32,
					'return': 13,
					'enter': 13,
					'backspace': 8,

					'scrolllock': 145,
					'scroll_lock': 145,
					'scroll': 145,
					'capslock': 20,
					'caps_lock': 20,
					'caps': 20,
					'numlock': 144,
					'num_lock': 144,
					'num': 144,

					'pause': 19,
					'break': 19,

					'insert': 45,
					'home': 36,
					'delete': 46,
					'end': 35,

					'pageup': 33,
					'page_up': 33,
					'pu': 33,

					'pagedown': 34,
					'page_down': 34,
					'pd': 34,

					'left': 37,
					'up': 38,
					'right': 39,
					'down': 40,

					'f1': 112,
					'f2': 113,
					'f3': 114,
					'f4': 115,
					'f5': 116,
					'f6': 117,
					'f7': 118,
					'f8': 119,
					'f9': 120,
					'f10': 121,
					'f11': 122,
					'f12': 123
				};

				var modifiers = {
					shift: {
						wanted: false,
						pressed: false
					},
					ctrl: {
						wanted: false,
						pressed: false
					},
					alt: {
						wanted: false,
						pressed: false
					},
					meta: {
						wanted: false,
						pressed: false
					} //Meta is Mac specific
				};

				if (e.ctrlKey) modifiers.ctrl.pressed = true;
				if (e.shiftKey) modifiers.shift.pressed = true;
				if (e.altKey) modifiers.alt.pressed = true;
				if (e.metaKey) modifiers.meta.pressed = true;

				var i, k;
				for (i = 0; k = keys[i], i < keys.length; i++) {
					//Modifiers
					if (k == 'ctrl' || k == 'control') {
						kp++;
						modifiers.ctrl.wanted = true;

					} else if (k == 'shift') {
						kp++;
						modifiers.shift.wanted = true;

					} else if (k == 'alt') {
						kp++;
						modifiers.alt.wanted = true;
					} else if (k == 'meta') {
						kp++;
						modifiers.meta.wanted = true;
					} else if (k.length > 1) { //If it is a special key
						if (special_keys[k] == code) kp++;

					} else if (opt.keycode) {
						if (opt.keycode == code) kp++;

					} else { //The special keys did not match
						if (character == k) kp++;
						else {
							if (shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
								character = shift_nums[character];
								if (character == k) kp++;
							}
						}
					}
				}

				if (kp == keys.length &&
					modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
					modifiers.shift.pressed == modifiers.shift.wanted &&
					modifiers.alt.pressed == modifiers.alt.wanted &&
					modifiers.meta.pressed == modifiers.meta.wanted) {
					callback(e);

					if (!opt.propagate) { //Stop the event
						//e.cancelBubble is supported by IE - this will kill the bubbling process.
						e.cancelBubble = true;
						e.returnValue = false;

						//e.stopPropagation works in Firefox.
						if (e.stopPropagation) {
							e.stopPropagation();
							e.preventDefault();
						}
						return false;
					}
				}
			};
			this.all_shortcuts[shortcut_combination] = {
				'callback': func,
				'target': ele,
				'event': opt.type
			};
			//Attach the function with the event
			if (ele.addEventListener) ele.addEventListener(opt.type, func, false);
			else if (ele.attachEvent) ele.attachEvent('on' + opt.type, func);
			else ele['on' + opt.type] = func;
		},

		//Remove the shortcut - just specify the shortcut and I will remove the binding
		'remove': function(shortcut_combination) {
			shortcut_combination = shortcut_combination.toLowerCase();
			var binding = this.all_shortcuts[shortcut_combination];
			delete(this.all_shortcuts[shortcut_combination]);
			if (!binding) return;
			var type = binding.event;
			var ele = binding.target;
			var callback = binding.callback;

			if (ele.detachEvent) ele.detachEvent('on' + type, callback);
			else if (ele.removeEventListener) ele.removeEventListener(type, callback, false);
			else ele['on' + type] = false;
		}
	};
}).call(this);
;(function() {
	this.localStorageWrapper = {
		data: function(key, val) {
			var ls = window.localStorage, item;
			if (!ls || !key) {
				return null;
			}
			if (val) {
				ls.setItem(key, JSON.stringify(val));
			} else {
				item = ls.getItem(key);
				return item ? JSON.parse(item) : null;
			}
		},
		remove: function(key) {
			window.localStorage.removeItem(key);
		}
	};
}).call(this);
;(function() {
	this.Gx = this.Gx || {};
	this.Gx.Searcher = (function() {
		var c = function(app) {
			this.app = app;
			this.geocoder = new google.maps.Geocoder();
		};
		c.prototype = {
			search: function(key) {
				var coord = this.getLatLngFromString(key);
				if (coord.OK) {
					key = new google.maps.LatLng(coord.lat, coord.lng);
					this.app.render({
						centerPos: key,
						markerPos: key
					});
				}

				this.geocode(key, _.bind(function(results) {
					var latLng;
					if (results[0] && results[0].geometry) {
						latLng = results[0].geometry.location;
					}
					if (!coord.OK && latLng) {
						this.app.render({
							centerPos: latLng,
							markerPos: latLng
						});
					}
					this.app.render({
						geocodeResults: results,
						bookmarkTitle: key
					});
				}, this));
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
						results = [];
						if (q.latLng) {
							results.push({
								geometry: {
									location: q.latLng
								}
							});
						}
					}
					callback(results);
				});
			},
			getLatLngFromString: function(latlng) {
				var translated, tmp1 = latlng.replace('北緯', 'N').replace('南緯', 'S').replace('西経', 'W').replace('東経', 'E').trim(),
					tmp2 = latlng.replace(/\.|,|\'/g, ' ').replace(/"/g, '').replace('N', 'N ').replace('S', 'S ').replace('E', 'E ').replace('W', 'W ');
				var tmp2idx = tmp2.search(/N|S/);
				tmp2 = tmp2.substr(tmp2idx) + '00 ' + tmp2.substr(0, tmp2idx - 1) + '00';
				if (tmp1.match(/(N|S)(\s\d{1,3}){4}\s(E|W)(\s\d{1,3}){3,4}/)) {
					translated = tmp1;
				} else if (tmp2.match(/(N|S)(\s\d{1,3}){4}\s(E|W)(\s\d{1,3}){3,4}/)) {
					translated = tmp2;
				} else {
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
			}
		};
		return c;
	})();
}).call(this);
;(function() {
	this.Gx = this.Gx || {};
	this.Gx.SearchView = Backbone.View.extend({
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
}).call(this);
;(function() {
	this.Gx = this.Gx || {};
	this.Gx.defaultBookmark = [{
		'locationName': 'Amsterdam',
		'lat': 52.370216,
		'lng': 4.895168
	}, {
		'locationName': 'Bangkok',
		'lat': 13.727896,
		'lng': 100.524123
	}, {
		'locationName': 'Brussels',
		'lat': 50.85034,
		'lng': 4.35171
	}, {
		'locationName': 'Buenos Aires',
		'lat': -34.603723,
		'lng': -58.381593
	}, {
		'locationName': 'Detroit',
		'lat': 42.331427,
		'lng': -83.045754
	}, {
		'locationName': 'Honolulu',
		'lat': 21.306944,
		'lng': -157.858333
	}, {
		'locationName': 'Jakarta',
		'lat': -6.211544,
		'lng': 106.845172
	}, {
		'locationName': 'London',
		'lat': 51.511214,
		'lng': -0.119824
	}, {
		'locationName': 'Los Angels',
		'lat': 34.052234,
		'lng': -118.243685
	}, {
		'locationName': 'Melbourne',
		'lat': -37.814107,
		'lng': 144.96328
	}, {
		'locationName': 'Mexico City',
		'lat': 19.432608,
		'lng': -99.133208
	}, {
		'locationName': 'Moscow',
		'lat': 55.755826,
		'lng': 37.6173
	}, {
		'locationName': 'Mumbai',
		'lat': 19.075984,
		'lng': 72.877656
	}, {
		'locationName': 'Munich',
		'lat': 48.13672,
		'lng': 11.576754
	}, {
		'locationName': 'New Delhi',
		'lat': 28.635308,
		'lng': 77.22496
	}, {
		'locationName': 'New York',
		'lat': 40.714353,
		'lng': -74.005973
	}, {
		'locationName': 'Paris',
		'lat': 48.856614,
		'lng': 2.352222
	}, {
		'locationName': 'Rio de Janeiro',
		'lat': -22.903539,
		'lng': -43.209587
	}, {
		'locationName': 'Rome',
		'lat': 41.892916,
		'lng': 12.48252
	}, {
		'locationName': 'Singapore',
		'lat': 1.352083,
		'lng': 103.819836
	}, {
		'locationName': 'Vancouver',
		'lat': 49.261226,
		'lng': -123.113927
	}, {
		'locationName': '台北',
		'lat': 25.040539,
		'lng': 121.55211
	}, {
		'locationName': '東京',
		'lat': 35.689488,
		'lng': 139.691706
	}, {
		'locationName': '香港',
		'lat': 22.396428,
		'lng': 114.109497
	}];
}).call(this);
;(function() {
	this.Gx = this.Gx || {};
	this.Gx.BookmarkView = Backbone.View.extend({
		el: '#bookmark_box',
		events: {
			'click #btn_bookmark': 'toggleBookmark'
		},
		initialize: function() {
			this.bookmarkListView = new Gx.BookmarkListView({
				collection: new Gx.BookmarkCollection()
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
	this.Gx.BookmarkListView = Backbone.View.extend({
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
			var bookMarks = window.localStorageWrapper.data(Gx.bookmarkKey) || Gx.defaultBookmark;
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
				window.localStorageWrapper.data(Gx.bookmarkKey, data);
			else
				window.localStorageWrapper.remove(Gx.bookmarkKey);
		},
		render: function(model) {
			var view = new Gx.BookmarkUnitView({
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
	this.Gx.BookmarkUnitView = Backbone.View.extend({
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
}).call(this);
;(function() {
	Number.prototype.round = function(d) {
		d = Math.pow(10, d || 1);
		return Math.round(this * d) / d;
	};

	this.Gx = this.Gx || {};
	this.Gx.InfoView = Backbone.View.extend({
		el: '#informations',
		initialize: function() {
			this.centerInfoView = new Gx.InfoViewUnit({
				el: '#center_info',
				model: new Gx.PositionModel()
			});
			this.clickedPointView = new Gx.InfoViewUnit({
				el: '#clicked_point',
				model: new Gx.PositionModel()
			});
			this.addressResultsView = new Gx.AddressResultsView({
				collection: new Gx.AddressCollection()
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
	this.Gx.InfoViewUnit = Backbone.View.extend({
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
}).call(this);
;(function() {
	this.Gx = this.Gx || {};
	this.Gx.AddressResultsView = Backbone.View.extend({
		el: '#address_info',
		initialize: function() {
			_.bindAll(this, 'render', 'add', 'clear');
			this.collection.bind('add', this.render);
		},
		render: function(model) {
			var view = new Gx.AddressUnitView({
				model: model
			});
			this.$el.append(view.render().$el);
			return this;
		},
		add: function(data) {
			if (!data.formatted_address) {
				return;
			}
			var model = new Gx.AddressModel({
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
	this.Gx.AddressUnitView = Backbone.View.extend({
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
}).call(this);
;(function() {
	this.Gx = this.Gx || {};
	this.Gx.MapView = Backbone.View.extend({
		el: '#map_canvas',
		initialize: function() {
			// Generate the Map, get last state from localStorage
			var lastState = window.localStorageWrapper.data(Gx.lastStateKey) || {};
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
			window.localStorageWrapper.data(Gx.lastStateKey, {
				lat: center.lat(),
				lng: center.lng(),
				zoom: this.map.getZoom()
			});
		}
	});
}).call(this);
;(function() {
	this.Gx = this.Gx || {};
	this.Gx.BookmarkModel = Backbone.Model.extend({
		defaults: function() {
			return {
				locationName: '',
				lat: 0,
				lng: 0
			};
		}
	});
	this.Gx.BookmarkCollection = Backbone.Collection.extend({
		comparator: function(bookmark) {
			return bookmark.get('locationName').toUpperCase();
		}
	});
}).call(this);
;(function() {
	this.Gx = this.Gx || {};
	this.Gx.PositionModel = Backbone.Model.extend({
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
}).call(this);
;(function() {
	this.Gx = this.Gx || {};
	this.Gx.AddressModel = Backbone.Model.extend({
		defaults: function() {
			return {
				address: '',
				types: '',
				addressCompos: []
			};
		}
	});
	this.Gx.AddressCollection = Backbone.Collection.extend();
}).call(this);
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
			return this;
		}
	});

}).call(this);

$(function() {
	// finally, create AppView to start the application.
	window.app = new Gx.AppView();

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
}).call(this);