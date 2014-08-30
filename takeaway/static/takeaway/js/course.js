

      var Course = Backbone.Model.extend({
        urlRoot:'/courseInstances'
      });

      var sessionListView;

      var CourseView = Backbone.View.extend({
        tagName: "li",
        className: "course",

        template:_.template('<a><span id="course<%=id%>"><i class="fa fa-folder-open"></i> <%= course.course_name%></span></a>'),
        render : function(){
              this.$el.append(this.template(this.model.toJSON()));
              return this;
        },
        events: {"click span":"loadTakeaways"},

        loadTakeaways : function(){

            $("#tab1").html("");
            _.each(this.model.get('students'),function(studentName){
              $("#tab1").append('<div class="slide-data"><div class="slide-data-text">'+studentName+'</div><div class="clearfix"></div></div>');
            });


            $(".course").addClass('course-deselected');
            $(this.el).removeClass('course-deselected');
            $(this.el).addClass('course-selected');
            $(".searchbox").css("display","block");
            $("#takeaway-container").html("");
            var course=this.model.id;
            var takeawayList = new TakeawayList();


            var that = this;
            var userRatings= new Rating();
            userRatings.fetch({data:{user:$.cookie('userid')} ,success:function(response){
            var ratings=response.attributes.results;
            var ratingsMap= {};
            _.each(ratings,function(rating){
                ratingsMap[rating["takeaway"]]=rating["rating_value"];
            });
                takeawayList.fetch({data: {courseInstance: that.model.get('id')},

                    success: function(collection, response){

                        _.each(collection.models,function(obj){
                            _.each(obj.attributes.takeaway_set,function(takeaway){
                                if(ratingsMap[takeaway.id]>-1)
                                    {
                                            takeaway.rating=ratingsMap[takeaway.id];
                                            takeaway.alreadyRated=true;
                                    }
                                else{
                                    takeaway.alreadyRated=false;
                                    }
                                });
                            });
                     sessionListView = new SessionListView({collection:collection,ratingsMap:ratingsMap});
                    $("#takeaway-container").append(sessionListView.render().el);

                    $("[name='my-checkbox']").bootstrapSwitch();
                }});
        }});
        }

      });

    var CourseList = Backbone.Collection.extend({
            model: Course
    });

    var CourseListView = Backbone.View.extend({

        tagName: "ul",
        className: "nav nav-pills",
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

    var userid = $.cookie('userid')
    var course = new Course();
    course.fetch({data:{students:userid},success:function(collection, response){
        var courses = collection.attributes.results;
        var courseListView = new CourseListView({collection:courses});
        $("#course-list").append(courseListView.render().el);
    }});



