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


    var Takeaway = Backbone.Model.extend({
        urlRoot:'/takeaways/'

    });
    var TakeawayView = Backbone.View.extend({

        render: function(){
            var template = _.template($('#takeaway-template').html(),this.model.toJSON());
            this.editInPlaceView = new EditInPlaceView({model:this.model});

            $(this.el).html(template);
            this.$('#editable-notes').append(this.editInPlaceView.render().el);
            return this;
        },
        events: {"click .btn-success":"updateNotes"},

        updateNotes : function(){
            var notes = this.$("textarea").val();
            this.model.set({notes:notes});
            this.model.save();
            this.render();
        }
    });

    var TakeawayList = Backbone.Collection.extend({
        model: Takeaway,
        url:'/takeaways/'
    });

    var TakeawayListView = Backbone.View.extend({
        el: $("#takeaway-list"),
        render: function(){
            this.$el.html("");
            this.collection.forEach(this.addOne,this);
            return this;
        },
        addOne: function(takeaway){
              var takeawayObject = new Takeaway();
              takeawayObject.set(takeaway);
              var takeawayView = new TakeawayView({model:takeawayObject});
              this.$el.append(takeawayView.render().el);
        }
    });


var takeaway = new Takeaway();
takeaway.fetch({success:function(collection, response){

    var takeawayListView = new TakeawayListView({collection:collection.attributes.results});
    takeawayListView.render();

}});
