(function(){ 
	var app=angular.module('selectCourses',['ngCookies']).run(function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
});

	app.controller('CourseController',function($scope,$http,$cookies,ApplicationsService){
		$scope.addingCourse=false;
		$scope.newCourse={};
		$scope.sections={};
		$scope.userProfile={};
		$scope.sections={};

		$http({
			url:'/takeawayprofiles/',
			method: "GET",
			params: {user:$cookies.userid}
		}).success(function (data, status, headers, config) {
                $scope.userProfile = data.results[0]; 
                ApplicationsService.save().then(function(data){
     $scope.sections = data.results;
});
            }).error(function (data, status, headers, config) {
                
        	});

        

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
