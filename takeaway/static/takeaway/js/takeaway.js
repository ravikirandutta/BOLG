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
            var courseid = this.get('course').id;
            modifiedTakeaway.set({'course':courseid});
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
            modifiedTakeaway.save();

        }

    });
    var TakeawayView = Backbone.View.extend({

        render: function(){
            var template = _.template($('#takeaway-template').html(),this.model.toJSON());
            this.editInPlaceView = new EditInPlaceView({model:this.model});
            this.inPlaceView = new InPlaceView({model:this.model});
            $(this.el).html(template);

            var isOwner = this.model.get('isOwner');
            if (!isOwner){
                this.$('.btn-group').hide();
                this.$('.tag-remove').hide();

                this.$('#editable-notes').append(this.inPlaceView.render().el);
            }else{
                this.$('#editable-notes').append(this.editInPlaceView.render().el);
            }
            return this;
        },
        events: {"click .btn-success":"updateNotes",
                 "click .tag-remove":"removeTag"},

        updateNotes : function(){
            var notes = this.$("textarea").val();
            this.model.set({notes:notes});
            this.model.modifyAndSave();
            this.render();
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
        render: function(){
            this.$el.html("");

            this.collection.forEach(this.addOne,this);
            return this;
        },
        addOne: function(takeaway){
              var takeawayObject = new Takeaway();
              takeawayObject.set(takeaway);
               var userid = $.cookie('userid');
                 if (takeaway.user.id == userid)  {
                    takeawayObject.set({isOwner:true});
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
              var takeawayView = new TakeawayView({model:takeawayObject});
              this.$el.append(takeawayView.render().el);
          }
        }
    });


var takeaway = new Takeaway();
takeaway.fetch({success:function(collection, response){

    var takeawayListView = new TakeawayListView({collection:collection.attributes.results});
    takeawayListView.render();

}});

var NewTakeaway = Backbone.View.extend({
     selectedTags : new Array(),
     render: function(){
        var template = _.template($('#new-takeaway-template').html(),this.model);
        this.$el.append(template);
        this.$('#tags-list').append(tagsListView.render().el);
        return this;
     },
     events: {"click .btn-primary":"createTakeaway",
              "click a":"toggleTag"},

     createTakeaway: function(){
        this.model;
        var object = {};
        object.notes = $("textarea").val();
        object.user = $.cookie("userid");
        object.course = this.model.course.id;
        object.session = this.model.id;
        object.tags= this.selectedTags;
        var takeaway = new Takeaway();
        takeaway.set(object);


        takeaway.save();
        $("#modalCloseButton").click();
        var courseid = "#course"+object.course;
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




