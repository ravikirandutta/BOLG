var AvailableCourse = Backbone.Model.extend({
	urlRoot:'/courseInstances/'
});

var userid = $.cookie('userid');
var AvailableCourseView = Backbone.View.extend({
	tagName: "li",
	template:_.template('<span id="course<%=id%>"><%= course.course_name%></span>'),
	render : function(){
		this.$el.append(this.template(this.model.toJSON()));
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

			profile.set({'courseInstances':courseInstances});
			profile.save({parse:false});
		}});

		if(this.$el.hasClass("registered")){
			this.$el.removeClass("registered");
		}else{
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
		availableCourse.fetch({data:{school_id:school},success:function(collection,response){

		var availableCourses= collection.attributes.results;
		var availableCourseListView = new AvailableCourseListView({collection:availableCourses,registeredCourses:courseInstances});
		$('#available-course-list').append(availableCourseListView.render().el);
	}});

}});
