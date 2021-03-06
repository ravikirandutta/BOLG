

      var Course = Backbone.Model.extend({
        urlRoot:'/courseInstances'
      });

      var sessionListView;
      var courseInstanceId;

      var CourseView = Backbone.View.extend({
        tagName: "li",
        className: "course",

        template:_.template('<a class="course-item"><span id="course<%=id%>"><i class="fa fa-folder-open"></i> <b><%= course.course_name%></b></span></a>'),
        render : function(){
              this.$el.append(this.template(this.model.toJSON()));
              return this;
        },
        events: {"click span":"loadTakeaways"},

        loadTakeaways : function(){

            $('.slide-box').show();
            $("#tab1").html("");
            if(this.model.get('students')){
                var sortedList = _.sortBy(this.model.get('students'), function(name){return name});
                _.each(sortedList,function(studentName){
                  $("#tab1").append('<div class="slide-data"><div class="slide-data-text">'+studentName+'</div><div class="clearfix"></div></div>');
                });
            }


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

            var favoritesList = new Favorites();
            courseInstanceId = that.model.get('id');
            favoritesList.fetch({data:{user:$.cookie('userid'), courseInstance: that.model.get('id')} ,success:function(favList, response){
                
                takeawayList.fetch({data: {courseInstance: that.model.get('id'),ordering:'session_dt'},

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

                                    if(favList.attributes.results.length > 0){

                                        var takeawayFavObj = _.find(favList.attributes.results,function(favItem){
                                          return favItem.takeaway == takeaway.id  ;
                                        });
                                        if( takeawayFavObj === undefined){
                                            takeaway.favObj = null;
                                        }else{
                                            takeaway.favObj = takeawayFavObj;    
                                        }
                                        

                                    }
                                });
                            
                            });
                     sessionListView = new SessionListView({collection:collection,ratingsMap:ratingsMap});
                    $("#takeaway-container").append(sessionListView.render().el);
                    $('div.rateit, span.rateit').rateit();
                    $("[name='my-checkbox']").bootstrapSwitch();
                }});                                




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

        $(".fa-folder-open")[0].click();
    }});



