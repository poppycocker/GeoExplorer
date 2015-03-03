;(function() {
	this.Gx = this.Gx || {};
	this.Gx.AddressResultsView = Backbone.View.extend({
		el: '#address_info',
		initialize: function() {
			_.bindAll(this, 'render', 'add', 'clear');
			this.collection.bind('add', this.render);
			this.tmplGoogle = _.template($('#tmpl_address_info_google').html());
			this.tmplNominatim = _.template($('#tmpl_address_info_nominatim').html());
		},
		render: function(model) {
			var view = new Gx.AddressUnitView({
				model: model,
				template: this.getTemplate(model)
			});
			this.$el.append(view.render().$el);
			return this;
		},
		getTemplate: function(model) {
			if (model instanceof Gx.AddressModelGoogle) {
				return this.tmplGoogle;
			} else if (model instanceof Gx.AddressModelNominatim) {
				return this.tmplNominatim;
			}
		},
		add: function(model) {
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
		initialize: function(options) {
			_.bindAll(this, 'render', 'remove');
			this.template = options.template;
			this.model.bind('destroy', this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}
	});
}).call(this);