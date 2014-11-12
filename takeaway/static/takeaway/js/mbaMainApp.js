  var app = angular.module('takeAwayDashboard', ['duScroll', 'ngCookies', 'checklist-model', 'ngResource', 'ngRoute', 'ngDialog', 'ngTagsInput', 'ui.tinymce', 'ui.bootstrap', 'textAngular', 'mgcrea.ngStrap', 'ngAnimate']);

  app.run(function($http, $cookies) {

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
  app.directive('coursemates', function() {
    return {
      restrict: 'E',
      templateUrl: '/static/takeaway/templates/coursemates.html'
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
      scope: {
        taset: '=',
        performPost: '@',
        courseId: '@',
        sessionId: '@'
      },
      templateUrl: '/static/takeaway/templates/publicPrivateButtonTemplate.html'
    }
  });


  app.config(['ngDialogProvider', function(ngDialogProvider) {
    ngDialogProvider.setDefaults({
      className: 'ngdialog-theme-default',
      plain: false,
      showClose: true,
      closeByDocument: true,
      closeByEscape: true,
      appendTo: false,
      preCloseCallback: function() {
        console.log('default pre-close callback');
      }
    });
  }]);