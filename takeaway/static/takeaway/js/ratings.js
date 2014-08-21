	var Rating = Backbone.Model.extend({
		urlRoot:'/ratings/'
	});

	var RatingsView = Backbone.View.extend({

		render : function(){
			var template = _.template($('#rating-template').html());
			$(this.el).html(template);
			return this;
		},
		events : {"click":"rateTakeaway"},

		rateTakeaway : function(event){
			this.model;
			var rating = new Rating();
			var userId = this.model.get('user').id;
			var takeAwayId = this.model.get('id');
			var ratingValue = event.target.value;
			rating.set({'user':userId});

			rating.set({'takeaway':takeAwayId});
			rating.set({'rating_value':ratingValue});
			rating.save();
		}
	});
