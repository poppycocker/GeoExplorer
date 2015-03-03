;(function() {
	this.Gx = this.Gx || {};
	this.Gx.SwitchView = Backbone.View.extend({
		events: {
			'change': 'toggle'
		},
		initialize: function(options) {
			_.bindAll(this, 'toggle');
			this.collection = new Gx.SwitchUnitCollection();
			var template = _.template($('#tmpl_switch_unit').html());
			var types = this.getTypes();
			// ここで追加
			Object.keys(types).forEach(_.bind(function(p) {
				var type = types[p];
				var model = new Gx.SwitchUnitModel(type);
				var view = new Gx.SwitchUnitView({
					model: model,
					template: template
				});
				this.$el.append(view.render().$el);
				this.collection.add(model);
			}, this));
			this.setOption(options.initialType);
		},
		setOption: function(type) {
			this.$el.val(type);
		}
	});
	this.Gx.SwitchUnitView = Backbone.View.extend({
		tagName: 'option',
		initialize: function(options) {
			this.template = options.template;
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