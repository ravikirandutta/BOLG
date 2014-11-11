app.controller('publicPrivateButtonCtrl',
  function($scope, $http, $cookies, $resource, UserProfileDataFactory, $rootScope, UserProfile, TakeAwayFactory, ClassmatesDataFactory, ShareWithGroupsFactory, CourseDataFactory, GroupsDataFactory, TakeAwayConverter, GroupsFactory) {
    $scope.share = {};
    $scope.taShare = {};
    $scope.taShare.groups = [];
    $scope.share.visibility = "me";
    $scope.groups = GroupsDataFactory.getCurrentCourseGroups();
    $scope.courseInstanceId = CourseDataFactory.getCurrentCourse();
    $scope.initialShareList = [];
    $scope.createGroup = {};
    $scope.createGroup.addGroup = false;
    $scope.classmates = ClassmatesDataFactory.getCurrentCourseClassmates();
    $scope.newGroup = {};
    $scope.userProfile = UserProfileDataFactory.getUserProfile();
    if ($scope.taset.is_public) {
      $scope.share.visibility = "everyone";
    } else {
      $scope.share.visibility = "me";
    }
    if ($scope.taset.id) {
      var groupsArray = [];
      /*
        $scope.taset.shared_takeaways.forEach(function(item){
          groupsArray.push(item.group);
        });

*/
      $scope.taShare.groups = groupsArray;
      $scope.initialShareList = groupsArray.slice();
      if (groupsArray.length > 0) {
        $scope.share.visibility = "groups"
      }
    }



    /*Public private buttons method */
    $scope.toggleButtons = function(postImmediately) {

      if ($scope.share.visibility == "me") {
        $scope.taset.is_public = false;
        $scope.taShare.groups = [];
      } else if ($scope.share.visibility == "everyone") {
        $scope.taset.is_public = true;
        $scope.taShare.groups = [];
      } else {
        if ($scope.taShare.groups && $scope.taShare.groups.length == 0) {
          $scope.share.visibility = "me";
        }
        $scope.taset.is_public = false;
      }

      taset = $scope.taset;
      //From Edit takeaway or New Takeaway, onchange of public-private option do not make service call to update.
      if (postImmediately == true || postImmediately == 'true') {
        var tagIdArr = new Array();
        _.each(taset.tags, function(tagId) {
          tagIdArr.push(tagId.id);
        });

        var modifiedTakeawayObj = TakeAwayConverter.convert(taset);


        TakeAwayFactory.update({
            id: taset.id
          }, modifiedTakeawayObj).$promise
          .then(function(data, status, headers, config) {
            console.log("Successfully updated public flag in server");
          }, function(data, status, headers, config) {
            $scope.status = status;
          });


        $scope.taShare.groups.forEach(function(item) {

          if ($scope.initialShareList.indexOf(item) == -1) {
            ShareWithGroupsFactory.updateShare({
              group: item,
              shared_type: "GROUP",
              shared_by: $scope.userProfile.id,
              takeaway: $scope.taset.id
            });
          }
        });
        $scope.initialShareList.forEach(function(item) {
          if ($scope.taShare.groups.indexOf(item) == -1) {
            ShareWithGroupsFactory.get({
              group: item,
              takeaway: $scope.taset.id
            }).$promise.then(function(data) {
              ShareWithGroupsFactory.removeGroupFromShare({
                id: data.results[0].id
              });
            });

          }

        });
        if ($scope.newGroup.name && $scope.newGroup.members.length > 0) {
          GroupsFactory.save({
            group_name: $scope.newGroup.name,
            course_instance: $scope.courseInstanceId,
            created_by: $cookies.userid,
            group_updated_by: $cookies.userid,
            members: $scope.newGroup.members
          }, function(data) {
            $scope.newGroup.name = null;
            $scope.newGroup.members = [];
            $scope.groups.push(data);
            GroupsDataFactory.setCurrentCourseGroups($scope.groups);
            ShareWithGroupsFactory.updateShare({
              group: data.id,
              shared_type: "GROUP",
              shared_by: $scope.userProfile.id,
              takeaway: $scope.taset.id
            }, function(res) {
              $scope.taShare.groups.push(data.id);
              $scope.initialShareList = $scope.taShare.groups.slice();
              $scope.share.visibility = 'groups'
            });
          })
        }

      } else {
        if ($scope.newGroup.name && $scope.newGroup.members.length > 0) {
          GroupsFactory.save({
            group_name: $scope.newGroup.name,
            course_instance: $scope.courseInstanceId,
            created_by: $cookies.userid,
            group_updated_by: $cookies.userid,
            members: $scope.newGroup.members
          }, function(data) {
            $scope.groups.push(data);
            GroupsDataFactory.setCurrentCourseGroups($scope.groups);
            $scope.taShare.groups.push(data.id);
            $scope.taset.createAndAddToGroups = $scope.taShare.groups;
            $scope.newGroup.name = undefined;
            $scope.newGroup.members = [];
            $scope.share.visibility = 'groups'

          });
        }

      }

      $scope.createGroup.addGroup = false;
    };

  });