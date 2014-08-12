

      var Course = Backbone.Model.extend({
        urlRoot:'/courses'
      });

      var CourseView = Backbone.View.extend({
        tagName: "a",
        className: "course",

        template:_.template('<span><i class="fa fa-bars"></i> <%= course_name%></span>'),
        render : function(){
              this.$el.append(this.template(this.model.toJSON()));
              return this;
        },
        events: {"click span":"loadTakeaways"},

        loadTakeaways : function(){
            $("#takeaway-container").html("");
            var takeawayList = new TakeawayList();
            takeawayList.fetch({data: {course: this.model.id},
                success: function(collection, response){
                    var sessionListView = new SessionListView({collection:collection.models[0].attributes.results});
                    $("#takeaway-container").append(sessionListView.render().el);
                }});
        }

      });

    var CourseList = Backbone.Collection.extend({
            model: Course
    });

    var CourseListView = Backbone.View.extend({

        render : function(){
            this.collection.forEach(this.addOne,this);
            return this;
        },
        addOne: function(course){
            var courseObject = new Course();
            courseObject.set(course);
            var courseView = new CourseView({model:courseObject});
            $(this.el).append(courseView.render().el);
        }

    });


    var course = new Course();
    course.fetch({success:function(collection, response){
        var courses = collection.attributes.results;
        var courseListView = new CourseListView({collection:courses});
        $("#course-list").append(courseListView.render().el);
    }});
