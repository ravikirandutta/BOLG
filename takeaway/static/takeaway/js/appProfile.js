(function(){ 
	var app=angular.module('selectCourses',['ngCookies','ngResource']).run(function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.put['X-CSRFToken'] = $cookies.csrftoken;
});
app.config(['$resourceProvider', function ($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
    app.directive('courseManagement',function(){
        return {
            restrict: 'E',
            templateUrl:'/static/takeaway/templates/course-management.html'

        }
    });
    app.factory('CourseSelection', ['$resource',function($resource){
         return $resource('/courseInstances/', {}, {
                query: {method:'GET', isArray:false},
                save: {method:'POST'}
               });
    }]);
    app.factory('UserProfile', ['$resource',function($resource){
         return $resource('/takeawayprofiles/', {}, {
                query: {method:'GET', isArray:false},
                save: {method:'PUT'}
               });
    }]);
    app.factory('UserProfileUpdate', ['$resource',function($resource){
         return $resource('/takeawayprofiles/:id', {id:'@id'}, {
                save: {method:'PUT'}
               });
    }]);


	app.controller('CourseController',function($scope,$http,$cookies,$resource,ApplicationsService,CourseSelection,UserProfile,UserProfileUpdate){
		$scope.addingCourse=false;
		$scope.newCourse={};
		$scope.sections={};
		$scope.userProfile={};
        $scope.userRegisteredCourses={};
		$scope.availableCourses={};

        $scope.getAvailableCourses = function(){
            CourseSelection.query({"school":$scope.userProfile.school}).$promise.then(function(data){
                console.log("inside course fetch then");
                $scope.availableCourses=data.results;
            });
        };

        UserProfile.query({"user":$cookies.userid}).$promise.then(function(data){
            console.log("inside user fetch then");
            $scope.userProfile=data.results[0];
            $scope.userRegisteredCourses=$scope.userProfile.courseInstances;
        }).then($scope.getAvailableCourses);

        $scope.isRegistered = function(courseId){
            for(var i=0; i<$scope.userRegisteredCourses.length;i++){
                if($scope.userRegisteredCourses[i]==courseId){
                    return true;
                }
            }
            return false;
        }
        

		$scope.setAddingCourse=function(value){
			if(value){
				$scope.addingCourse=true;
			}
			else{
				$scope.addingCourse=false;
			}

		};
		$scope.submitNewCourseForm = function(){
		$scope.newCourse.school=$scope.userProfile.school	
		$http({
            url: '/courses/',
            method: "POST",
            data: $scope.newCourse,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
                $scope.newCourse = {};
                $scope.addingCourse=false; 
            }).error(function (data, status, headers, config) {
                $scope.status = status;
            });
		};

        $scope.toggleCourseSelection = function(courseId){
            if($scope.userRegisteredCourses.indexOf(courseId)> -1){
                $scope.userRegisteredCourses.splice($scope.userRegisteredCourses.indexOf(courseId),1);
                $scope.userProfile.courseInstances=$scope.userRegisteredCourses;
                UserProfileUpdate.save({id:$scope.userProfile.id},$scope.userProfile);
            
                
            } else{
                $scope.userRegisteredCourses.push(courseId);
                $scope.userProfile.courseInstances=$scope.userRegisteredCourses;
                UserProfileUpdate.save({id:$scope.userProfile.id},$scope.userProfile);
            }
        };

	});
	app.factory('ApplicationsService', function ($http, $q) {
    return {
        save: function () {

            var deferred = $q.defer();
            $http.get('/sections/',
             { headers: { 'Accept': 'application/json'} })
                 .success(function (data) {

                    deferred.resolve(data); //resolve data
                 
               })
                .error(function (err) { alert("error"); deferred.reject(); });
            return deferred.promise; 
        }
    };
});

})();
