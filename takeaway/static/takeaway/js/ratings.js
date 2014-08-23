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

			var takeaway = this.model;
			var average_rating = takeaway.get('average_rating');
			var total_raters = takeaway.get('total_raters');
			average_rating = ((average_rating*total_raters)+ ratingValue)/(total_raters+1);

			takeaway.set({'average_rating':Number(average_rating).toFixed(1)});
		}
	});
