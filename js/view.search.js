;(function() {
	this.Gx = this.Gx || {};
	this.Gx.SearchView = Backbone.View.extend({
		el: '#input_address',
		events: {
			'keyup': 'onSearch'
		},
		initialize: function(options) {
			_.bindAll(this, 'onSearch', 'focus');
			this.searcher = options.searcher;
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