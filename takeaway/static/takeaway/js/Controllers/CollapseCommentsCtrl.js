app.controller('CollapseCommentsCtrl', function($scope, $cookies, Comments) {
  $scope.isCollapsed = true;

  $scope.displayComments = function(taset) {

    if ($scope.isCollapsed) {
      $scope.loadComments(taset, false);
    } else {
      $scope.isCollapsed = !$scope.isCollapsed;
    }
  };

  $scope.loadComments = function(taset, isRefresh) {

    Comments.query({
      "takeaway": taset.id
    }).$promise.then(function(data) {
      $scope.comments = data.results;
      taset.comment_count = data.count;
      if (!isRefresh) {
        $scope.isCollapsed = !$scope.isCollapsed;
      }

    });

  };

  $scope.saveComment = function(taset) {
    Comments.save({
        takeaway: taset.id,
        notes: $scope.myComment,
        user: $cookies.userid,
        tags: [1],
        vote_count: 0,
        average_rating: 0,
        total_raters: 0
      })
      .$promise.then(function(data) {
        $scope.myComment = null;
        $scope.loadComments(taset, true);
      });

  };

});