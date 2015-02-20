;(function() {
	this.Gx = this.Gx || {};
	this.Gx.MapSwitchView = Backbone.View.extend({
		el: '#mapswitch',
		events: {
			'change': 'toggle'
		},
		initialize: function(options) {
			_.bindAll(this, 'toggle');
			this.collection = new Gx.MapSwitchUnitCollection();
			// ここで追加
			Object.keys(Gx.mapTypes).forEach(_.bind(function(p) {
				var type = Gx.mapTypes[p];
				var model = new Gx.MapSwitchUnitModel({
					key: type.key,
					mapName: type.name,
				});
				var view = new Gx.MapSwitchUnitView({
					model: model
				});
				this.$el.append(view.render().$el);
				this.collection.add(model);
			}, this));
			this.$el.val(options.initialType);
		},
		toggle: function() {
			app.toggleMap(this.$el.val());
		}
	});
	this.Gx.MapSwitchUnitView = Backbone.View.extend({
		tagName: 'option',
		initialize: function() {
			this.template = _.template($('#tmpl_map_switch_unit').html());
			this.model.bind('change', this.render);
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes)).attr({
				value: this.model.get('key')
			});
			return this;
		},
	});
}).call(this);