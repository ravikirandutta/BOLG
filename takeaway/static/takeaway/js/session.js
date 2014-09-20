

var Session = Backbone.Model.extend({
    urlRoot:'/sessions/'
});

var isPrivateView = false;
var isFavView = false;

var SessionView = Backbone.View.extend({

    initialize : function(){
             this.model.on("change", this.render, this);
         },
    render: function(){

        var template = _.template($('#session-template').html(),this.model.toJSON());
        this.$el.html(template);

        var takeawaySet = this.model.attributes.takeaway_set;

        takeawaySet = _.sortBy(takeawaySet,function(takeaway){
          return (5-takeaway.average_rating)  ;
        });

        if(isPrivateView){
          takeawaySet = _.filter(takeawaySet,function(takeaway){
            return takeaway.user.id == $.cookie('userid')  ;
          });
        }

        if(isFavView){
          takeawaySet = _.filter(takeawaySet,function(takeaway){
            return takeaway.favObj != null ;
          });
        }


        var takeawayList = new TakeawayListView({collection:takeawaySet});


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
        var collection =  response.responseesults;

        return collection;
    }
});


var SessionListView  = Backbone.View.extend({

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
            $('div.rateit, span.rateit').rateit();
         },

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
     events:{"click .btn-primary":"updateSession"},

     updateSession: function(){
        var newSessionName= $("#edit-session-textarea").val();
        this.model.set({"session_name":newSessionName});
        this.model.save();
        $("#editSessionmodalCloseButton").click();
     }


})

