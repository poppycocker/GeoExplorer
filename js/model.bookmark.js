;
(function() {
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