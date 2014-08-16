

      var Tags = Backbone.Model.extend({
        urlRoot:'/tags'
      });

      var TagsView = Backbone.View.extend({
        tagName: "span",
        className: "label label-important",

        template:_.template('<a><%= name%></a>'),
        render : function(){
              this.$el.append(this.template(this.model.toJSON()));
              return this;
        }


      });

    var TagsList = Backbone.Collection.extend({
            model: Tags
    });

    var TagsListView = Backbone.View.extend({

        render : function(){
            this.$el.html("");
            this.collection.forEach(this.addOne,this);
            return this;
        },
        addOne: function(tag){
            var tagObject = new Tags();
            tagObject.set(tag);
            var tagView = new TagsView({model:tagObject});
            $(this.el).append(tagView.render().el);
            $(this.el).append('&nbsp;');

        }

    });


    var tags = new Tags();
    var tagsListView = null;
    tags.fetch({success:function(collection, response){
        var tags = collection.attributes.results;
        tagsListView = new TagsListView({collection:tags});

    }});
