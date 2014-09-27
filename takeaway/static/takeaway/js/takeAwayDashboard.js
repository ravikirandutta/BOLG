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

    $scope.loadCourses = function(courseid) {
      SessionsFactory.query({
        "courseInstance": courseid,
        "ordering": "session_dt"
      }).$promise.then(function(data) {
        console.log("inside course fetch then");
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
        taset = data;
        alert("success");
      }).error(function(data, status, headers, config) {
        $scope.status = status;
      });
    };

    $scope.cancelEdit = function(divId) {
      document.getElementById(divId + "_view").style.display = "block";
      document.getElementById(divId + "_edit").style.display = "none";
      document.getElementById(divId + "_notes").value = "";
    };

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
      console.log("inside course fetch then");
      $scope.availableCourses = data;
    });

  });
})();