app.factory('TakeAwayConverter', function() {
  var convert = function(taset) {
    var tagIds = [];
    angular.forEach(taset.tags, function(tag) {
      if (tag.id) {
        tagIds.push(tag.id);
      }
    });
    var convertedTakeAwayObject = {
      id: taset.id,
      notes: taset.notes,
      //user: $cookies.userid,
      user: taset.user.id,
      courseInstance: taset.session.courseInstance,
      session: taset.session.id,
      is_public: taset.is_public,
      tags: tagIds,
      average_rating: taset.average_rating,
      total_raters: taset.total_raters
    };
    return convertedTakeAwayObject;
  };
  return {
    convert: convert
  }
});
app.factory('Comments', ['$resource',
  function($resource) {
    return $resource('/comments/', {}, {
      query: {
        method: 'GET',
        isArray: false
      },
      save: {
        method: 'POST'
      },
      edit: {
        url: '/comments/:id/',
        method: 'PUT'
      }
    });
  }
]);
app.factory('CoursesFactory', ['$resource',
  function($resource) {
    return $resource('/courseInstances/', {}, {
      query: {
        method: 'GET',
        isArray: false
      },
      save: {
        method: 'POST'
      }
    });
  }
]);
app.factory('SessionsFactory', ['$resource',
  function($resource) {
    return $resource('/sessions/', {}, {
      query: {
        method: 'GET',
        isArray: false
      },
      save: {
        method: 'POST'
      },
      edit: {
        url: '/sessions/:id/',
        method: 'PUT'
      }
    });
  }
]);
app.factory('TakeAwayFactory', ['$resource',
  function($resource) {
    return $resource('/takeaways/', {}, {
      query: {
        method: 'GET',
        isArray: false
      },
      save: {
        method: 'POST'
      },
      update: {
        url: '/takeaways/:id/',
        method: 'PUT'
      },
      remove: {
        url: '/takeaways/:id/',
        method: 'DELETE'
      }
    });
  }
]);
app.factory('RatingFactory', ['$resource',
  function($resource) {
    return $resource('/ratings/', {}, {
      query: {
        method: 'GET',
        isArray: false
      },
      save: {
        method: 'POST'
      }
    });
  }
]);
app.factory('FavoritesFactory', ['$resource',
  function($resource) {
    return $resource('/favorites/', {}, {
      query: {
        method: 'GET',
        isArray: false
      },
      save: {
        method: 'POST'
      },
      remove: {
        url: '/favorites/:id/',
        method: 'DELETE'
      }
    });
  }
]);
app.factory('TagsFactory', ['$resource',
  function($resource) {
    return $resource('/tags/', {}, {
      query: {
        method: 'GET',
        isArray: false
      },
      save: {
        method: 'POST'
      }
    });
  }
]);
app.factory('UserPermission', ['$resource', function($resource) {
  return $resource('/can_user_post/', {}, {
    query: {
      method: 'GET',
      isArray: false
    },
  })
}]);
app.factory('LeaderboardFactory', ['$resource', function($resource) {
  return $resource('/get_leader_board/', {}, {
    query: {
      method: 'GET',
      isArray: false
    },
  })
}]);
app.factory('GroupsFactory', ['$resource', function($resource) {
  return $resource('/closedGroups/', {}, {
    query: {
      method: 'GET',
      isArray: false
    },
    save: {
      method: 'POST'
    }
  })
}]);
app.factory('ShareWithGroupsFactory', ['$resource', function($resource) {
  return $resource('/sharedTakeaway/', {}, {
    query: {
      method: 'GET',
      isArray: false
    },
    updateShare: {
      method: 'POST'
    },
    removeGroupFromShare: {
      url: '/sharedTakeaway/:id/',
      method: 'DELETE'
    }
  })
}]);
app.factory('UserProfile', ['$resource', function($resource) {
  return $resource('/takeawayprofiles/', {}, {
    query: {
      method: 'GET',
      isArray: false
    }
  });
}]);
app.factory('CriteriaService', function() {
  var criteria = {};
  return {
    getCriteria: function() {
      return criteria;
    },
    setTagSearchCriteria: function(criteriaObject) {
      if (!criteria.tagSearch) {
        criteria.tagSearch = [];
      }
      criteria.tagSearch.push(criteriaObject.value);
    },
    toggleFavoriteCriteria: function() {
      /*if(criteriaObject.searchTerm === "textSearch")
        criteria.searchTerm = criteriaObject.value;
      */
      criteria.filterFavorites = !criteria.filterFavorites;
    },
    removeTagFromSearchCriteria: function(tagToBeRemoved) {
      if (criteria.tagSearch) {
        var index = criteria.tagSearch.indexOf(tagToBeRemoved);
        criteria.tagSearch.splice(index, index + 1);
      }
    }
  }
});
app.factory('TakeawaysSinceLastLoginFactory', function() {
  var isVisible = true;
  return {
    isVisible: function() {
      return isVisible;
    },
    setIsVisible: function(showTakeAwaysSLLDialog) {
      isVisible = showTakeAwaysSLLDialog;
    }
  }
});
app.factory('GroupsDataFactory', function() {
  var currentCourseGroups = [];
  var currentCourseGroupsIdArray = [];
  var service = {};
  service.setCurrentCourseGroups = function(courseGroups) {
    currentCourseGroups = courseGroups;
    angular.forEach(currentCourseGroups, function(grp) {
      currentCourseGroupsIdArray.push(grp.id);
    });
  };
  service.getCurrentCourseGroups = function() {
    return currentCourseGroups;
  };
  service.getCurrentCourseGroupsIdArray = function() {
    return currentCourseGroupsIdArray;
  }
  return service;
});
app.factory('ClassmatesDataFactory', function() {
  var currentCourseClassmates = [];
  var service = {};
  service.setCurrentCourseClassmates = function(classMates) {
    currentCourseClassmates = classMates;
  }
  service.getCurrentCourseClassmates = function() {
    return currentCourseClassmates;
  }
  return service;
});
app.factory('UserProfileDataFactory', function() {
  var userProfile = {};
  var service = {};
  service.getUserProfile = function() {
    return userProfile;
  }
  service.setUserProfile = function(usrProf) {
    userProfile = usrProf;
  }
  return service;
});
app.factory('CourseDataFactory', function() {
  var defaultCourseSet = false;
  var data = [];
  var currentCourseInstance;
  var service = {};
  service.setCurrentCourse = function(course) {
    currentCourseInstance = course;
  };
  service.setUserCanPost = function(course, userCanPost) {
    if (!data[course]) {
      data[course] = {};
    }
    data[course].userCanPost = userCanPost;
  };
  service.setUserPermissionDetail = function(course, userPermissionDetail) {
    if (!data[course]) {
      data[course] = {};
    }
    data[course].userPermissionDetail = {};
    data[course].userPermissionDetail.remaining_rating_count_till_create = userPermissionDetail.remaining_rating_count_till_create;
  };
  service.decrementRatingCountNeededToCreateTakeaway = function() {
    data[currentCourseInstance].userPermissionDetail.remaining_rating_count_till_create = data[currentCourseInstance].userPermissionDetail.remaining_rating_count_till_create - 1;
  };
  service.getCurrentCourse = function() {
    return currentCourseInstance;
  };
  service.findIfUserCanPost = function(currentCourse) {
    return !(data[currentCourse].userPermissionDetail.remaining_rating_count_till_create > 0);
  };
  service.findUserPermissionDetail = function(currentCourse) {
    return data[currentCourse].userPermissionDetail;
  };
  service.setDefaultCourse = function() {
    defaultCourseSet = true;
  }
  service.getDefaultCourse = function() {
    return defaultCourseSet
  }
  return service;
});
app.factory('SessionsDataFactory', function(TagsDataFactory, TagsFactory, $cookies, $location, $timeout, $anchorScroll, $document) {
  var sessionsData = {};
  return {
    setSessionData: function(sessions) {
      sessionData = sessions.results;
    },
    getSessionData: function() {
      return sessionData;
    },
    addTakeAwayToSessions: function(takeaway) {
      var tags = [];
      angular.forEach(takeaway.tags, function(tag) {
        var tagForId = TagsDataFactory.getTagForId(tag);
        tags.push(tagForId);
      });
      takeaway.tags = tags;
      angular.forEach(sessionData, function(session) {
        if (session.id === takeaway.session) {
          takeaway.isOwner = true;
          takeaway.courseInstance = {};
          takeaway.courseInstance.id = session.courseInstance.id;
          takeaway.session = {};
          takeaway.session.id = session.id;
          takeaway.session.courseInstance = session.courseInstance.id;
          takeaway.user = {};
          takeaway.user.id = $cookies.userid;
          var localizedTime = $.localtime.toLocalTime(takeaway.created_dt, 'MM/dd/yy HH:mm');
          takeaway.created_dt = localizedTime;
          session.takeaway_set.push(takeaway);
        }
      });
      $timeout(function() {
        var container = angular.element(document.getElementById('takeaway-container'));
        var section2 = angular.element(document.getElementById(takeaway.id));
        //container.scrollTo(section2, 0, 1000);
        $document.scrollToElementAnimated(section2, 100);
      }, 500);
    },
    removeTakeawayFromSessions: function(takeaway) {
      angular.forEach(sessionData, function(session) {
        if (session.id === takeaway.session.id) {
          var index = 0;
          angular.forEach(session.takeaway_set, function(takeawayObject) {
            if (takeaway.id === takeawayObject.id) {
              session.takeaway_set.splice(index, index + 1);
            }
            index++;
          });
        }
      });
    }
  }
});
app.factory('TagsDataFactory', function(TagsFactory) {
  var tagsData = [];
  return {
    getTagForId: function(id) {
      var tagFound;
      angular.forEach(tagsData, function(tag) {
        if (tag.id === id) {
          tagFound = tag;
        }
      });
      return tagFound;
    },
    setTags: function(tagsData) {
      tagsData = tagsData;
    },
    addTag: function(tag) {
      tagsData.push(tag.toJSON());
    },
    getTags: function() {
      TagsFactory.query().$promise.then(function(data) {
        tagsData = data.results;
      }, function() {});
    }
  }
});