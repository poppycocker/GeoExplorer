;(function() {
	this.Gx = this.Gx || {};
	this.Gx.SearcherSwitchView = Gx.SwitchView.extend({
		el: '#searcher-switch',
		getTypes: function() {
			return Gx.searcherTypes;
		},
		toggle: function() {
			Gx.app.toggleSearcher(this.$el.val());
		},
	});
}).call(this);