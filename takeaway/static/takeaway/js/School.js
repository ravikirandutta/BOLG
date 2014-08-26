var School =  Backbone.Model.extend({
    urlRoot:'/schools/',
    parse: function(response){
        return response.results[0];
    }
});


var Program = Backbone.Model.extend({
    urlRoot:'/programs/',
    parse: function(response){
        return response.results;
    }

});
