
(function() {
  var app = angular.module('takeAwayDashboard', ['ngCookies', 'ngResource', 'ngRoute', 'ngDialog','ngTagsInput','ui.tinymce','ui.bootstrap']).run(function($http, $cookies) {

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
          url: '/favorites/:id',
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



app.controller('RatingDemoCtrl', function ($scope) {

});




  app.controller('takeawayDashboardCtrl',
    function($scope, $http, $cookies, $q, $resource, $sce, $rootScope, UserPermission, CoursesFactory, SessionsFactory, ngDialog,TakeAwayFactory, RatingFactory, FavoritesFactory, TagsFactory, TakeAwayConverter) {

    console.log("loading takeawayDashboardCtrl");
    $scope.rate = 7;
    $scope.availableCourses = {};
    $scope.sessions = {
      "results": []
    };
    $scope.userCanPost = false;

    //ngTags

  // TagsFactory.query().$promise.then(function(data){
  //     $scope.availableTags = data.results;
  //    });

//  rating widget



  $scope.ratingStates = [

    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];


$scope.rated = function(id, rating, alreadyRated){
  if(!alreadyRated)
{
       RatingFactory.save({takeaway:id,rating_value:rating,user:$cookies.userid});
}
};


  $scope.getSafe = function(unsafeHtml){

    return $sce.trustAsHtml(unsafeHtml);

  };




    CoursesFactory.query({
      "students": $cookies.userid
    }).$promise.then(function(data) {
      console.log("First load of the page load the all available CRS");
      $scope.availableCourses = data;

      //Displaying the STAYs for first CRS
      if($scope.availableCourses.results != null && $scope.availableCourses.results.length > 0) {
        var defaultCourseId = $scope.availableCourses.results[0].course.id;
        $scope.freshLoadOfSessions(defaultCourseId);
      }
    });

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
      UserPermission.query({'course_id':courseId},function(data){
        $scope.userCanPost=data.can_post;
      })
    }

    $scope.freshLoadOfSessions = function(courseid){
      $scope.displaysessions = false;
      $scope.loadCourses(courseid);
      $scope.highLightSelectedCourse(courseid);
      $scope.getUserPermission(courseid);
    };

    // On Click of CRS, load all SNs and TAYs associated with the CRS.
    $scope.loadCourses = function(courseid) {
      if($scope.displaysessions != true) {
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
      }
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
              }
            });
          });
        });
        console.log("Getting Favorites values for all takeaways"+JSON.stringify($scope.favList));
      },
      function(data, status, headers, config) {
        $scope.status = status;
      });

      /*
      $http({
        url: '/favorites/?user='+$cookies.userid+'&courseInstance='+courseid,
        method: "GET",
      }).success(function(data, status, headers, config) {
        $scope.favList = data.results;
        _.each($scope.sessions.results,function(sessionsresult){
          _.each(sessionsresult.takeaway_set,function(taset){
            taset["isFavourite"]=false;
            _.each($scope.favList,function(fav){
              //console.log(JSON.stringify(fav));
              //console.log(fav.takeaway);
              if(fav.takeaway == taset.id) {
                taset["isFavourite"]=true;
              }
            });
          });
        });
        console.log("Getting Favorites values for all takeaways"+JSON.stringify($scope.favList));
      }).error(function(data, status, headers, config) {
        $scope.status = status;
      });

*/

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
/*
      $http({
        url: '/ratings/?user='+$cookies.userid,
        method: "GET",
      }).success(function(data, status, headers, config) {
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
      }).error(function(data, status, headers, config) {
        $scope.status = status;
      });
*/

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


      //alert("done"+$scope.sessions.results.length);
    }

    $scope.makeEditable = function(divId, notes) {
      document.getElementById(divId + "_view").style.display = "none";
      document.getElementById(divId + "_edit").style.display = "block";
      document.getElementById(divId + "_notes").value = notes;
    }

    /* Update/Edit the takeaway and reload the page / refresh the takeaway part */
    /* PUT: /takeaways/:takeawayID/ */
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
      // {
      //   id : taset.id,
      //   notes: document.getElementById(divId + "_notes").value,
      //   user: $cookies.userid,
      //   courseInstance: taset.courseInstance.id,
      //   session: taset.session.id,
      //   is_public: taset.is_public,
      //   username : $cookies.username,
      //   tags: tagIds,
      //   created_dt : taset.created_dt,
      //   average_rating : taset.average_rating,
      //   total_raters : taset.total_raters
      // };
       modifiedTakeawayObj.notes = document.getElementById(divId + "_notes").value;

      console.log(JSON.stringify(modifiedTakeawayObj));

          TakeAwayFactory.update({id:taset.id},modifiedTakeawayObj).$promise
          .then(function(data, status, headers, config) {
        //We need refresh only updated takeaway instead of loading all courses sessions
        $scope.freshLoadOfSessions(taset.courseInstance.id);
        console.log("loading all courses sessions after successfull edit");
      },function(data, status, headers, config) {
        $scope.status = status;
      });
  }
/*
      $http({
        url: '/takeaways/' + taset.id+"/",
        method: "PUT",
        data: modifiedTakeawayObj,
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(data, status, headers, config) {
        //We need refresh only updated takeaway instead of loading all courses sessions
        $scope.freshLoadOfSessions(taset.courseInstance.id);
        console.log("loading all courses sessions after successfull edit");
      }).error(function(data, status, headers, config) {
        $scope.status = status;
      });
    };

*/
    $scope.cancelEdit = function(divId) {
      document.getElementById(divId + "_view").style.display = "block";
      document.getElementById(divId + "_edit").style.display = "none";
      document.getElementById(divId + "_notes").value = "";
    };

    /*Deleting selected TAY by passing the ID */
    /*TODO: confirmation dialog before delete */
    /*DELETE: /takeaways/:id/ */
    $scope.deleteTakeaway = function(sessionsresult, taset) {
      var msg = "Are you sure you want to delete the take away notes?"
      if(window.confirm(msg)) {

        TakeAwayFactory.remove({id:taset.id}).$promise.then(
            function(data, status, headers, config) {
          console.log('Takeaway Successfully deleted, now refresh the page');
          $scope.freshLoadOfSessions(taset.courseInstance.id);
        },
        function(data, status, headers, config) {
          $scope.status = status;
          console.error('Error in deleteTakeaway'+status);
        });


        /*
        $http({
        url: '/takeaways/' + taset.id,
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
        }).success(function(data, status, headers, config) {
          console.log('Takeaway Successfully deleted, now refresh the page');
          $scope.freshLoadOfSessions(taset.courseInstance.id);
        }).error(function(data, status, headers, config) {
          $scope.status = status;
          console.error('Error in deleteTakeaway'+status);
        });
        */
      }
    };

    /* Displaying Dialog window to create New Take Away */
    $scope.newTakeaway = function (sessionsresult) {
      $scope.sessionsresult = sessionsresult;
      $scope.taset = {is_public : true};
      //$scope.takeaway_set = sessionsresult.takeaway_set[0];
      ngDialog.open({
        template: 'newTakeawayTemplateId',
        controller: 'takeawayDashboardCtrl',
        className: 'ngdialog-theme-plain',
        scope: $scope
      });
    };

    /* Event from "Save" button from New Take Away dialog window */
    $scope.saveTakeaway = function(sessionsresult) {
      var tagIds =[];
      angular.forEach($scope.taset.tags, function(tag){
            if(tag.id){
              tagIds.push(tag.id);
            }
      });

      $scope.newTakeawayObj = {
        courseInstance: sessionsresult.courseInstance.id,
        is_public: $scope.taset.is_public,
        notes: $scope.newTakeawayContent,
        session: sessionsresult.id,
        tags: tagIds,
        user: $cookies.userid
      };

      console.log('New Takeaway JSON: '+JSON.stringify($scope.newTakeawayObj));

      TakeAwayFactory.save($scope.newTakeawayObj).$promise.then(
      function(data, status, headers, config) {
        $scope.freshLoadOfSessions(data.courseInstance);
        $scope.newTakeawayContent="";
        console.log("loading all courses sessions after successfull creation"+data.courseInstance);
      },
      function(data, status, headers, config) {
        $scope.status = status;
        console.error('Error in saveTakeaway'+status);
      });

/*
      $http({
        url: '/takeaways/',
        method: "POST",
        data: $scope.newTakeawayObj,
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(data, status, headers, config) {
        $scope.freshLoadOfSessions(data.courseInstance);
        $scope.newTakeawayContent="";
        console.log("loading all courses sessions after successfull creation"+data.courseInstance);
      }).error(function(data, status, headers, config) {
        $scope.status = status;
        console.error('Error in saveTakeaway'+status);
      });
*/
      ngDialog.close();
    };


    /* Displaying Dialog window to update the session name */
    $scope.editSessionName = function (sessionsresult) {

      $scope.session_name_current = sessionsresult.session_name;
      $scope.courseInstanceId = sessionsresult.courseInstance.id;
      $scope.modifiedSession = {
        id:0,
        session_name : "",
        session_dt : ""
      };

      $scope.modifiedSession.id = sessionsresult.id;
      $scope.modifiedSession.session_name = sessionsresult.session_name;
      $scope.modifiedSession.session_dt = sessionsresult.session_dt;

      $scope.sessionsresult = sessionsresult;

      ngDialog.open({
        template: 'editSessionNameTemplateId',
        controller: 'takeawayDashboardCtrl',
        className: 'ngdialog-theme-plain',
        scope: $scope
      });
    };

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
      /*
      $http({
          url: '/sessions/'+modifiedSession.id+"/",
          method: "PUT",
          data: modifiedSession,
          headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
          //$scope.freshLoadOfSessions($scope.courseInstanceId);
          console.log("Successfully updated session name");
          sessionsresult.session_name = modifiedSession.session_name;
        }).error(function (data, status, headers, config) {
          console.error('Error in updateSessionName'+status);
      });
      */
    };

    /* Close the dialog for "New Takeaway" and "Edit Session Name" dialogs */
    $scope.closeDialog = function() {
      ngDialog.close();
      $scope.newTakeawayContent="";
    };

    /*POST to favourite */
    $scope.makeFavourite = function(taset) {

      if(taset.isFavourite) {
        //DELTE
        FavoritesFactory.remove({id:taset.id})
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
        },function(data, status, headers, config) {
          console.error('Error in makeFavourite'+status);
        });
      }

    };



  }) ;


// app.controller("TakeawayController", ['$scope','TakeAwayFactory', function($scope,myFactory){

//  $scope.dup = $scope.session;
//   }]);

app.controller('TagController', function ($scope,$q, TagsFactory) {

   $scope.tags = [];
  $scope.availableTags = {};

   $scope.loadTags = function(query) {
      var deferred = $q.defer();

       TagsFactory.query({"starts_with":query}).$promise.then(function(data){
          deferred.resolve(data.results);
       });
      return deferred.promise;
  };

  $scope.tagAdded = function(tag){

      if(!tag.id){
        TagsFactory.query({"name":tag.name}).$promise.then(function(data){
            if(data.count ==1){
              var length = $scope.tags.length;
              $scope.tags.splice(length-1,1);
              $scope.tags.push(data.results[0]);
            }else{
                TagsFactory.save({"name":tag.name}).$promise.then(function(data){
                    var length = $scope.tags.length;
                    $scope.tags.splice(length-1,1);
                    $scope.tags.push(data);

                });
            }
        });
      }
    $scope.taset.tags = $scope.tags;
  };


$scope.tagAddedInEditTakeaway = function(tag){
      if(!tag.id){
        TagsFactory.query({"name":tag.name}).$promise.then(function(data){
            if(data.count ==1){
              var length = $scope.tags.length;
              $scope.taset.tags.splice(length-1,1);
              $scope.taset.tags.push(data.results[0]);
            }else{
                TagsFactory.save({"name":tag.name}).$promise.then(function(data){
                    var length = $scope.tags.length;
                    $scope.taset.tags.splice(length-1,1);

                    $scope.taset.tags.push(data);

                });
            }
        });
      }
  };




});

app.controller('RatingDemoCtrl', function ($scope) {

});


app.controller('publicPrivateButtonCtrl',
    function($scope, $http, $cookies, $resource, $rootScope,TakeAwayFactory, TakeAwayConverter) {


      if($scope.taset.is_public){
        $scope.visibility = "Make Private";
      }else{
        $scope.visibility = "Make Public";
      }

    /*Public private buttons method */
    $scope.toggleButtons = function(tasett, clickedButton, postImmediately,courseId, sessionId) {
      if (clickedButton == $scope.taset.is_public) {
        $scope.taset.is_public = (clickedButton == true) ? false : true;
      } else {
        $scope.taset.is_public = clickedButton;
      }

      if($scope.taset.is_public){
        $scope.visibility = "Make Private";
      }else{
        $scope.visibility = "Make Public";
      }

      taset = $scope.taset
      //From Edit takeaway or New Takeaway, onchange of public-private option do not make service call to update.
      if(postImmediately == true || postImmediately == 'true') {
          var tagIdArr = new Array();
          _.each(taset.tags,function(tagId){
              tagIdArr.push(tagId.id);
          });

          var modifiedTakeawayObj = TakeAwayConverter.convert(taset);
          // var modifiedTakeawayObj = {
          //    id : taset.id,
          //    notes: taset.notes,
          //   user: $cookies.userid,
          //   courseInstance: courseId,
          //   session: sessionId,
          //    is_public: taset.is_public,
          //    tags: tagIdArr,
          //    average_rating : taset.average_rating,
          //    total_raters: taset.total_raters
          // };



          TakeAwayFactory.update({id:taset.id},modifiedTakeawayObj).$promise
          .then(function(data, status, headers, config) {
            console.log("Successfully updated public flag in server");
          },function(data, status, headers, config) {
            $scope.status = status;
        });

          /*
          $http({
            url: '/takeaways/' + taset.id+"/",
            method: "PUT",
            data: modifiedTakeawayObj,
            headers: {'Content-Type': 'application/json'}
          }).success(function(data, status, headers, config) {
            console.log("Successfully updated public flag in server");
          }).error(function(data, status, headers, config) {
            $scope.status = status;
          });
          */
        }
    };

    });


})();


