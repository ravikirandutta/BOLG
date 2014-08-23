    var Notifications = Backbone.Model.extend({
        urlRoot:'/notifications'
      });

  	var NotificationsList = Backbone.Collection.extend({
            model: Notifications
    });



  	var NotificationsView = Backbone.View.extend({
        template:_.template('<li><a href="#"><%=verb%></a><p><%=description%></p><hr /></li>'),
        render : function(){
          	this.$el.append(this.template(this.model.toJSON()));
            return this;
        },

        events:{"click a":"notificationClick"},
        notificationClick:function(){
        	this.model.set({'unread':'False'});
        	this.model.save();
        }
  	});

    var NotificationsListView = Backbone.View.extend({
        initialize: function(options){
        },

        render : function(){
            this.$el.html("");

			this.collection.forEach(this.addOne,this);

            return this;
        },
        addOne: function(notification){

            var notificationView = new NotificationsView({model:notification});
            $(this.el).append(notificationView.render().el);
            //$(this.el).append('&nbsp;');

        }

    });      


    var notifications = new Notifications({urlRoot:'/notifications'});
    var notificationsListView = null;
    notifications.fetch({data: {recipient: $.cookie('userid'), unread:'True'},success:function(collection, response){
        var notificationsList = new NotificationsList(collection.attributes.results);
        notificationsListView = new NotificationsListView({collection:notificationsList});
        $('#notifications-list').append(notificationsListView.render().el);
        $('#inboxSize').append(notificationsList.length);
    }});

