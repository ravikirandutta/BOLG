	var Rating = Backbone.Model.extend({
		urlRoot:'/ratings'
	});

	var RatingsView = Backbone.View.extend({
		
		render : function(){
			var template = _.template($('#rating-template').html());
			$(this.el).html(template);
			return this;
		},
		events : {"click":"rateTakeaway"},

		rateTakeaway : function(){
			this.model;
			var rating = new Rating();
			var userId = this.model.get('user').id;
			var takeAwayId = this.model.get('takeaway').id;
			var ratingValue = "5";
			rating.set({'user':userId});

			rating.set({'takeaway':takeAwayId});
			rating.set({'rating_value':ratingValue});
			rating.save();
		}
	});