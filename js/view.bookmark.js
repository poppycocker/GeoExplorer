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
			var bookMarks = Gx.Utils.localStorageWrapper.data(Gx.bookmarkKey) || Gx.defaultBookmark;
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
			var latLng = Gx.app.mapView.map.getCenter();
			var val = this.$input.val();
			if (val === '') {
				return;
			}
			this.collection.add({
				locationName: val,
				lat: latLng.lat,
				lng: latLng.lng
			});
			this.$input.val('');
		},
		save: function() {
			var data = this.collection.map(function(model) {
				return model.attributes;
			});
			if (data.length)
				Gx.Utils.localStorageWrapper.data(Gx.bookmarkKey, data);
			else
				Gx.Utils.localStorageWrapper.remove(Gx.bookmarkKey);
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
			Gx.app.jump(Gx.latLng(this.model.get('lat'), this.model.get('lng')), true);
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