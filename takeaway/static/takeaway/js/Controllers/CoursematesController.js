app.controller('CoursematesController', function($scope, ClassmatesDataFactory) {

  $scope.coursemates = [];
  $scope.loadCoursemates = function() {
    $scope.coursemates = ClassmatesDataFactory.getCurrentCourseClassmates();
  }

});