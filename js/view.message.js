;(function() {
	this.Gx = this.Gx || {};
	this.Gx.MessageView = Backbone.View.extend({
		el: '.message',
		initialize: function(options) {
			this.$el.val('');
			$.easing.easeGxMessage = function(x, t, b, c, d) {
				return x * x;
			};
		},
		show: function(message) {
			this.$el.html(message).css({
				opacity: 1
			}).animate({
				opacity: 0
			}, 2500, 'easeGxMessage');
		},
		showNoResult: function() {
			this.show('No Result.');
		}
	});
}).call(this);