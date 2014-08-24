	var Rating = Backbone.Model.extend({
		urlRoot:'/ratings/'
	});

	var RatingsView = Backbone.View.extend({

		render : function(){
			if(!this.model.attributes.alreadyRated){
			var template = _.template($('#rating-template').html(),this.model.toJSON());
			$(this.el).html(template);
		}
		else{
			$(this.el).html("| Your Rating("+this.model.get('rating')+")");
		}
			return this;
		},
		events : {"click":"rateTakeaway"},

		rateTakeaway : function(event){
			this.model;
			var rating = new Rating();
			var userId = this.model.get('user').id;
			var takeAwayId = this.model.get('id');
			var ratingValue = event.target.value;
			rating.set({'user':$.cookie("userid")});

			rating.set({'takeaway':takeAwayId});
			rating.set({'rating_value':ratingValue});
			rating.save();

			var takeaway = this.model;
			this.model.set({'alreadyRated':true});
			this.model.set({'rating':ratingValue});
			var average_rating = takeaway.get('average_rating');
			var total_raters = takeaway.get('total_raters');
			average_rating = ((Number(average_rating)*Number(total_raters))+ Number(ratingValue))/(Number(total_raters)+1);

			takeaway.set({'average_rating':Number(average_rating).toFixed(1)});
			this.render();
		}
	});

	
