;(function() {
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
			var r = Gx.Utils.round;
			this.centerInfoView.model.set({
				meshcode: c.get2MeshCode(),
				latLngStr: c.getLatLonStr(),
				lat: r(c.lat(), 7),
				lng: r(c.lng(), 7),
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
			var r = Gx.Utils.round;
			if (results[0] && results[0].geometry) {
				latLng = results[0].geometry.location;
			}
			if (latLng) {
				this.clickedPointView.model.set({
					meshcode: latLng.get2MeshCode(),
					latLngStr: latLng.getLatLonStr(),
					lat: r(latLng.lat(), 7),
					lng: r(latLng.lng(), 7),
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