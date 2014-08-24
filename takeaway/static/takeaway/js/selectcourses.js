var AvailableCourse = Backbone.Model.extend({
	urlRoot:'/courses/'
});


var AvailableCourseView = Backbone.View.extend({
	tagName: "li",
	template:_.template('<span id="course<%=id%>"><%= course_name%></span>'),
	render : function(){
		this.$el.append(this.template(this.model.toJSON()));
		return this;
	},
	events: {"click":"selectCourse"},

	selectCourse: function(){

	//save course here by sending the required data.

	}

});
var AvailableCourseList = Backbone.Collection.extend({
	model:AvailableCourse
});

var AvailableCourseListView = Backbone.View.extend({
	tagName : "ul",
	className: "courselist",
	render : function(){
		this.collection.forEach(this.addOne,this);
		return this;
	},
	addOne: function(availableCourse){
		var  availableCourseObject = new AvailableCourse();
		availableCourseObject.set(availableCourse);
		var availableCourseView = new AvailableCourseView({model:availableCourseObject});
		$(this.el).append(availableCourseView.render().el);
	}

});

var availableCourse = new AvailableCourse();

availableCourse.fetch({success:function(collection,response){
	var availableCourses= collection.attributes.results;
	var availableCourseListView = new AvailableCourseListView({collection:availableCourses});
	$('#available-course-list').append(availableCourseListView.render().el);
}});