/* Comments Meta Data 
    Course - CRS, Session - SN, Takeaway - TAY, Session and TakeAway - STAY
*/

/*
  Pending:

  1. Dialog box for editing session name
  2. Dialog box for New Takeaway
  3. Tags handling in New / Edit take away
  4. PUB-PRI button in New / Edit take away
  5. Selected CRS li tag class should be changed to "course-selected" and all others should be "course-deselected"
  6. Owner check for enabling PUB-PRI button in each TAY
  7. Owner check for enabling EDIT-DELTE buttons in each TAY
  8. Favourite select/deselect and saving for each TAY
  9. Confirmation dialog for DELETE TAY
  10. Color difference for owned TAY
  11. TAY style not rendering correctly
  12. Expand and Collapse for sessions


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
  var app = angular.module('takeAwayDashboard', ['ngCookies', 'ngResource', 'ngRoute']).run(function($http, $cookies) {
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

  //http://www.mbatakeaways.com/courseInstances/?students=3
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

  app.controller('takeawayDashboardCtrl', function($scope, $http, $cookies, $resource, CoursesFactory, SessionsFactory) {

    console.log("loading takeawayDashboardCtrl");

    $scope.availableCourses = {};
    $scope.sessions = {
      "results": []
    };

    // On Click of CRS, load all SNs and TAYs associated with the CRS.
    $scope.loadCourses = function(courseid) {
      SessionsFactory.query({
        "courseInstance": courseid,
        "ordering": "session_dt"
      }).$promise.then(function(data) {
        console.log("Load all SNs and TAYs associated with the CRS");
        $scope.sessions = data;
      });
      $scope.displaysessions = true;
    };


    $scope.makeEditable = function(divId, notes) {
      document.getElementById(divId + "_view").style.display = "none";
      document.getElementById(divId + "_edit").style.display = "block";
      document.getElementById(divId + "_notes").value = notes;
    }


    $scope.updateTakeaway = function(divId, taset) {
      document.getElementById(divId + "_view").style.display = "block";
      document.getElementById(divId + "_edit").style.display = "none";

      //PUT: http://www.mbatakeaways.com/takeaways/45/
      var temp = {
        notes: document.getElementById(divId + "_notes").value,
        user: $cookies.userid,
        courseInstance: taset.courseInstance.id,
        session: taset.session.id,
        tags: [1],
        is_public: taset.is_public
      };

      console.log(JSON.stringify(temp));

      $http({
        url: '/takeaways/' + taset.id,
        method: "PUT",
        data: temp,
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(data, status, headers, config) {
        //We need refresh only updated takeaway instead of loading all courses sessions
        $scope.loadCourses(taset.courseInstance.id);
      }).error(function(data, status, headers, config) {
        $scope.status = status;
      });
    };

    $scope.cancelEdit = function(divId) {
      document.getElementById(divId + "_view").style.display = "block";
      document.getElementById(divId + "_edit").style.display = "none";
      document.getElementById(divId + "_notes").value = "";
    };

    //Deleting selected TAY by passing the ID
    $scope.deleteTakeaway = function(sessionsresult, taset) {

      //http://www.mbatakeaways.com/takeaways/45/

      $http({
        url: '/takeaways/' + taset.id,
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(data, status, headers, config) {
        alert("deletion success");
      }).error(function(data, status, headers, config) {
        $scope.status = status;
      });
    };


    CoursesFactory.query({
      "students": $cookies.userid
    }).$promise.then(function(data) {
      console.log("First load of the page load the all available CRS");
      $scope.availableCourses = data;

      //Displaying the STAYs for first CRS
      if($scope.availableCourses.results != null && $scope.availableCourses.results.length > 0) {
        var defaultCourseId = $scope.availableCourses.results[0].course.id;  
        $scope.loadCourses(defaultCourseId);
      }
    });
  });
})();