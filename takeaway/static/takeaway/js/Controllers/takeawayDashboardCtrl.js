app.controller('takeawayDashboardCtrl',
  function($scope, $http, $cookies, $q, $resource, $sce, $rootScope,
    LeaderboardFactory, UserPermission, ClassmatesDataFactory, CoursesFactory, SessionsFactory, ngDialog, TakeAwayFactory,
    RatingFactory, FavoritesFactory, UserProfile, UserProfileDataFactory, ShareWithGroupsFactory, GroupsFactory,
    GroupsDataFactory, TagsFactory, TakeAwayConverter, CourseDataFactory, CriteriaService, SessionsDataFactory, TagsDataFactory,
    TakeawaysSinceLastLoginFactory) {

    $scope.rate = 7;
    $scope.availableCourses = {};
    $scope.sessions = {
      "results": []
    };

    $scope.userPermisssionDetail = {};
    $scope.userCanPost = false;
    $scope.leaderBoard = {};
    $scope.userProfile = {};


    $scope.ratingStates = [

      {
        stateOn: 'glyphicon-ok-sign',
        stateOff: 'glyphicon-ok-circle'
      }, {
        stateOn: 'glyphicon-star',
        stateOff: 'glyphicon-star-empty'
      }, {
        stateOn: 'glyphicon-heart',
        stateOff: 'glyphicon-ban-circle'
      }, {
        stateOn: 'glyphicon-heart'
      }, {
        stateOff: 'glyphicon-off'
      }
    ];

    $scope.criteria = {};
    $scope.criteria.searchText;
    $scope.selectedTags = [];
    $scope.takeawayDateFilterOptions = CriteriaService.getTakeawayDateFilterOptions();
    
    UserProfile.query({
      "user": $cookies.userid
    }).$promise.then(function(data) {
      UserProfileDataFactory.setUserProfile(data.results[0]);
      $scope.userProfile = UserProfileDataFactory.getUserProfile();
    });


    $scope.clearCriteria = function() {
      $scope.selectedTags = [];
      $scope.criteria = {};
      CriteriaService.setCriteria();
      $scope.criteria = CriteriaService.getCriteria();
      $scope.criteria.createdDateFilter="ALL";
    };
    $scope.criteriaMatch = function() {
      $scope.criteria = CriteriaService.getCriteria();
      var criteria = $scope.criteria;

      return function(takeaway) {
        var favorite = true, tags = true, owner=true; textSearch = true, dateFilter = true;
        if (criteria.filterFavorites) {
          favorite = takeaway.isFavourite;
        }

        if(criteria.ownTakeaways){
          owner = takeaway.isOwner;
        }

        if(criteria.createdDateFilter != 'ALL'){

          var hoursToReduce = 0;
          if(criteria.createdDateFilter == "HOUR") {
             hoursToReduce = 1;
          } else if(criteria.createdDateFilter == "DAY") {
            hoursToReduce = 24;
          } else if(criteria.createdDateFilter == "WEEK") { 
            hoursToReduce = 168;
          } else if(criteria.createdDateFilter == "4WEEKS") {
            hoursToReduce = 672;
          } 

          var dateToCompare = new Date();
          dateToCompare.setHours(dateToCompare.getHours() - hoursToReduce);

          var takeawayDateObj = new Date(takeaway.created_dt);
          dateFilter = (takeawayDateObj > dateToCompare);
         
        }

        var count = 0;
        if (criteria.tagSearch) {
          angular.forEach(takeaway.tags, function(tag) {

            angular.forEach(criteria.tagSearch, function(tagSearch) {

              if (tag.name === tagSearch) {
                count++;
              }
            });
          });
          tags = (count === criteria.tagSearch.length);
        };

        if (criteria.searchText) {
          textSearch = takeaway.notes.indexOf(criteria.searchText) > -1;
        }
        return favorite && tags && textSearch && owner && dateFilter;
      }

    };


    CoursesFactory.query({
      "students": $cookies.userid
    }).$promise.then(function(data) {
      $scope.availableCourses = data;
      $scope.courseInstance = data[0];
    });

    $scope.getLeaderBoard = function(courseId) {
      LeaderboardFactory.query({
        'course_id': courseId
      }, function(data) {
        $scope.leaderBoard = data.points;
      })
    };

    $scope.highLightSelectedCourse = function(courseid) {
      _.each($scope.availableCourses.results, function(courseObj) {
        if (courseObj.id == courseid) {
          courseObj["courseClass"] = "course-selected";
        } else {
          courseObj["courseClass"] = "course-deselected";
        }
      });

    };


    $scope.showLeaderBoard = function() {

      ngDialog.open({
        template: 'courseLeaderBoardTemplateId',
        controller: 'CourseController',
        className: 'ngdialog-theme-plain',
        scope: $scope
      });

    };

    $scope.showLatestTakeawayDialogFunc = function() {
      if (TakeawaysSinceLastLoginFactory.isVisible() == true) {
        $http.get('/takeaways_since_last_login').
        success(function(data, status, headers, config) {
          $scope.tslObj = data;
          $scope.tslObjTemp = [];
          angular.forEach($scope.tslObj.results, function(r) {
            if (!angular.isUndefined(r.takeaway_set) && r.takeaway_set.length != 0) {
              $scope.tslObjTemp.push(r);
            }
          });

          var arr = [];
          $scope.tslObj = [];
          angular.forEach($scope.tslObjTemp, function(r) {
            if ($.inArray(r.courseInstance.course.id, arr) == -1) {
              arr.push(r.courseInstance.course.id);
              $scope.tslObj.push({
                'id': r.courseInstance.course.id,
                'name': r.courseInstance.course.course_name,
                'results': []
              });
            }
          });

          angular.forEach($scope.tslObjTemp, function(r) {
            angular.forEach($scope.tslObj, function(cn) {
              if (cn.id == r.courseInstance.course.id) {
                cn.results.push(r);
              }
            });
          });

          angular.forEach($scope.tslObj, function(cn) {
            var count = 0;
            angular.forEach(cn.results, function(session) {
              count += session.takeaway_set.length;
              session["hideNewButton"] = true;
            });
            cn["count"] = count;
          });

          TakeawaysSinceLastLoginFactory.setIsVisible($scope.tslObj.length > 0);
          if (TakeawaysSinceLastLoginFactory.isVisible() == true) {

            angular.forEach($scope.tslObj, function(tslObjTemp) {
              tslObjTemp = $scope.postzpulateOtherFields(tslObjTemp.id, tslObjTemp);
            });

            ngDialog.open({
              template: 'latestTakeawaySinceLastLogin',
              className: 'ngdialog-theme-plain',
              controller: ['$scope', function($scope) {}],
              closeByDocument: false,
              closeByEscape: false,
              scope: $scope,
              preCloseCallback: function() {

                return true;
              }
            });
            TakeawaysSinceLastLoginFactory.setIsVisible(false);
          }
        }).
        error(function(data, status, headers, config) {
          console.error("error in showLatestTakeawayDialogFunc");
        });
      }
    };


    //This should call before the actual takeaways to be loaded and rendered.
    $scope.showLatestTakeawayDialogFunc();


    // On Click of CRS, load all SNs and TAYs associated with the CRS.
    $scope.loadCourses = function(courseid) {
      CourseDataFactory.setCurrentCourse(courseid);
      GroupsFactory.query({
        'course_instance': courseid,
        'members': $scope.userProfile.id
      }).$promise.then(function(data) {

        GroupsDataFactory.setCurrentCourseGroups(data.results);
      });
      for (var i = 0; i < $scope.availableCourses.results.length; i++) {
        if ($scope.availableCourses.results[i].id == courseid) {
          ClassmatesDataFactory.setCurrentCourseClassmates($scope.availableCourses.results[i].students);
        }
      }


      SessionsFactory.query({
        "courseInstance": courseid,
        "ordering": "session_dt"
      }).$promise.then(function(data) {
        $scope.sessions = data;
        $scope.displaysessions = true;
        $scope.sessionsData = $scope.postzpulateOtherFields(courseid, $scope.sessions);
      });
    };

    $scope.postzpulateOtherFields = function(courseid, sessionsObj) {
      var ratingsMap = {};

      $scope.ratings = {};
      $scope.favList = {};

      FavoritesFactory.get({
        user: $cookies.userid,
        courseInstance: courseid
      }).$promise.then(
        function(data, status, headers, config) {
          $scope.favList = data.results;
          _.each(sessionsObj.results, function(sessionsresult) {
            sessionsresult["showTakeaway"] = true;  //For Expand/Collapse option
            _.each(sessionsresult.takeaway_set, function(taset) {
              taset["isFavourite"] = false;
              _.each($scope.favList, function(fav) {
                if (fav.takeaway == taset.id) {
                  taset["isFavourite"] = true;
                  taset["favoriteId"] = fav.id;
                }
              });
            });
          });
        },
        function(data, status, headers, config) {
          $scope.status = status;
        });

      RatingFactory.get({
        user: $cookies.userid
      }).$promise.then(
        function(data, status, headers, config) {
          $scope.ratings = data.results;

          _.each($scope.ratings, function(rating) {
            ratingsMap[rating.takeaway] = rating.rating_value;
          });

          _.each(sessionsObj.results, function(sessionsresult) {
            _.each(sessionsresult.takeaway_set, function(taset) {
              taset["alreadyRated"] = false;
              if (ratingsMap[taset.id] > -1) {
                taset["rating"] = ratingsMap[taset.id];
                taset.average_rating = ratingsMap[taset.id];
                taset["alreadyRated"] = true;
              }
            });
          });
        },

        function(data, status, headers, config) {
          $scope.status = status;
        }
      );

      _.each(sessionsObj.results, function(sessionsresult) {
        _.each(sessionsresult.takeaway_set, function(taset) {

          var localizedTime = $.localtime.toLocalTime(taset.created_dt, 'MM/dd/yy HH:mm');
          taset.created_dt = localizedTime;

          taset["isOwner"] = false;
          if ($cookies.userid == taset.user.id) {
            taset["isOwner"] = true;
          }
        });
      });


      SessionsDataFactory.setSessionData(sessionsObj);
      TagsDataFactory.getTags();
      return SessionsDataFactory.getSessionData();
    }




    /* Event from "Save" button from New Take Away dialog window */
    $scope.saveTakeaway = function() {
      var tagIds = [];
      angular.forEach($scope.taset.tags, function(tag) {
        if (tag.id) {
          tagIds.push(tag.id);
        }
      });

      $scope.newTakeawayObj = {
        courseInstance: $scope.sessionsresult.courseInstance.id,
        is_public: $scope.taset.is_public,
        notes: $scope.newTakeawayContent,
        session: $scope.sessionsresult.id,
        tags: tagIds,
        user: $cookies.userid
      };

      TakeAwayFactory.save($scope.newTakeawayObj).$promise.then(
        function(data, status, headers, config) {
          SessionsDataFactory.addTakeAwayToSessions(data);
          $scope.newTakeawayContent = "";
          /*
       commenting this untill user groups work
       $scope.taset.createAndAddToGroups.forEach(function(item){
          ShareWithGroupsFactory.updateShare({group:item,shared_type:"GROUP",shared_by:3,takeaway:data.id});
        });
*/
        },
        function(data, status, headers, config) {
          $scope.status = status;
          console.error('Error in saveTakeaway' + status);
        });

      ngDialog.close();

    };


    /* Displaying Dialog window to update the session name */

    /* Event from "Update" button from editSessionName dialog window */
    /* PUT: /sessions/:sessionId */
    $scope.updateSessionName = function(modifiedSession, sessionsresult) {
      

      SessionsFactory.edit({
        id: modifiedSession.id
      }, modifiedSession).$promise.then(
        function(data, status, headers, config) {
          sessionsresult.session_name = modifiedSession.session_name;
        },
        function(data, status, headers, config) {
          console.error('Error in updateSessionName' + status);
        });
      ngDialog.close();
    };

    /* Close the dialog for "New Takeaway" and "Edit Session Name" dialogs */
    $scope.closeDialog = function() {
      ngDialog.close();
      $scope.newTakeawayContent = "";
    };

    $scope.closeLeaderBoardDialog = function() {
      ngDialog.close();
      $scope.newTakeawayContent = "";
      $scope.showLatestTakeawayDialog = false;
    };


    $scope.filterOwnTakeaways = function() {
      CriteriaService.toggleOwnTakeawaysCriteria();
    };
    
  });