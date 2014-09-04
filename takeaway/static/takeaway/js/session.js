

var Session = Backbone.Model.extend({
    urlRoot:'/sessions/'
});

var SessionView = Backbone.View.extend({
    render: function(){

        var template = _.template($('#session-template').html(),this.model.toJSON());
        this.$el.html(template);

        var takeawayList = new TakeawayListView({collection:this.model.attributes.takeaway_set});


        this.$el.find("#takeaway-list").append(takeawayList.render().el);
        return this;
    },
    events:{"click  a":"createTakeaway",
            "click #edit-session-link":"editSession"
            },

    createTakeaway: function(){

        var newTakeaway = new NewTakeaway({model:this.model});

        $("#newTakeaway").html("");
         $("#newTakeaway").append(newTakeaway.render().el);
         //$("[name='my-checkbox']").bootstrapSwitch();
    },

    editSession:function(){
        var newEditSession = new EditSessionView({model:this.model});
        $("#editSession").html("");
        $("#editSession").append(newEditSession.render().el);
    },


});



var SessionList = Backbone.Collection.extend({
    model:Session,
    url:'/sessions',
parse: function(response){
        var collection =  response.results;

        return collection;
    }
});


var SessionListView  = Backbone.View.extend({

    render: function(){
        this.$el.html("");
        this.collection.forEach(this.addOne,this);
        return this;
    },
    addOne: function(session){
         var sessionObject = new Session();
              sessionObject.set(session);
              var sessionView = new SessionView({model:sessionObject});
              this.$el.append(sessionView.render().el);
    }
});

var EditSessionView = Backbone.View.extend({

    render: function(){
        var template = _.template($('#edit-session-template').html(),this.model.toJSON());
        this.$el.append(template);
        return this;
     },
})


