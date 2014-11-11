app.controller('CourseController', function($scope, ngDialog, UserPermission, CourseDataFactory) {


  $scope.highLightSelectedCourse = function(courseid) {
    _.each($scope.availableCourses.results, function(courseObj) {
      if (courseObj.id == courseid) {
        courseObj["courseClass"] = "course-selected";
      } else {
        courseObj["courseClass"] = "course-deselected";
      }
    });

  };

  $scope.getUserPermission = function(courseId) {
    UserPermission.query({
      'course_id': courseId
    }).$promise.then(
      function(data) {
        CourseDataFactory.setUserCanPost(courseId, data.can_post);
        CourseDataFactory.setUserPermissionDetail(courseId, data);
        $scope.userCanPost = data.can_post;
        $scope.userPermisssionDetail = data;
      },
      function(data) {

      });
  };

  $scope.freshLoadOfSessions = function() {
    //$scope.displaysessions = false;
    var courseid = $scope.courseInstance.id;
    $scope.loadCourses(courseid);
    $scope.highLightSelectedCourse(courseid);
    $scope.getUserPermission(courseid);
    $scope.getLeaderBoard(courseid);
  };

  $scope.getDisplayedCourse = function() {
    return CourseDataFactory.getCurrentCourse();
  }

  $scope.isCurrentCourseSelected = function() {
    return $scope.courseInstance.id == CourseDataFactory.getCurrentCourse();
  };


  angular.element(document).ready(function() {
    if (!CourseDataFactory.getDefaultCourse()) {
      $scope.freshLoadOfSessions();
      CourseDataFactory.setDefaultCourse();
    }

  });


});