

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
    events:{"click a":"getTakeaways"},

    getTakeaways: function(event){
        var takeaways = new TakeawayList();
        var id = $(event.currentTarget).attr('id');
        takeaways.fetch({success: function(collection, response){
            var takeawaysForSession = new Array();
            var allTakeaways =collection.models[0].attributes.results;
            for(var i =0,j=0;i < allTakeaways.length;i++){
                var sessionId = allTakeaways[i].session;
                if(  sessionId == id){
                    takeawaysForSession[j]=allTakeaways[i];
                    j++;
                }
            }


            var takeawayListView = new TakeawayListView({collection:takeawaysForSession});
            takeawayListView.render();
        }});

    }
});



var SessionList = Backbone.Collection.extend({
    model:Session,
    url:'/sessions',
parse: function(response){
        return response.results;
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

var takeawayList = new TakeawayList();
session.fetch({success: function(collection, response){
    var sessionListView = new SessionListView({collection: collection.attributes.results});
       $("#takeaway-container").append(sessionListView.render().el);

}});


