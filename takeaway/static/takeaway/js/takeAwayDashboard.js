/* Comments Meta Data 
    Course - CRS, Session - SN, Takeaway - TAY, Session and TakeAway - STAY
*/

/*
  Pending:
  1. Dialog box for editing session name  -DONE
  2. Dialog box for New Takeaway -DONE
  3. Tags handling in New / Edit take away
  4. PUB-PRI button in New / Edit take away
  5. Selected CRS li tag class should be changed to "course-selected" and all others should be "course-deselected"
  6. Owner check for enabling PUB-PRI button in each TAY
  7. Owner check for enabling EDIT-DELTE buttons in each TAY
  8. Favourite select/deselect and saving for each TAY  --DONE, but DELETE is forbidden in local
  9. Confirmation dialog for DELETE TAY -DONE
  10. Color difference for owned TAY  --DONE
  11. TAY style not rendering correctly
  12. Expand and Collapse for sessions
  13. Validations in Edit Session Name and New Takeaway and Edit Takeaway
  14. On editing of takeaway, we should disable other takeaways edit-delete buttons and restore again after update/cancel
  
// Sep 28th pending might be duplicated from above
1. On New Takeaway Page is not refreshing even data saved
2. Tags, Rateit, Public -Private button
3. Local box - DELETE forbidden error
4. Rating GET - POST
5. Tags GET-POST
6. PUBLIC-PRIVATE POST
// Sep 28th END

ng Modules required for below
  Dialog window, Tags, RateIt and PUB-PRI button
  
  Open Questions:
  1. Is Session can be deleted? If yes, all TAYs associated with that session also deleted?
  2. Search required or not? If yes, on what basis? Tags/Rating/Owner/PUB-PRI/Favourite
  3. Is user rated once, does he can't rate it again?
  4. If user is owner for TAY, he can't rate it? But he can see it?
  5. Is there any specific reason to code menu bar tags in this page?

*/

(function() {
  var app = angular.module('takeAwayDashboard', ['ngCookies', 'ngResource', 'ngRoute', 'ngDialog']).run(function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.put['X-CSRFToken'] = $cookies.csrftoken;
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

  //http://localhost:8000/sessions/?courseInstance=2&ordering=session_dt

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
        }
      });
    }
  ]);

  
 
  app.controller('takeawayDashboardCtrl', 
    function($scope, $http, $cookies, $resource, $rootScope, CoursesFactory, SessionsFactory, ngDialog, RatingFactory, FavoritesFactory) {

    console.log("loading takeawayDashboardCtrl");

    $scope.availableCourses = {};
    $scope.sessions = {
      "results": []
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

    }

    $scope.freshLoadOfSessions = function(courseid){
      $scope.displaysessions = false;
      $scope.loadCourses(courseid);
      $scope.highLightSelectedCourse(courseid);
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
    };

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

      var modifiedTakeawayObj = {
        id : taset.id,
        notes: document.getElementById(divId + "_notes").value,
        user: $cookies.userid,
        courseInstance: taset.courseInstance.id,
        session: taset.session.id,
        is_public: taset.is_public,
        username : $cookies.username,
        tags: [1],
        created_dt : taset.created_dt,
        average_rating : taset.average_rating,
        total_raters : taset.total_raters
      };

      console.log(JSON.stringify(modifiedTakeawayObj));

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
      }
    };

    /* Displaying Dialog window to create New Take Away */
    $scope.newTakeaway = function (sessionsresult) {
      $scope.sessionsresult = sessionsresult;
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

      $scope.newTakeawayObj = {
        courseInstance: sessionsresult.courseInstance.id,
        is_public: true,  //defalt value is true, should come from dialog window
        notes: document.getElementById("notes").value,
        session: sessionsresult.id,
        tags: [1],
        user: $cookies.userid
      };

      console.log('New Takeaway JSON: '+JSON.stringify($scope.newTakeawayObj));  

      $http({
        url: '/takeaways/',
        method: "POST",
        data: $scope.newTakeawayObj,
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(data, status, headers, config) {
        $scope.freshLoadOfSessions(data.courseInstance);
        console.log("loading all courses sessions after successfull creation"+data.courseInstance);
      }).error(function(data, status, headers, config) {
        $scope.status = status;
        console.error('Error in saveTakeaway'+status);
      });

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
      ngDialog.close();
    };
      
    /* Close the dialog for "New Takeaway" and "Edit Session Name" dialogs */
    $scope.closeDialog = function() {
      ngDialog.close();
    }

    /*POST to favourite */
    $scope.makeFavourite = function(taset) {
      
      if(taset.isFavourite) {
        //DELTE
        $http({
          url: '/favorites/'+taset.id,
          method: "DELETE",
          data: favObj,
          headers: {
            'Content-Type': 'application/json'
          }
        }).success(function(data, status, headers, config) {
          taset.isFavourite = false;
        }).error(function(data, status, headers, config) {
          console.error('Error in makeFavourite'+status);
        });
      } else {
        //POST
        var favObj = {
          courseInstance: taset.courseInstance.id,
          takeaway: taset.id, 
          user: $cookies.userid
        };

        $http({
          url: '/favorites/',
          method: "POST",
          data: favObj,
          headers: {
            'Content-Type': 'application/json'
          }
        }).success(function(data, status, headers, config) {
          taset.isFavourite = true;
        }).error(function(data, status, headers, config) {
          console.error('Error in makeFavourite'+status);
        });
      }

    };
  });
})();