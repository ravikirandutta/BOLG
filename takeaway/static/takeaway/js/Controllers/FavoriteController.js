app.controller('FavoriteController', function($scope, $cookies, FavoritesFactory, CriteriaService) {
  $scope.makeFavourite = function(taset) {

    if (taset.isFavourite) {
      //DELTE
      FavoritesFactory.remove({
          id: taset.favoriteId
        })
        .$promise.then(function(data, status, headers, config) {
          taset.isFavourite = false;
        }, function(data, status, headers, config) {
          console.error('Error in makeFavourite' + status);
        });
    } else {
      var favObj = {
        courseInstance: taset.courseInstance.id,
        takeaway: taset.id,
        user: $cookies.userid
      };

      FavoritesFactory.save(favObj).$promise.then(function(data, status, headers, config) {
        taset.isFavourite = true;
        taset.favoriteId = data.id;

      }, function(data, status, headers, config) {
        console.error('Error in makeFavourite' + status);
      });
    }

  };

  $scope.filterFavorites = function() {
    CriteriaService.toggleFavoriteCriteria();
  };

});