var TakeAwayProfile = Backbone.Model.extend({
    urlRoot:'/takeawayprofiles/',
    parse: function(response){
        return response.results[0];
    }
});

