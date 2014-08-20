
      var assignedTags = []
      var Tags = Backbone.Model.extend({
        urlRoot:'/tags'
      });

      var TagsView = Backbone.View.extend({
        tagName: "span",
        className: "label label-warning",

        template:_.template('<a name="<%=id%>"><i class="fa fa-tags"></i><%= name%></a>'),
        render : function(){
            if(this.model.get('selected')){
              this.$el.removeClass('label-warning');
            this.$el.addClass('label-success');
            }

              this.$el.append(this.template(this.model.toJSON()));
              return this;
        },

        events:{"click a":"toggleSelection"},

        toggleSelection:function(){

                if(this.model.get('selected')){
                     this.$el.removeClass('label-warning');
                     this.$el.addClass('label-success');
                }else{
                    this.$el.addClass('label-warning');
                     this.$el.removeClass('label-success');
                }

                this.model.set({'selected':!this.model.get('selected')});
        }


      });

    var TagsList = Backbone.Collection.extend({
            model: Tags
    });

    var TagsListView = Backbone.View.extend({
        initialize: function(options){
            this.options = options;

            assignedTags = [];

        },

        render : function(){
            this.$el.html("");
            if(this.options){
                _.each(this.options.currentTags,function(tag){
                      assignedTags.push(tag.id);
                });
            }
            if(this.options.display === undefined ){
               this.collection.forEach(this.addOne,this);
            }

            return this;
        },
        addOne: function(tag){
            if(this.options){
                var tagExists = _.find(this.options.currentTags,function(currentTag){
                return currentTag.id === tag.get('id');
            });
            tag.set({'selected':tagExists});
            }


            var tagView = new TagsView({model:tag});
            $(this.el).append(tagView.render().el);
            $(this.el).append('&nbsp;');

        }

    });


    var tags = new Tags();
    var tagsListView = null;
    tags.fetch({success:function(collection, response){
        var tagList = new TagsList(collection.attributes.results);
        tagsListView = new TagsListView({collection:tagList});

    }});
