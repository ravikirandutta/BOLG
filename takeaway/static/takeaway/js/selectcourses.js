var AvailableCourse = Backbone.Model.extend({
	urlRoot:'/courseInstances/'
});


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
	events: {"click span":"selectCourse"},

	selectCourse: function(){
		var userid = $.cookie('userid');
		var that = this;
		var takeAwayProfile = new TakeAwayProfile();
		takeAwayProfile.fetch({data: {user:userid}, success: function(response){
			var profile = new TakeAwayProfile();
			profile.set(response);
			var courseInstances = profile.get('courseInstances');
			courseInstances.push(that.model.id);
			profile.set({'courseInstances':courseInstances});
			profile.save({parse:false});
		}});

	//save course here by sending the required data.

	}

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
		if(this.registeredCourses.indexOf(availableCourseObject.get('id')) >= 0){
			availableCourseObject.set({'alreadyRegistered':true});
		}
		var availableCourseView = new AvailableCourseView({model:availableCourseObject});
		$(this.el).append(availableCourseView.render().el);
	}

});

var availableCourse = new AvailableCourse();


availableCourse.fetch({success:function(collection,response){

	var takeAwayProfile = new TakeAwayProfile();
	takeAwayProfile.fetch({success:function(response){
		var courseInstances = response.courseInstances;
		var availableCourses= collection.attributes.results;
		var availableCourseListView = new AvailableCourseListView({collection:availableCourses,registeredCourses:courseInstances});
		$('#available-course-list').append(availableCourseListView.render().el);
	}});

}});
