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
                query: {method:'GET', isArray:false}
               });
    }]);
    app.factory('UserProfileUpdate', ['$resource',function($resource){
         return $resource('/takeawayprofiles/:id', {id:'@id'}, {
                save: {method:'PUT'}
               });
    }]);
    app.factory('Courses', ['$resource',function($resource){
         return $resource('/courses/', {}, {
                query: {method:'GET', isArray:false},
                save: {method: 'POST'}
               });
    }]);
    app.factory('Sections', ['$resource',function($resource){
         return $resource('/sections/', {}, {
                query: {method:'GET', isArray:false}
               });
    }]);
    app.factory('Programs', ['$resource',function($resource){
         return $resource('/programs/', {}, {
                query: {method:'GET', isArray:false}
               });
    }]);
    app.factory('Status', ['$resource',function($resource){
         return $resource('/status/', {}, {
                query: {method:'GET', isArray:false}
               });
    }]);
    app.factory('Terms', ['$resource',function($resource){
         return $resource('/terms/', {}, {
                query: {method:'GET', isArray:false}
               });
    }]);
    app.factory('CourseInstanceCreate', ['$resource',function($resource){
         return $resource('/courseInstancesCreate/', {}, {
                query: {method:'GET', isArray:false},
                save: {method:'POST'}
               });
    }]);


	app.controller('CourseController',function($scope,$http,$cookies,$resource,CourseInstanceCreate,Sections,Status,Terms,CourseSelection,UserProfile,UserProfileUpdate,Courses,Programs){
		$scope.addingCourse=false;
		$scope.newCourse={};
		$scope.sections={};
		$scope.userProfile={};
        $scope.userRegisteredCourses={};
		$scope.availableCourses={};
        $scope.courses={};
        $scope.newClass = {};
        $scope.programs={};
        $scope.Terms={};
        $scope.Statuses={};
        var d = new Date();
        $scope.years=[d.getFullYear()-1,d.getFullYear(),d.getFullYear()+1];
        $scope.newClass.batch = $scope.years[1];
        $scope.newClass.year = $scope.years[1];



        $scope.getAvailableCourses = function(){
            CourseSelection.query({"school":$scope.userProfile.school}).$promise.then(function(data){
                $scope.availableCourses=data.results;
            });
        };
        $scope.getCourses = function(){
            Courses.query({"school":"2"}).$promise.then(function(data){
                $scope.courses = data.results;
                if($scope.courses.length>0){
                 $scope.newClass.course=$scope.courses[0].id;  
                }
                
                $scope.creatingCourse=($scope.courses.length==0);
        })};

        $scope.getSections = function(){
            Sections.query().$promise.then(function(data){
                $scope.sections = data.results;
                $scope.newClass.section = $scope.sections[0].id;
            });

        };
        $scope.getProgrmas = function(){
            Programs.query().$promise.then(function(data){
                $scope.programs = data.results;
                $scope.newClass.program = $scope.programs[0].id;
            });

        };
        $scope.getTerms = function(){
            Terms.query().$promise.then(function(data){
                $scope.terms = data.results;
                $scope.newClass.term = $scope.terms[0].id;
            });

        };
        $scope.getStatuses = function(){
            Status.query().$promise.then(function(data){
                $scope.statuses = data.results;
                $scope.newClass.status = $scope.statuses[0].id;
            });

        };


        UserProfile.query({"user":$cookies.userid}).$promise.then(function(data){
            $scope.userProfile=data.results[0];
            $scope.userRegisteredCourses=$scope.userProfile.courseInstances;
        }).then($scope.getAvailableCourses).then($scope.getCourses).then($scope.getSections).then($scope.getProgrmas).then($scope.getTerms).then($scope.getStatuses);

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
                $scope.newClass.course=data.id;
                $scope.newCourse = {};
                $scope.creatingCourse=false;
                $scope.submitNewClassForm(); 
                //once we make course instance addition we need to remove this redundency below
                $scope.getAvailableCourses();
            }).error(function (data, status, headers, config) {
                $scope.status = status;
            });
		};

        $scope.submitNewClassForm = function(){
            if($scope.creatingCourse){
                $scope.submitNewCourseForm();
            }else{
            CourseInstanceCreate.save($scope.newClass).$promise.then(function(){
                $scope.getAvailableCourses();
                $scope.setAddingCourse(false);
            });
            }

        }

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


})();
