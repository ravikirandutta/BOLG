 var searchTag = null;
 var EditInPlaceForm = Backbone.View.extend({
    tagName: "form",

    events: {
        "submit": "save"
    },

    initialize: function (options) {
        _.extend(this, options);
    },

    render: function () {
        this.$el.html($("<textarea>", {
            val: this.model.get(this.attribute)
        }));
        this.$el.find("textarea").addClass("textarea");
        this.$el.find("textarea").trigger('autosize.resize');
        return this;
    },

    save: function () {
        this.model.set(this.attribute, this.$el.find("textarea").val());
        this.model.save();
        return false;
    }
});

var EditInPlaceView = Backbone.View.extend({
    id:"takeaway",
    tagName:"pre",
    attribute: "notes",
    className: "takeaway-pre",

    initialize: function (options) {
        _.extend(this, options);
        this.model.on("change", this.render, this);
    },

    events: {
        "dblclick": "edit"
    },

    render: function () {
        this.id = this.id+this.model.get('id');
        this.$el.html(this.model.get(this.attribute));
        return this;
    },

    edit: function () {
        this.$el.html(new EditInPlaceForm({
            model: this.model,
            attribute: this.attribute
        }).render().el);
        this.$el.find("textarea").autosize();
    }

});

var InPlaceView = Backbone.View.extend({
    id:"takeaway",
    tagName:"pre",
    attribute: "notes",
    className: "takeaway-pre",

    initialize: function (options) {
        _.extend(this, options);
        this.model.on("change", this.render, this);

    },


    render: function () {
        this.id = this.id+this.model.get('id');
        this.$el.html(this.model.get(this.attribute));
        return this;
    },

});

    var Takeaway = Backbone.Model.extend({
        urlRoot:'/takeaways/',
        modifyAndSave: function(){
            var modifiedTakeaway = new Takeaway();
            var courseid = this.get('courseInstance').id;
            modifiedTakeaway.set({'courseInstance':courseid});
            var sessionid = this.get('session').id;
            modifiedTakeaway.set({'session':sessionid});
            var userid = this.get('user').id;
            modifiedTakeaway.set({'user':userid});
            var tags = this.get('tags');
            var tagIds = new Array();
            _.each(tags,function(tag){
                tagIds.push(tag.id);
            });
            modifiedTakeaway.set({"tags":tagIds});
            modifiedTakeaway.set({"id":this.get('id')});
            modifiedTakeaway.set({"notes":this.get('notes')});

        modifiedTakeaway.set({'average_rating':this.get('average_rating')});
        modifiedTakeaway.set({'total_raters':this.get('total_raters')});
        modifiedTakeaway.set({'is_public':this.get('is_public')});

            modifiedTakeaway.save();

        }

    });
  var Rating = Backbone.Model.extend({
    urlRoot:'/ratings/'
  });

  

    var TakeawayView = Backbone.View.extend({

        initialize : function(){

            _.bindAll(this, 'beforeRender', 'render', 'afterRender');
            var _this = this;
             this.render = _.wrap(this.render, function(render) {
              _this.beforeRender();
                 render();

                  _this.afterRender();
              return _this;
            });
             this.model.on("change", this.render, this);
         },
         beforeRender: function(){

         },
         afterRender : function(){
             $('div.rateit, span.rateit').rateit();
            this.$el.find("[name='my-checkbox']").bootstrapSwitch();
        },
        // renderWithBootstrapSwitch : function(){
        //     this.render();

        // },
        render: function(){
            var template = _.template($('#takeaway-template').html(),this.model.toJSON());
            this.editInPlaceView = new EditInPlaceView({model:this.model});
            this.inPlaceView = new InPlaceView({model:this.model});
            $(this.el).html(template);
            var isOwner = this.model.get('isOwner');
            if (!isOwner){
                this.$('.btn-group').hide();
                this.$('.tag-remove').hide();
                var isRated= this.model.get("alreadyRated");
                var userRating = this.model.get("rating");

                this.$('.switch').hide();

            }
            this.$('#editable-notes').append(this.inPlaceView.render().el);
            if(isOwner){
              this.$("#takeaway").addClass('takeaway-pre-owner');
            }

            return this;
        },
        events: {"click #update ":"updateNotes",
                  "click #delete ":"deleteTakeaway",
                 "click .tag-remove":"removeTag",
                 "click .bootstrap-switch":"updateVisibility",
                 "rated .rateit":"rateTakeaway"
                    },


        updateVisibility :function(){
            var is_public = this.$("[name='my-checkbox']").prop('checked');
            this.model.set({'is_public':is_public});
            this.model.modifyAndSave();

        },
        deleteTakeaway : function(){
            this.model.destroy();
            refreshSessionlistView();
        },
        updateNotes : function(){

            var editableTakeaway = new EditableTakeaway({model:this.model});
             $("#editableTakeaway").html("");
            $("#editableTakeaway").append(editableTakeaway.render().el);


           // var notes = this.$("textarea").val();
            //this.model.set({notes:notes});
            //this.model.modifyAndSave();
            //this.render();
        },
        removeTag : function(event){
            //TODO : remove for loop and see if this can be reducded
            var tags = this.model.get('tags');
            var updatedTags = new Array();
            for(var i=0; i < tags.length ; i++){
                var tag = tags[i];
                if(tag.id != event.currentTarget.name){
                    updatedTags.push(tag);
                }
            }
            this.model.set({tags:updatedTags});
            this.model.modifyAndSave();
            this.render();

        },
        rateTakeaway:function(event,value){
          this.model;
          var rating = new Rating();
          var userId = this.model.get('user').id;
      var takeAwayId = this.model.get('id');
      var ratingValue = value;
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
        }
    });

    var TakeawayList = Backbone.Collection.extend({
        model: Takeaway,
        url:'/sessions/',
        parse: function(response){
             var collection =  response.results;
             return collection;
        }
    });

    var TakeawayListView = Backbone.View.extend({
        initialize: function(options){
            this.options = options;
           _.bindAll(this, 'beforeRender', 'render', 'afterRender');
            var _this = this;
             this.render = _.wrap(this.render, function(render) {
              _this.beforeRender();
                 render();

                  _this.afterRender();
              return _this;
            });
         },
         beforeRender: function(){

         },
         afterRender : function(){
            $("[name='my-checkbox']").bootstrapSwitch();
         },

        render: function(){
            this.$el.html("");

            this.collection.forEach(this.addOne,this);
            //$("[name='my-checkbox']").bootstrapSwitch();
            return this;
        },

        addOne: function(takeaway){



                var takeawayObject = new Takeaway();
              takeawayObject.set(takeaway);

               var userid = $.cookie('userid');
                 if (takeaway.user.id == userid)  {
                    takeawayObject.set({isOwner:true});
                 }else{
                    takeawayObject.set({isOwner:false});
                 }

              var tags = takeawayObject.get('tags');
              var hasTag = false;
              if(searchTag){
              _.each(tags,function(tag){
                  if(tag.name === searchTag){
                    hasTag = true;
                  }
              });
          }
              if( searchTag ==null || hasTag){
                if(takeawayObject.get('isOwner') || takeawayObject.get('is_public') ){
                    var takeawayView = new TakeawayView({model:takeawayObject});
                    this.$el.append(takeawayView.render().el);
                }

          }
        }




    });


// var takeaway = new Takeaway();
// takeaway.fetch({success:function(collection, response){
//     var userRatings= new Rating();
//     userRatings.fetch({data:{user:$.cookie('userid')} ,success:function(response){
//         var ratings=response.attributes.results;
//         var ratingsMap= {};
//         for(rating in ratings){
//             ratingsMap[rating["takeaway"]]=rating["rating_value"];
//         }
//         var takeawayListView = new TakeawayListView({collection:collection.attributes.results, ratingsmap:ratingsMap});
//     takeawayListView.render();
//     }});


// }});

var NewTakeaway = Backbone.View.extend({
    initialize: function(options){
            this.options = options;
           _.bindAll(this, 'beforeRender', 'render', 'afterRender');
            var _this = this;
             this.render = _.wrap(this.render, function(render) {
              _this.beforeRender();
                 render();

                  _this.afterRender();
              return _this;
            });
         },
         beforeRender: function(){

         },
         afterRender : function(){
            this.$el.find("#create-checkbox").bootstrapSwitch();
         },

     selectedTags : new Array(),
     render: function(){
        var template = _.template($('#new-takeaway-template').html(),this.model.toJSON());
        this.$el.append(template);

        this.$('#tags-list').append(tagsListView.render().el);
        return this;
     },
     events: {"click .btn-primary":"createTakeaway",
              "click a":"toggleTag"},

     createTakeaway: function(){
        this.model;
        var object = {};
        object.notes = $("#create-textarea").val();
        object.user = $.cookie("userid");
        object.courseInstance = this.model.get('courseInstance').id;
        object.session = this.model.get('id');
        object.tags= this.selectedTags;

        var takeaway = new Takeaway();

        takeaway.on("error", function(model, error){
                $.gritter.add({
                    title: 'Unexpected error',
                    text: 'Please try again later.',
                    sticky: false,
                    time: ''
                });
        });


        takeaway.set(object);
        takeaway.set({'is_public':$("#create-checkbox").prop('checked')});

        takeaway.save();
        $("#modalCloseButton").click();
        var courseid = "#course"+object.courseInstance;
        $(courseid).click();

     },
     toggleTag : function(event){
            var tagClicked = event.currentTarget.name;
            if(this.selectedTags.indexOf(tagClicked) >= 0){
                event.currentTarget.parentElement.className="label label-important";
                for(var i = this.selectedTags.length-1; i--;){
                    if (this.selectedTags[i] === tagClicked) this.selectedTags.splice(i, 1);
                }
            }else{
                this.selectedTags.push(tagClicked);
                event.currentTarget.parentElement.className="label label-success";
            }


     }
});

 var EditableTakeaway = Backbone.View.extend({
    initialize: function(options){
            this.options = options;
           _.bindAll(this, 'beforeRender', 'render', 'afterRender');
            var _this = this;
             this.render = _.wrap(this.render, function(render) {
              _this.beforeRender();
                 render();

                  _this.afterRender();
              return _this;
            });
         },
         beforeRender: function(){

         },
         afterRender : function(){
            this.$el.find("#edit-checkbox").bootstrapSwitch();
         },


    render : function(){
         var template = _.template($('#edit-takeaway-template').html(),this.model.toJSON());
         this.$el.append(template);
         var currentTags = this.model.get('tags');
           var tags = new Tags();
           var tagsListView = null;
           var that = this;
    tags.fetch({success:function(coll, response){
        var tagsList = new TagsList(coll.attributes.results);
        var callback = function(id){
            var tags = that.model.get('tags');
            if(tags ){
                var foundTag = _.find(tags,function(tag){
                    return tag.id == id;
                });
                if(foundTag){
                    var index = tags.indexOf(foundTag);
                tags.splice(index,1);
                }else{
                    var tagToBeAdded = _.find(tagsList.models, function(tag){
                    return tag.attributes.id == id;
                });
                var tagModelToBeAdded = new Tags();
                tagModelToBeAdded.set(tagToBeAdded);
                tags.push(tagModelToBeAdded.toJSON());
                }

            }else{
                    tags = [];
                var tagToBeAdded = _.find(tagsList.models, function(tag){
                    return tag.attributes.id == id;
                });
                var tagModelToBeAdded = new Tags();
                tagModelToBeAdded.set(tagToBeAdded);
                tags.push(tagModelToBeAdded.toJSON());
            }
            that.model.set({'tags':tags});
        };
        tagsListView = new TagsListView({collection:tagsList, currentTags:currentTags,callback:callback});

        that.$('#tags-list').append(tagsListView.render().el);
        that.tagsListView = tagsListView;
    }});


         return this;
    },

    events: {"click .btn-primary":"updateTakeaway"
              },

     updateTakeaway: function(){
        this.model;
        var object = {};
        object.notes = $("#edit-textarea").val();
        object.user = $.cookie("userid");
        object.courseInstance = this.model.get('courseInstance').id;
        object.session = this.model.get('session').id;

        object.id= this.model.get('id');
        var takeaway = new Takeaway();
        takeaway.on("error", function(model, error){
                $.gritter.add({
                    title: 'Unexpected error',
                    text: 'Please try again later.',
                    sticky: false,
                    time: ''
                });
            });

        takeaway.set(object);
        tags = this.model.get('tags');
        var tagIds = _.map(tags, function(tag){
            return tag.id;
        });
        takeaway.set({'tags':tagIds});
        takeaway.set({'average_rating':this.model.get('average_rating')});
        takeaway.set({'total_raters':this.model.get('total_raters')});
        takeaway.set({'is_public':$("#edit-checkbox").prop('checked')});
        takeaway.save();
        $("#editableTakeaway").modal('hide');
        this.model.set({"notes":object.notes});
        this.model.set({'is_public':takeaway.get('is_public')});
        this.model.set({'tags':tags});

        //refreshSessionlistView();

     }

 });






