app.controller('SessionController', function($scope, ngDialog, CourseDataFactory) {

  $scope.editSessionName = function(sessionsresult) {

    $scope.session_name_current = $scope.sessionsresult.session_name;
    $scope.courseInstanceId = $scope.sessionsresult.courseInstance.id;
    $scope.modifiedSession = {
      id: 0,
      session_name: "",
      session_dt: ""
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


  $scope.newTakeaway = function() {

    $scope.taset = {
      is_public: true,
      tags: []
    };
    var currentCourse = CourseDataFactory.getCurrentCourse();
    var userCanPost = CourseDataFactory.findIfUserCanPost(currentCourse);
    $scope.userPermissionDetail = CourseDataFactory.findUserPermissionDetail(currentCourse);
    //$scope.takeaway_set = sessionsresult.takeaway_set[0];
    if (userCanPost) { //
      ngDialog.open({
        template: 'newTakeawayTemplateId',
        controller: 'takeawayDashboardCtrl',
        className: 'ngdialog-theme-plain',
        scope: $scope
      });
    } else {
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