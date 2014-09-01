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

            var notificationsGroupedByDesc = _.groupBy(collection.attributes.results, function(notification){ 
                return notification.description; 
            });

            var courseNames = _.uniq(_.pluck(collection.attributes.results, 'description'));
            

            
            var customNotificationsList = [];


            for(var i=0; i<courseNames.length; i++){
                var customNotifications = new CustomNotifications();
                var courseName = courseNames[i];
                var usernames = _.uniq(_.pluck(notificationsGroupedByDesc[courseName], 'actor_username'));
            
                var count = 0;
                var message = _.reduce(usernames, function(msg, name){
                        count = count + 1;
                        if(count > 3){
                            return msg + " and others ";
                        }else{
                            if(count == 1){
                                return name;
                            }else{
                                return msg + ","+name;
                            }
                        }
                        
                    }, "");

                customNotifications.description = message + " posted takeaways on course " + courseName;
                customNotifications.courseName = courseName;
                customNotifications.originalNotificationsModel  = notificationsGroupedByDesc[courseName];
                customNotifications.verb = "New Takeaways";
                
                customNotificationsList.push(customNotifications);
            }


            
            

            var customnotificationsListResults = new CustomNotificationsList(customNotificationsList);
            

            notificationsListView = new CustomNotificationsListView({collection:customnotificationsListResults});
            
            $('#notifications-list').html(notificationsListView.render().el);
            $('#inboxSize').html(customnotificationsListResults.length);
            
        }});

    }
    var notifications = new Notifications({urlRoot:'/notifications'});
    var notificationsListView = null;
    reloadNotifications();


    var CustomNotifications = Backbone.Model.extend({
        originalNotificationsModel : null,
        courseName : null,
        description : null,
        verb : null,
        
    });

    var CustomNotificationsList = Backbone.Collection.extend({
            model: CustomNotifications
    });

    var CustomNotificationsView = Backbone.View.extend({
        template:_.template('<li><a href="#"><%=verb%></a><span class="label label-important pull-right">New</span><p><%=description%></p><hr /></li>'),
        render : function(){
            var jsonStr = {};
            jsonStr.verb = this.model.verb;
            jsonStr.description = this.model.description;

            this.$el.append(this.template(jsonStr));
            return this;
        },

        events:{"click a":"notificationClick"},
        notificationClick:function(){

            _.each(this.model.originalNotificationsModel, function(actualNotiModel){
                var actualNotificationModel = new Notifications();
                actualNotificationModel.set(actualNotiModel);
                actualNotificationModel.save({'unread':'False'}, {success :function(model, response){
                }});

            });
            reloadNotifications();
        }
    });

    var CustomNotificationsListView = Backbone.View.extend({
        initialize: function(options){
        },
        render : function(){
            
            //this.$el.html("<a id='markAllAsRead' href='#''>Mark all as read</a>");
            this.collection.forEach(this.addOne,this);

            return this;
        },
        events:{"click #markAllAsRead":"markAllAsRead"},
        addOne: function(notification){
            var notificationView = new CustomNotificationsView({model:notification});
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