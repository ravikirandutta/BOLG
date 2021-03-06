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

    app.directive('editProfile',function(){
        return {
            restrict: 'E',
            templateUrl:'/static/takeaway/templates/edit-profile.html'

        }
    });

    app.directive('emailSettings',function(){
        return {
            restrict: 'E',
            templateUrl:'/static/takeaway/templates/email-settings.html'

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

    app.factory('User', ['$resource',function($resource){
        return $resource('/users/:id', {}, {
            query: {method:'GET'},
            update : {method: 'PUT'}
        });
    }]);

 app.factory('EmailSettingsFactory', ['$resource',function($resource){
        return $resource('/emailSettings/', {}, {
            query: {method:'GET'},
            update : {url:'/emailSettings/:id/', method: 'PUT'}
        });
    }]);


    app.controller('EmailSettingsController', function($scope,$http,$cookies,$resource,EmailSettingsFactory){
            $scope.instantEmailSetting = 0;
            $scope.emailSettings ={};
            EmailSettingsFactory.query({user:$cookies.userid}).$promise.then(function(data){
                $scope.emailSettings = data.results[0];
                $scope.instantEmailSetting = $scope.emailSettings.mail_when_takeaway;
            });

            $scope.modifyInstantEmail = function(value){
                $scope.emailSettings.mail_when_takeaway = value;
                EmailSettingsFactory.update({id:$scope.emailSettings.id},$scope.emailSettings).$promise.then(function(data){

                }, function(){

                });
            };
    });


    app.controller('EditProfileController',function($scope,$http,$cookies,$resource,User){

        $scope.editProfileSuccess = false;
        $scope.editProfileError = false;
        $scope.saveUserLabel = 'Save Changes';
        $scope.disablesubmit = false;

        User.query({id:$cookies.userid}).$promise.then(function(data){
                $scope.firstName = data.first_name ;
                $scope.lastName = data.last_name;
                $scope.userName =data.username;
                $scope.emailId = data.email;
        },
        function(reason){
                console.log(reason);
        });

        $scope.update = function(editProfileForm){
            if(editProfileForm.$valid){
                $scope.saveUserLabel = 'Updating ...';
                $scope.disablesubmit = true;
            }

            //create the JSON object and make the service call to put this object;
            var userJsonData = {};
            userJsonData.first_name = $scope.firstName;
            userJsonData.last_name = $scope.lastName;
            userJsonData.username = $scope.userName;
            userJsonData.email = $scope.emailId;

            $scope.updateUser = User.update({id:$cookies.userid},userJsonData);
            $scope.updateUser.$promise.then(function(data){
                $scope.editProfileSuccess = true;
                $scope.saveUserLabel = 'Save Changes';
                $scope.disablesubmit = false;
            },function(reason){
                console.log(reason);
                $scope.editProfileError = true;
                $scope.saveUserLabel = 'Save Changes';
                $scope.disablesubmit = false;
            });

        }

        $scope.cancel = function(){
            window.location.reload();
        };

    });
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
            CourseSelection.query({"school_id":$scope.userProfile.school}).$promise.then(function(data){
                $scope.availableCourses=data.results;
                if($scope.availableCourses.length==0){
                    $scope.setAddingCourse(true);
                }
            });
        };
        $scope.getCourses = function(){
            Courses.query({"school":$scope.userProfile.school}).$promise.then(function(data){
                $scope.courses = data.results;
                if($scope.courses.length>0){
                 $scope.newClass.course=$scope.courses[0].id;
                }

                $scope.creatingCourse=($scope.courses.length==0);
        })};

        $scope.getSections = function(){
            Sections.query({"school":$scope.userProfile.school}).$promise.then(function(data){
                $scope.sections = data.results;
                $scope.newClass.section = $scope.sections[0].id;
            });

        };
        $scope.getProgrmas = function(){
            Programs.query({"school":$scope.userProfile.school}).$promise.then(function(data){
                $scope.programs = data.results;
                $scope.newClass.program = $scope.programs[0].id;
            });

        };
        $scope.getTerms = function(){
            Terms.query({"school":$scope.userProfile.school}).$promise.then(function(data){
                $scope.terms = data.results;
                $scope.newClass.term = $scope.terms[0].id;
            });

        };
        $scope.getStatuses = function(){
            Status.query({"school":$scope.userProfile.school}).$promise.then(function(data){
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
                $scope.getCourses();
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
                UserProfileUpdate.save({id:$scope.userProfile.id,"course_id":courseId},$scope.userProfile);
            }
        };


	});


})();
