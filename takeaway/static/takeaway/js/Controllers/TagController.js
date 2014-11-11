app.controller('TagController', function($scope, $q, TagsFactory, CriteriaService, TagsDataFactory) {

  $scope.tags = [];
  $scope.availableTags = {};

  $scope.loadTags = function(query) {
    var deferred = $q.defer();

    TagsFactory.query({
      "starts_with": query
    }).$promise.then(function(data) {
      deferred.resolve(data.results);
    });
    return deferred.promise;
  };



  $scope.tagSearch = function() {
    $scope.selectedTags.push($scope.tag.name);
    CriteriaService.setTagSearchCriteria({
      searchTerm: 'tagSearch',
      value: $scope.tag.name
    });
  };

  $scope.removeTagFromSearchCriteria = function() {
    var index = $scope.selectedTags.indexOf($scope.tag);
    $scope.selectedTags.splice(index, index + 1);
    CriteriaService.removeTagFromSearchCriteria($scope.tag);
  };

  $scope.tagAdded = function(tag) {
    if (!tag.id) {
      TagsFactory.query({
        "name": tag.name
      }).$promise.then(function(data) {
        if (data.count == 1) {
          var length = $scope.tags.length;
          $scope.taset.tags.splice(length - 1, 1);
          $scope.taset.tags.push(data.results[0]);
        } else {
          TagsFactory.save({
            "name": tag.name
          }).$promise.then(function(data) {
            TagsDataFactory.addTag(data);
            var length = $scope.tags.length;
            $scope.taset.tags.splice(length - 1, 1);

            $scope.taset.tags.push(data);

          });
        }
      });
    } else {
      var length = $scope.tags.length;
      if ($scope.taset.tags) {
        $scope.taset.tags.splice(length - 1, 1);
      } else {
        $scope.taset.tags = [];
      }
      $scope.taset.tags.push(tag);
    }
    //$scope.taset.tags = $scope.tags;
  };



});