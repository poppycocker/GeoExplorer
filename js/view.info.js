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
		refreshBounds: function(centerLL, zoom) {
			var r = Gx.Utils.round;
			this.centerInfoView.model.set({
				meshcode: centerLL.get2MeshCode(),
				latLngStr: centerLL.getLatLonStr(),
				lat: r(centerLL.lat, 7),
				lng: r(centerLL.lng, 7),
				lat256s: centerLL.getLat256s(),
				lng256s: centerLL.getLng256s(),
				zoom: zoom
			});
			this.clickedPointView.model.set({
				zoom: zoom
			});
		},
		setGeocodeResult: function(results) {
			var latLng;
			var r = Gx.Utils.round;
			if (results[0] && results[0].geometry) {
				latLng = Gx.latLng(results[0].geometry.location);
			}
			if (latLng) {
				this.clickedPointView.model.set({
					meshcode: latLng.get2MeshCode(),
					latLngStr: latLng.getLatLonStr(),
					lat: r(latLng.lat, 7),
					lng: r(latLng.lng, 7),
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