app.controller('TakeAwayController', function($scope, $sce, $cookies, TakeAwayFactory, RatingFactory,
  FavoritesFactory, GroupsDataFactory, TakeAwayConverter, ngDialog, SessionsDataFactory, CourseDataFactory) {
  $scope.groups = GroupsDataFactory.getCurrentCourseGroupsIdArray();


  $scope.isPartOfUsersGroup = function() {
    var isVisibile = false;
    if ($scope.taset.shared_takeaways) {
      angular.forEach($scope.taset.shared_takeaways, function(grp) {

        if ($scope.groups && $scope.groups.indexOf(grp.group) > -1) {
          isVisibile = true;
        }

      });
    }
    return isVisibile;

  };


  $scope.makeEditable = function(divId, notes) {
    document.getElementById(divId + "_view").style.display = "none";
    document.getElementById(divId + "_edit").style.display = "block";
    document.getElementById(divId + "_notes").value = notes;
  };

  $scope.deleteTakeaway = function(sessionsresult, taset) {
    var msg = "Are you sure you want to delete the take away notes?"
    if (window.confirm(msg)) {

      TakeAwayFactory.remove({
        id: taset.id
      }).$promise.then(
        function(data, status, headers, config) {
          SessionsDataFactory.removeTakeawayFromSessions(taset);
        },
        function(data, status, headers, config) {
          $scope.status = status;
          console.error('Error in deleteTakeaway' + status);
        });
    }
  };

  $scope.rated = function(id, rating, alreadyRated) {
    if (!alreadyRated) {
      RatingFactory.save({
        takeaway: id,
        rating_value: rating,
        user: $cookies.userid
      }).$promise.then(function() {
        $scope.taset.alreadyRated = true;
        CourseDataFactory.decrementRatingCountNeededToCreateTakeaway();
      }, function() {});
    }
  };


  $scope.getSafe = function(unsafeHtml) {

    return $sce.trustAsHtml(unsafeHtml);

  };

  $scope.updateTakeaway = function(divId) {
    document.getElementById(divId + "_view").style.display = "block";
    document.getElementById(divId + "_edit").style.display = "none";


    var modifiedTakeawayObj = TakeAwayConverter.convert($scope.taset);

    TakeAwayFactory.update({
        id: $scope.taset.id
      }, modifiedTakeawayObj).$promise
      .then(function(data, status, headers, config) {
        
      }, function(data, status, headers, config) {
        $scope.status = status;
      });
  };

  $scope.cancelEdit = function(divId) {
    document.getElementById(divId + "_view").style.display = "block";
    document.getElementById(divId + "_edit").style.display = "none";
    document.getElementById(divId + "_notes").value = "";
  };


});