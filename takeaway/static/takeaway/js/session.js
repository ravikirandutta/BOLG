

var Session = Backbone.Model.extend({
    urlRoot:'/sessions/'
});

var SessionView = Backbone.View.extend({
     tagName: 'tr',
    render: function(){
        var template = _.template($('#session-template').html(),this.model.toJSON());
        this.$el.html(template);
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
    el: $("#session-table"),
    render: function(){
        this.$el.html("");
        this.collection.forEach(this.addOne,this);
    },
    addOne: function(session){
         var sessionObject = new Session();
              sessionObject.set(session);
              var sessionView = new SessionView({model:sessionObject});
              this.$el.append(sessionView.render().el);
    }
});

var session = new Session();
session.fetch({success: function(collection, response){
    var sessionListView = new SessionListView({collection: collection.attributes.results});
    //    $("#session-table").append(sessionListView.render().el);
    sessionListView.render();
}});


