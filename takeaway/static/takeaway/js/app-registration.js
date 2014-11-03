(function(){
    var app=angular.module('registration',['ngCookies','ngResource','countTo','ui.bootstrap']).run(function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.put['X-CSRFToken'] = $cookies.csrftoken;
});
app.config(['$resourceProvider', function ($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

    app.factory('Schools', ['$resource',function($resource){
         return $resource('/schools/', {}, {
                query: {method:'GET', isArray:false},
               });
    }]);

    app.factory('ProgramsFactory', ['$resource',function($resource){
         return $resource('/programs/', {}, {
                query: {method:'GET', isArray:false},
               });
    }]);


app.factory('CourseInstanceFactory', ['$resource',function($resource){
         return $resource('/courseInstances/', {}, {
                query: {method:'GET', isArray:false},
               });
    }]);

app.factory('TakeAwayFactory', ['$resource',function($resource){
         return $resource('/takeaways/', {}, {
                query: {method:'GET', isArray:false},
               });
    }]);

app.factory('TakeAwayProfileFactory', ['$resource',function($resource){
         return $resource('/takeawayprofiles/', {}, {
                query: {method:'GET', isArray:false},
               });
    }]);

app.factory('ContactUsFactory', ['$resource',function($resource){
         return $resource('/contactus/', {}, {
                save: {method:'POST'},

               });
    }]);


  app.controller('SchoolController',function($scope,$http,$cookies,$resource,$location, $anchorScroll, Schools,ProgramsFactory,
                                               TakeAwayFactory, TakeAwayProfileFactory, CourseInstanceFactory,ContactUsFactory){
    $scope.availableSchools={};
    $scope.currentSchool={};
    $scope.school = "emory";
    $scope.programs = {};
    $scope.schoolSelected=false;
    $scope.noSchool=false;
    $scope.helpUsAdd = {};
    $scope.helpUsAdd.subject="";
    $scope.helpUsAdd.sender="";
    $scope.helpUsAdd.message="";



        $scope.selectSchool = function(school_id){
          angular.forEach($scope.availableSchools,function(value){
            if(value.id === school_id){
              $scope.currentSchool = value;
              $scope.schoolSelected=true;
              $scope.noSchool=false;
            }
          });



          $scope.setValidEmailFormat();

          $location.hash('school-stats');
          $anchorScroll();

          ProgramsFactory.query({"school":$scope.currentSchool.id}).$promise.then(function(data){
              $scope.programs = data.results;
          });

          TakeAwayFactory.query({"school":$scope.currentSchool.id}).$promise.then(function(data){
              $scope.takeaway_count = data.count;
          });

          TakeAwayProfileFactory.query({"school":$scope.currentSchool.id}).$promise.then(function(data){
              $scope.school_mates = data.count;
          });


          CourseInstanceFactory.query({"school_id":$scope.currentSchool.id}).$promise.then(function(data){
              $scope.course_count = data.count;
          });


        };


        $scope.addSchoolRequest = function()
    {
     var data = {"subject":$scope.helpUsAdd.subject,"message":$scope.helpUsAdd.message,"sender":$scope.helpUsAdd.sender};
     ContactUsFactory.save(data).$promise.then(function(){
      $scope.add_school_success = true;
        $.gritter.add({
                      title: 'Contact us',
                      sticky: false,
                      time: '0.0001'
                  });
     });
  };

        $scope.test = function(){}

        $scope.setValidEmailFormat = function(){
            $scope.validEmailFormat = "Email should be one of the: ";
            angular.forEach($scope.currentSchool.emailformat_set,function(value){
              $scope.validEmailFormat += value.format+",";
         });
            $scope.validEmailFormat = $scope.validEmailFormat.substring(0,$scope.validEmailFormat.length  -1);
        }

         Schools.query().$promise.then(function(data){
                console.log("inside course fetch then");
                $scope.availableSchools=data.results;
            });



       $scope.isEmailValid = true;
       $scope.email="";

       $scope.validateEmail= function(){
        var isEmailValid = false;
         angular.forEach($scope.currentSchool.emailformat_set,function(value){

              if($scope.email.match(value.format+'$')){
                isEmailValid = !isEmailValid
              }

         });
         $scope.isEmailValid = isEmailValid;

       };

  });

app.directive('match', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                match: '='
            },
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(function() {
                    var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                    return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.match === modelValue;
                }, function(currentValue) {
                    ctrl.$setValidity('match', currentValue);
                });
            }
        };
    });




})();



