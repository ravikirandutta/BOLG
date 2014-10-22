
(function() {
  var app = angular.module('takeAwayDashboard', ['duScroll','ngCookies', 'ngResource', 'ngRoute', 'ngDialog','ngTagsInput','ui.tinymce','ui.bootstrap','textAngular','mgcrea.ngStrap','ngAnimate']).run(function($http, $cookies) {

    $http.defaults.headers.common['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.common['Content-Type'] = "application/json";

    // $http.defaults.headers.DELETE['X-CSRFToken'] = $cookies.csrftoken;
  });
  app.config(['$resourceProvider',
    function($resourceProvider) {
      // Don't strip trailing slashes from calculated URLs
      $resourceProvider.defaults.stripTrailingSlashes = false;
    }
  ]);
  app.directive('takeawayDashboard', function() {
    return {
      restrict: 'E',
      templateUrl: '/static/takeaway/templates/takeAwayDashboard.html'
    }
  });

  app.directive('takeAway', function() {
    return {
      restrict: 'E',
      templateUrl: '/static/takeaway/templates/takeAway.html'
    }
  });

app.directive('session', function() {
    return {
      restrict: 'E',
      templateUrl: '/static/takeaway/templates/session.html'
    }
  });


  app.directive('publicPrivate', function() {
    return {
      restrict: 'A',
      require: '^ngModel',
      scope: { taset: '=', performPost : '@', courseId: '@', sessionId: '@'},
      templateUrl : '/static/takeaway/templates/publicPrivateButtonTemplate.html'
    }
  });


  app.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
      className: 'ngdialog-theme-default',
      plain: false,
      showClose: true,
      closeByDocument: true,
      closeByEscape: true,
      appendTo: false,
      preCloseCallback: function () {
        console.log('default pre-close callback');
      }
    });
  }]);

  app.factory('TakeAwayConverter',function(){
    var convert = function(taset){

      var tagIds = [];
      angular.forEach(taset.tags, function(tag){
          if(tag.id){
             tagIds.push(tag.id);
          }
      });
      var convertedTakeAwayObject = {
            id : taset.id,
            notes: taset.notes,
            //user: $cookies.userid,
            user: taset.user.id,
            courseInstance: taset.session.courseInstance,
            session: taset.session.id,
            is_public: taset.is_public,
            tags: tagIds,
            average_rating : taset.average_rating,
            total_raters: taset.total_raters
          };
      return convertedTakeAwayObject;
    };
    return {
      convert: convert
    }
  });

  app.factory('Comments', ['$resource',
    function($resource) {
      return $resource('/comments/', {}, {
        query: {
          method: 'GET',
          isArray: false
        },
        save: {
          method: 'POST'
        },
        edit: {
          url: '/comments/:id/',
          method: 'PUT'
        }
      });
    }
  ]);


  app.factory('CoursesFactory', ['$resource',
    function($resource) {
      return $resource('/courseInstances/', {}, {
        query: {
          method: 'GET',
          isArray: false
        },
        save: {
          method: 'POST'
        }
      });
    }
  ]);

  app.factory('SessionsFactory', ['$resource',
    function($resource) {
      return $resource('/sessions/', {}, {
        query: {
          method: 'GET',
          isArray: false
        },
        save: {
          method: 'POST'
        },
        edit: {
          url: '/sessions/:id/',
          method: 'PUT'
        }
      });
    }
  ]);

  app.factory('TakeAwayFactory', ['$resource',
    function($resource) {
      return $resource('/takeaways/', {}, {
        query: {
          method: 'GET',
          isArray: false
        },
        save: {
          method: 'POST'
        },
        update: {
          url: '/takeaways/:id/',
          method: 'PUT'
        },
        remove: {
          url: '/takeaways/:id/',
          method: 'DELETE'
        }
      });
    }
  ]);

  app.factory('RatingFactory', ['$resource',
    function($resource) {
      return $resource('/ratings/', {}, {
        query: {
          method: 'GET',
          isArray: false
        },
        save: {
          method: 'POST'
        }
      });
    }
  ]);

  app.factory('FavoritesFactory', ['$resource',
    function($resource) {
      return $resource('/favorites/', {}, {
        query: {
          method: 'GET',
          isArray: false
        },
         save: {
          method: 'POST'
        },
        remove: {
          url: '/favorites/:id/',
          method: 'DELETE'
        }
      });
    }
  ]);

app.factory('TagsFactory', ['$resource',
    function($resource) {
      return $resource('/tags/', {}, {
        query: {
          method: 'GET',
          isArray: false
        },
         save: {
          method: 'POST'
        }
      });
    }
  ]);
app.factory('UserPermission',['$resource',function($resource){
        return $resource('/can_user_post/',{},{
            query: {method:'GET',isArray:false},
        })
    }]);
app.factory('LeaderboardFactory',['$resource',function($resource){
        return $resource('/get_leader_board/',{},{
          query: {method:'GET',isArray:false},
        })
}]);
app.factory('GroupsFactory',['$resource',function($resource){
        return $resource('/closedGroups/',{},{
          query: {method:'GET',isArray:false},
        })
}]);


app.factory('CriteriaService',function(){
          var criteria = {};
          return {
              getCriteria : function(){
                  return criteria;
              },
              setTagSearchCriteria : function(criteriaObject){


                   if(!criteria.tagSearch){
                      criteria.tagSearch = [];
                   }
                   criteria.tagSearch.push(criteriaObject.value);

                 },
              toggleFavoriteCriteria : function(){
                  /*if(criteriaObject.searchTerm === "textSearch")
                    criteria.searchTerm = criteriaObject.value;
                  */
                  criteria.filterFavorites = !criteria.filterFavorites;
              } ,

              removeTagFromSearchCriteria : function(tagToBeRemoved){

                   if(criteria.tagSearch){
                       var index = criteria.tagSearch.indexOf(tagToBeRemoved);
                       criteria.tagSearch.splice(index, index+1);
                   }
          }
        }
        });

app.factory('CourseDataFactory',function(){

  var defaultCourseSet = false;
  var data = [];
  var currentCourseInstance ;
 var service = {};
   service.setCurrentCourse = function(course){
       currentCourseInstance = course;
  };

   service.setUserCanPost= function(course, userCanPost){
         if (!data[course]){
            data[course] = {};
         }
         data[course].userCanPost=userCanPost;
      };
    service.setUserPermissionDetail = function(course, userPermissionDetail){
         if (!data[course]){
            data[course] = {};
         }
         data[course].userPermissionDetail = {};
         data[course].userPermissionDetail.remaining_rating_count_till_create = userPermissionDetail.remaining_rating_count_till_create;
      };

   service.decrementRatingCountNeededToCreateTakeaway = function(){
      data[currentCourseInstance].userPermissionDetail.remaining_rating_count_till_create =  data[currentCourseInstance].userPermissionDetail.remaining_rating_count_till_create -1;
   };


  service.getCurrentCourse = function(){
      return currentCourseInstance;
  };
      service.findIfUserCanPost= function(currentCourse){
        return !(data[currentCourse].userPermissionDetail.remaining_rating_count_till_create > 0);
      };
      service.findUserPermissionDetail = function(currentCourse){
        return data[currentCourse].userPermissionDetail;
      };

      service.setDefaultCourse = function(){
          defaultCourseSet = true;
      }
      service.getDefaultCourse = function(){
          return defaultCourseSet
      }
 return service;

});

app.factory('SessionsDataFactory',function(TagsDataFactory, TagsFactory, $cookies, $location, $timeout,$anchorScroll,$document){

  var sessionsData = {};

  return {

    setSessionData: function(sessions){
        sessionData = sessions.results;
    },

    getSessionData: function(){
        return sessionData;
    },

    addTakeAwayToSessions: function(takeaway){



            var tags = [];
          angular.forEach(takeaway.tags, function(tag){
              var tagForId = TagsDataFactory.getTagForId(tag);
              tags.push(tagForId);
          });
          takeaway.tags = tags;

          angular.forEach(sessionData, function(session){
              if(session.id === takeaway.session){
                takeaway.isOwner = true;
                takeaway.courseInstance = {};
                takeaway.courseInstance.id = session.courseInstance.id;
                takeaway.session = {};
                takeaway.session.id= session.id;
                takeaway.session.courseInstance = session.courseInstance.id;
                takeaway.user = {};
                takeaway.user.id = $cookies.userid;
                var localizedTime = $.localtime.toLocalTime(takeaway.created_dt,'MM/dd/yy HH:mm');
                takeaway.created_dt = localizedTime;
                session.takeaway_set.push(takeaway);
              }
          });


    $timeout(function(){
      var container = angular.element(document.getElementById('takeaway-container'));
      var section2 = angular.element(document.getElementById(takeaway.id));
      //container.scrollTo(section2, 0, 1000);
      $document.scrollToElementAnimated(section2, 100);
    }, 500);





    },

    removeTakeawayFromSessions: function(takeaway){
          angular.forEach(sessionData, function(session){
              if(session.id === takeaway.session.id){
                  var index =0;
                  angular.forEach(session.takeaway_set, function(takeawayObject){
                      if(takeaway.id === takeawayObject.id){
                          session.takeaway_set.splice(index, index+1);
                      }
                      index++;
                  });
              }
          });
    }

  }

});


app.factory('TagsDataFactory', function(TagsFactory){
      var tagsData = [];


      return {

        getTagForId : function(id){
          var tagFound;
          angular.forEach(tagsData, function(tag){
              if(tag.id ===id){
                  tagFound = tag;
              }
          });
          return tagFound;
        },
        setTags: function(tagsData){
            tagsData = tagsData;
        },
        addTag: function(tag){
          tagsData.push(tag.toJSON());
        },
         getTags : function(){
            TagsFactory.query().$promise.then(function(data){
                tagsData = data.results;
            },
        function(){});
         }
      }
});

app.controller('FavoriteController',function($scope,$cookies, FavoritesFactory, CriteriaService ){
  $scope.makeFavourite = function(taset) {

      if(taset.isFavourite) {
        //DELTE
        FavoritesFactory.remove({id:taset.favoriteId})
        .$promise.then(function(data, status, headers, config) {
          taset.isFavourite = false;
        },function(data, status, headers, config) {
          console.error('Error in makeFavourite'+status);
        });
      } else {
        var favObj = {
          courseInstance: taset.courseInstance.id,
          takeaway: taset.id,
          user: $cookies.userid
        };

       FavoritesFactory.save(favObj).$promise.then(function(data, status, headers, config) {
          taset.isFavourite = true;
          taset.favoriteId = data.id;

        },function(data, status, headers, config) {
          console.error('Error in makeFavourite'+status);
        });
      }

    };

  $scope.filterFavorites = function(){
      CriteriaService.toggleFavoriteCriteria();
  };

});


app.controller('CourseController', function ($scope,ngDialog, UserPermission,CourseDataFactory) {


      $scope.highLightSelectedCourse = function(courseid) {
      _.each($scope.availableCourses.results,function(courseObj){
        if(courseObj.id == courseid) {
          courseObj["courseClass"] = "course-selected";
        } else {
          courseObj["courseClass"] = "course-deselected";
        }
      });

    };

    $scope.getUserPermission = function(courseId){
      UserPermission.query({'course_id':courseId}).$promise.then(
        function(data){
        CourseDataFactory.setUserCanPost(courseId,data.can_post);
        CourseDataFactory.setUserPermissionDetail(courseId, data);
        $scope.userCanPost=data.can_post;
        $scope.userPermisssionDetail=data;
      }, function(data){

      });
    };

    $scope.freshLoadOfSessions = function(){
      //$scope.displaysessions = false;
      var courseid = $scope.courseInstance.id;
      $scope.loadCourses(courseid);
      $scope.highLightSelectedCourse(courseid);
      $scope.getUserPermission(courseid);
      $scope.getLeaderBoard(courseid);
    };

    $scope.getDisplayedCourse = function(){
      return CourseDataFactory.getCurrentCourse();
    }

    $scope.isCurrentCourseSelected = function(){
      return $scope.courseInstance.id==CourseDataFactory.getCurrentCourse();
    };


    angular.element(document).ready(function () {
        if (!CourseDataFactory.getDefaultCourse()){
          $scope.freshLoadOfSessions();
          CourseDataFactory.setDefaultCourse();
        }

    });


});

 app.controller('SessionController', function ($scope,ngDialog,CourseDataFactory) {

  $scope.editSessionName = function (sessionsresult) {

      $scope.session_name_current = $scope.sessionsresult.session_name;
      $scope.courseInstanceId = $scope.sessionsresult.courseInstance.id;
      $scope.modifiedSession = {
        id:0,
        session_name : "",
        session_dt : ""
      };

      $scope.modifiedSession.id = $scope.sessionsresult.id;
      $scope.modifiedSession.session_name = $scope.sessionsresult.session_name;
      $scope.modifiedSession.session_dt = $scope.sessionsresult.session_dt;



      ngDialog.open({
        template: 'editSessionNameTemplateId',
        controller: 'takeawayDashboardCtrl',
        className: 'ngdialog-theme-plain',
        scope: $scope
      });
    };


    $scope.newTakeaway = function () {

      $scope.taset = {is_public : true, tags:[]};
      var currentCourse = CourseDataFactory.getCurrentCourse();
      var userCanPost = CourseDataFactory.findIfUserCanPost(currentCourse);
      $scope.userPermissionDetail = CourseDataFactory.findUserPermissionDetail(currentCourse);
      //$scope.takeaway_set = sessionsresult.takeaway_set[0];
      if(userCanPost){//
      ngDialog.open({
        template: 'newTakeawayTemplateId',
        controller: 'takeawayDashboardCtrl',
        className: 'ngdialog-theme-plain',
        scope: $scope
      });
    }else{
      ngDialog.open({
        template: 'cantCreateTakeawayTemplateId',
        //need to switch the below controller to CourseController instead of takeawayDashboard
        controller: 'takeawayDashboardCtrl',
        className: 'ngdialog-theme-plain',
        scope: $scope
      });
    }

    };


 });



 app.controller('TakeAwayController', function ($scope,$sce,$cookies, TakeAwayFactory, RatingFactory,
                                                FavoritesFactory,TakeAwayConverter, ngDialog, SessionsDataFactory, CourseDataFactory) {

  $scope.makeEditable = function(divId, notes) {
      document.getElementById(divId + "_view").style.display = "none";
      document.getElementById(divId + "_edit").style.display = "block";
      document.getElementById(divId + "_notes").value = notes;
    };

   $scope.deleteTakeaway = function(sessionsresult, taset) {
      var msg = "Are you sure you want to delete the take away notes?"
      if(window.confirm(msg)) {

        TakeAwayFactory.remove({id:taset.id}).$promise.then(
            function(data, status, headers, config) {
      SessionsDataFactory.removeTakeawayFromSessions(taset);

          console.log('Takeaway Successfully deleted, now refresh the page');
          //$scope.freshLoadOfSessions(taset.courseInstance.id);
        },
        function(data, status, headers, config) {
          $scope.status = status;
          console.error('Error in deleteTakeaway'+status);
        });
      }
    };

   $scope.rated = function(id, rating, alreadyRated){
      if(!alreadyRated)
        {
           RatingFactory.save({takeaway:id,rating_value:rating,user:$cookies.userid}).$promise.then(function(){

            CourseDataFactory.decrementRatingCountNeededToCreateTakeaway();
           },function(){});
        }
  };


  $scope.getSafe = function(unsafeHtml){

    return $sce.trustAsHtml(unsafeHtml);

  };

   $scope.updateTakeaway = function(divId, taset) {
      document.getElementById(divId + "_view").style.display = "block";
      document.getElementById(divId + "_edit").style.display = "none";
      var tagIds = [];
      angular.forEach(taset.tags, function(tag){
          if(tag.id){
             tagIds.push(tag.id);
          }
      });


      var modifiedTakeawayObj = TakeAwayConverter.convert(taset);
       modifiedTakeawayObj.notes = document.getElementById(divId + "_notes").value;

      console.log(JSON.stringify(modifiedTakeawayObj));

          TakeAwayFactory.update({id:taset.id},modifiedTakeawayObj).$promise
          .then(function(data, status, headers, config) {
        //We need refresh only updated takeaway instead of loading all courses sessions
        //$scope.freshLoadOfSessions(taset.courseInstance.id);
        console.log("loading all courses sessions after successfull edit");
      },function(data, status, headers, config) {
        $scope.status = status;
      });
  };

   $scope.cancelEdit = function(divId) {
      document.getElementById(divId + "_view").style.display = "block";
      document.getElementById(divId + "_edit").style.display = "none";
      document.getElementById(divId + "_notes").value = "";
    };


 });


  app.controller('takeawayDashboardCtrl',
    function($scope, $http, $cookies, $q, $resource, $sce, $rootScope,
     LeaderboardFactory, UserPermission, CoursesFactory, SessionsFactory, ngDialog,TakeAwayFactory,
      RatingFactory, FavoritesFactory, TagsFactory, TakeAwayConverter, CourseDataFactory,CriteriaService,SessionsDataFactory, TagsDataFactory) {

    console.log("loading takeawayDashboardCtrl");
    $scope.rate = 7;
    $scope.availableCourses = {};
    $scope.sessions = {
      "results": []
    };

    $scope.userPermisssionDetail={};
    $scope.userCanPost = false;
    $scope.leaderBoard = {};



  $scope.ratingStates = [

    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];

  $scope.criteria = {};
  $scope.criteria.searchText ;
  $scope.selectedTags = [];
  $scope.clearCriteria = function(){
    CriteriaService.setCriteria({});
  };
  $scope.criteriaMatch = function(  ) {
    $scope.criteria = CriteriaService.getCriteria();
    var criteria = $scope.criteria;


        return  function( takeaway) {
          var favorite = true, tags = true, textSearch = true;
          if(criteria.filterFavorites){
            var favorite = takeaway.isFavourite;
          }

          var count =0;
          if(criteria.tagSearch){
            angular.forEach(takeaway.tags, function(tag){

              angular.forEach(criteria.tagSearch, function(tagSearch){

                if(tag.name === tagSearch){
                count++;
              }
              });
              });
            tags = (count === criteria.tagSearch.length);
          };

          if(criteria.searchText){
            textSearch = takeaway.notes.indexOf(criteria.searchText)>-1;
          }

     return favorite && tags && textSearch;
   }

  };


    CoursesFactory.query({
      "students": $cookies.userid
    }).$promise.then(function(data) {
      console.log("First load of the page load the all available CRS");
      $scope.availableCourses = data;

      $scope.courseInstance = data[0];

      //Displaying the STAYs for first CRS
      // if($scope.availableCourses.results != null && $scope.availableCourses.results.length > 0) {
      //   var defaultCourseId = $scope.availableCourses.results[0].course.id;
      //   $scope.freshLoadOfSessions(defaultCourseId);
      // }
    });

    $scope.getLeaderBoard = function(courseId){
      LeaderboardFactory.query({'course_id':courseId},function(data){
        $scope.leaderBoard = data.points;
      })
    };

    $scope.highLightSelectedCourse = function(courseid) {
      _.each($scope.availableCourses.results,function(courseObj){
        if(courseObj.id == courseid) {
          courseObj["courseClass"] = "course-selected";
        } else {
          courseObj["courseClass"] = "course-deselected";
        }
      });

    };


    $scope.showLeaderBoard = function () {

      ngDialog.open({
        template: 'courseLeaderBoardTemplateId',
        controller: 'CourseController',
        className: 'ngdialog-theme-plain',
        scope: $scope
      });

    };



    // On Click of CRS, load all SNs and TAYs associated with the CRS.
    $scope.loadCourses = function(courseid) {
      CourseDataFactory.setCurrentCourse(courseid);
     // if($scope.displaysessions != true) {
        SessionsFactory.query({
          "courseInstance": courseid,
          "ordering": "session_dt"
        }).$promise.then(function(data) {
          console.log("Load all SNs and TAYs associated with the CRS");
          //alert("Load all SNs and TAYs associated with the CRS");
          $scope.sessions = data;
          $scope.displaysessions = true;
          //alert(JSON.stringify($scope.sessions.results));
          $scope.postzpulateOtherFields(courseid);
        });
      //}
    };

    $scope.postzpulateOtherFields = function(courseid) {
      var ratingsMap= {};

      $scope.ratings = {};
      $scope.favList = {};

      FavoritesFactory.get({user:$cookies.userid, courseInstance:courseid}).$promise.then(
          function(data, status, headers, config) {
        $scope.favList = data.results;
        _.each($scope.sessions.results,function(sessionsresult){
          _.each(sessionsresult.takeaway_set,function(taset){
            taset["isFavourite"]=false;
            _.each($scope.favList,function(fav){
              //console.log(JSON.stringify(fav));
              //console.log(fav.takeaway);
              if(fav.takeaway == taset.id) {
                taset["isFavourite"]=true;
                taset["favoriteId"] = fav.id;
              }
            });
          });
        });
        console.log("Getting Favorites values for all takeaways"+JSON.stringify($scope.favList));
      },
      function(data, status, headers, config) {
        $scope.status = status;
      });


RatingFactory.get({user:$cookies.userid}).$promise.then(
    function(data, status, headers, config) {
        $scope.ratings = data.results;

        _.each($scope.ratings,function(rating){
          ratingsMap[rating.takeaway]=rating.rating_value;
        });

        _.each($scope.sessions.results,function(sessionsresult){
        _.each(sessionsresult.takeaway_set,function(taset){
            taset["alreadyRated"]=false;
            if(ratingsMap[taset.id]>-1){
              taset["rating"]=ratingsMap[taset.id];
              taset.average_rating =ratingsMap[taset.id];
              taset["alreadyRated"]=true;
            }
          });
        });
        console.log("Getting rating values for all takeaways"+JSON.stringify($scope.ratings));
      },

      function(data, status, headers, config) {
        $scope.status = status;
      }
  );

      _.each($scope.sessions.results,function(sessionsresult){
        _.each(sessionsresult.takeaway_set,function(taset){

          var localizedTime = $.localtime.toLocalTime(taset.created_dt,'MM/dd/yy HH:mm');
          taset.created_dt =localizedTime;

          taset["isOwner"]=false;
          if($cookies.userid == taset.user.id) {
            taset["isOwner"] = true;
          }
        });
      });


      SessionsDataFactory.setSessionData($scope.sessions);
      //alert("done"+$scope.sessions.results.length);
      TagsDataFactory.getTags();


      $scope.sessionsData = SessionsDataFactory.getSessionData();
    }



    /* Update/Edit the takeaway and reload the page / refresh the takeaway part */
    /* PUT: /takeaways/:takeawayID/ */

    /*Deleting selected TAY by passing the ID */
    /*TODO: confirmation dialog before delete */
    /*DELETE: /takeaways/:id/ */


    /* Displaying Dialog window to create New Take Away */


    /* Event from "Save" button from New Take Away dialog window */
    $scope.saveTakeaway = function() {
      var tagIds =[];
      angular.forEach($scope.taset.tags, function(tag){
            if(tag.id){
              tagIds.push(tag.id);
            }
      });

      $scope.newTakeawayObj = {
        courseInstance: $scope.sessionsresult.courseInstance.id,
        is_public: $scope.taset.is_public,
        notes: $scope.newTakeawayContent,
        session: $scope.sessionsresult.id,
        tags: tagIds,
        user: $cookies.userid
      };

      console.log('New Takeaway JSON: '+JSON.stringify($scope.newTakeawayObj));

      TakeAwayFactory.save($scope.newTakeawayObj).$promise.then(
      function(data, status, headers, config) {
        SessionsDataFactory.addTakeAwayToSessions(data);
        $scope.newTakeawayContent="";
        console.log("loading all courses sessions after successfull creation"+data.courseInstance);
      },
      function(data, status, headers, config) {
        $scope.status = status;
        console.error('Error in saveTakeaway'+status);
      });

      ngDialog.close();
    };


    /* Displaying Dialog window to update the session name */

    /* Event from "Update" button from editSessionName dialog window */
    /* PUT: /sessions/:sessionId */
    $scope.updateSessionName = function(modifiedSession,sessionsresult) {
      console.log(JSON.stringify(modifiedSession));

      SessionsFactory.edit({id:modifiedSession.id},modifiedSession).$promise.then(
        function (data, status, headers, config) {
          //$scope.freshLoadOfSessions($scope.courseInstanceId);
          console.log("Successfully updated session name");
          sessionsresult.session_name = modifiedSession.session_name;
        },function (data, status, headers, config) {
          console.error('Error in updateSessionName'+status);
      });
      ngDialog.close();
    };

    /* Close the dialog for "New Takeaway" and "Edit Session Name" dialogs */
    $scope.closeDialog = function() {
      ngDialog.close();
      $scope.newTakeawayContent="";
    };


  });



app.controller('TagController', function ($scope,$q, TagsFactory,CriteriaService, TagsDataFactory) {

   $scope.tags = [];
  $scope.availableTags = {};

   $scope.loadTags = function(query) {
      var deferred = $q.defer();

       TagsFactory.query({"starts_with":query}).$promise.then(function(data){
          deferred.resolve(data.results);
       });
      return deferred.promise;
  };



$scope.tagSearch = function(){
    $scope.selectedTags.push($scope.tag.name);
     CriteriaService.setTagSearchCriteria({searchTerm:'tagSearch',value:$scope.tag.name});
};

$scope.removeTagFromSearchCriteria = function(){
  var index = $scope.selectedTags.indexOf($scope.tag);
  $scope.selectedTags.splice(index, index+1);
  CriteriaService.removeTagFromSearchCriteria($scope.tag);
};

$scope.tagAdded = function(tag){
      if(!tag.id){
        TagsFactory.query({"name":tag.name}).$promise.then(function(data){
            if(data.count ==1){
              var length = $scope.tags.length;
              $scope.taset.tags.splice(length-1,1);
              $scope.taset.tags.push(data.results[0]);
            }else{
                TagsFactory.save({"name":tag.name}).$promise.then(function(data){
                    TagsDataFactory.addTag(data);
                    var length = $scope.tags.length;
                    $scope.taset.tags.splice(length-1,1);

                    $scope.taset.tags.push(data);

                });
            }
        });
      }else{
              var length = $scope.tags.length;
              if($scope.taset.tags){
                $scope.taset.tags.splice(length-1,1);
              }else{
                $scope.taset.tags = [];
              }
              $scope.taset.tags.push(tag);
      }
      //$scope.taset.tags = $scope.tags;
  };



});

app.controller('RatingDemoCtrl', function ($scope) {

});


app.controller('publicPrivateButtonCtrl',
    function($scope, $http, $cookies, $resource, $rootScope,TakeAwayFactory, CourseDataFactory, TakeAwayConverter, GroupsFactory) {

      $scope.groups={};
      $scope.courseInstanceId=CourseDataFactory.getCurrentCourse();
      GroupsFactory.query({'course_instance':$scope.courseInstanceId,'members':$cookies.userid}).$promise.then(function(data){

        $scope.groups=data.results; 
      });

      if($scope.taset.is_public){
        $scope.visibility = "everyone";
      }else{
        $scope.visibility = "me";
      }

      $scope.hello=function(){
        console.log("FF");
      }

    /*Public private buttons method */
    $scope.toggleButtons = function(postImmediately) {
      if ($scope.visibility == "me") {
        $scope.taset.is_public = false;
      } else if($scope.visibility=="everyone"){
        $scope.taset.is_public = true;
      } else{
        $scope.taset.is_public = false;
      }

      taset = $scope.taset;
      //From Edit takeaway or New Takeaway, onchange of public-private option do not make service call to update.
      if(postImmediately == true || postImmediately == 'true') {
          var tagIdArr = new Array();
          _.each(taset.tags,function(tagId){
              tagIdArr.push(tagId.id);
          });

          var modifiedTakeawayObj = TakeAwayConverter.convert(taset);


          TakeAwayFactory.update({id:taset.id},modifiedTakeawayObj).$promise
          .then(function(data, status, headers, config) {
            console.log("Successfully updated public flag in server");
          },function(data, status, headers, config) {
            $scope.status = status;
        });

        }
    };

    });


  app.controller('CollapseCommentsCtrl', function ($scope,$cookies,Comments) {
  $scope.isCollapsed = true;

    $scope.displayComments = function(taset) {

      if($scope.isCollapsed){
        $scope.loadComments(taset, false);
      }else{
        $scope.isCollapsed = !$scope.isCollapsed;
      }
    };

    $scope.loadComments = function(taset, isRefresh) {

        Comments.query({
          "takeaway": taset.id
        }).$promise.then(function(data) {
          $scope.comments = data.results;
          if(!isRefresh){
            $scope.isCollapsed = !$scope.isCollapsed;
          }

        });

    };

    $scope.saveComment = function(taset) {
      Comments.save({takeaway:taset.id,notes:$scope.myComment,user:$cookies.userid,tags:[1],vote_count:0,average_rating:0,total_raters:0})
              .$promise.then(function(data) {
                  $scope.myComment = null;
                  $scope.loadComments(taset, true);
            });

    };

  });


})();

