    var Notifications = Backbone.Model.extend({
        urlRoot:'/notifications'
      });

  	var NotificationsList = Backbone.Collection.extend({
            model: Notifications
    });



  	var NotificationsView = Backbone.View.extend({
        template:_.template('<li><a href="#"><%=verb%></a><span class="label label-important pull-right">New</span><p><%=description%></p><hr /></li>'),
        render : function(){
          	this.$el.append(this.template(this.model.toJSON()));
            return this;
        },

        events:{"click a":"notificationClick"},
        notificationClick:function(){
        	this.model.save({'unread':'False'}, {success :function(model, response){
                 reloadNotifications();
            }});
        }
  	});

    var NotificationsListView = Backbone.View.extend({
        initialize: function(options){
        },
        render : function(){
            this.$el.html("<a id='markAllAsRead' href='#''>Mark all as read</a>");

			this.collection.forEach(this.addOne,this);

            return this;
        },
        events:{"click #markAllAsRead":"markAllAsRead"},
        addOne: function(notification){

            var notificationView = new NotificationsView({model:notification});
            $(this.el).append(notificationView.render().el);
            //$(this.el).append('&nbsp;');

        },
        markAllAsRead : function(){
           if(this.collection.models != null){
               _.each(this.collection.models,function(item){
                    item.save({'unread':'False'}, {success :function(model, response){
                    }});
                });
               reloadNotifications();

            }
        }

    });      



    function reloadNotifications(){
        notifications.fetch({data: {recipient: $.cookie('userid'), unread:'True'},success:function(collection, response){
            var notificationsList = new NotificationsList(collection.attributes.results);
            notificationsListView = new NotificationsListView({collection:notificationsList});
            
            $('#notifications-list').html(notificationsListView.render().el);
            $('#inboxSize').html(notificationsList.length);
            
        }});

    }
    var notifications = new Notifications({urlRoot:'/notifications'});
    var notificationsListView = null;
    reloadNotifications();

