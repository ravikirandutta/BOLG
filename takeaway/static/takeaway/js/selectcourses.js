var AvailableCourse = Backbone.Model.extend({
	urlRoot:'/courseInstances/'
});

var userid = $.cookie('userid');
var AvailableCourseView = Backbone.View.extend({
	tagName: "li",

	render : function(){
		this.$el.append(_.template($('#course-template').html(),this.model.toJSON()));
		if(this.model.get('alreadyRegistered')){
			this.$el.addClass('registered');
		}
		return this;
	},
	events: {"click":"toggleCourse"},

	toggleCourse: function(){

		var that = this;
		var takeAwayProfile = new TakeAwayProfile();
		takeAwayProfile.fetch({data: {user:userid}, success: function(response){
			var profile = new TakeAwayProfile();
			profile.set(response);
			var courseInstances = profile.get('courseInstances');
			var courseInstanceId = that.model.id;
			var index = -1;
			if(courseInstances){
				 index = courseInstances.indexOf(courseInstanceId);
			}else{
				courseInstances = [];
			}

			if(index>=0){
				courseInstances.splice(index,1);
			}else{
				courseInstances.push(that.model.id);
			}
			if(courseInstances.length<1){
			$('#select-course-warning').css('display','block');
			$('#select-course-complete').css('display','none');
			} else{
				$('#select-course-info').css('display','none');
				$('#select-course-warning').css('display','none');
				$('#select-course-complete').css('display','inline-block');
			}
			profile.set({'courseInstances':courseInstances});
			profile.save({parse:false});


		}});

		if(this.$el.hasClass("registered")){
			this.$el.find("#tick").css("display",'none');
			this.$el.removeClass("registered");
		}else{
			this.$el.find("#tick").css("display",'block');
			this.$el.addClass("registered");
		}
	//save course here by sending the required data.

	},


	// showCourseClicked: function(){
	// 	this.$el.css("background-color",'')
	// }

});
var AvailableCourseList = Backbone.Collection.extend({
	model:AvailableCourse
});

var AvailableCourseListView = Backbone.View.extend({
	initialize: function(options){
		this.registeredCourses = this.options.registeredCourses;
	},
	tagName : "ul",
	className: "courselist",
	render : function(){
		this.collection.forEach(this.addOne,this);
		return this;
	},
	addOne: function(availableCourse){
		var  availableCourseObject = new AvailableCourse();
		availableCourseObject.set(availableCourse);
		availableCourseObject.set({'alreadyRegistered':false});
		if(this.registeredCourses && this.registeredCourses.indexOf(availableCourseObject.get('id')) >= 0){
			availableCourseObject.set({'alreadyRegistered':true});
		}
		var availableCourseView = new AvailableCourseView({model:availableCourseObject});
		$(this.el).append(availableCourseView.render().el);
	}

});






	var takeAwayProfile = new TakeAwayProfile();
	takeAwayProfile.fetch({data: {user:userid},success:function(response){
		var courseInstances = response.attributes.courseInstances;
		var school = response.attributes.school;
		var availableCourse = new AvailableCourse();
		if(courseInstances.length<1){
			$('#select-course-info').css('display','block');
			$('#select-course-complete').css('display','none');
		}
		availableCourse.fetch({data:{school_id:school},success:function(collection,response){

		var availableCourses= collection.attributes.results;
		var availableCourseListView = new AvailableCourseListView({collection:availableCourses,registeredCourses:courseInstances});
		$('#available-course-list').append(availableCourseListView.render().el);
	}});

}});
