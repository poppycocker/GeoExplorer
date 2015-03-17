;(function() {
	this.Gx = this.Gx || {};
	this.Gx.SearchView = Backbone.View.extend({
		el: '#input_address',
		events: {
			'keyup': 'onSearch'
		},
		initialize: function(options) {
			_.bindAll(this, 'onSearch', 'focus');
			this.setSearcher(options.searcher);
			this.$el.val(options.initialQuery || '');
		},
		onSearch: function(e) {
			var str = this.$el.val();
			if (e.keyCode === 13 && str !== '') {
				this.searcher.search(str);
			}
		},
		focus: function() {
			this.$el.focus().select();
		},
		setSearcher: function(searcher) {
			this.searcher = searcher;
		}
	});
}).call(this);