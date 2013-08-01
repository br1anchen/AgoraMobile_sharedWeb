'use strict';
//Activity Block Directive

app.directive('activityBlock', function factory($log,AppService) {
  var directiveObj = {
    priority: 0,
    replace: true,
    transclude: true,
    restrict: 'E',
    scope: {
      /*posterimg : "@",
      content : "@",
      fileurl : "@",
      filename : "@",
      date : "@"*/

      activity:"="
    },
    controller:function($scope){
      $scope.picURL = AppService.getBaseURL() +'/image' + $scope.activity.pic;
    },
    link: function postLink(scope, iElement, iAttrs) {

    },
    template: 
    '<div class="activityBlock">'+
        '<img class="peopleImg" ng-src="{{picURL}}"></img>' +
        '<span class="content"><span class="action" >{{activity.action}}</span>, <span class="reference">{{activity.reference}}</span></span>' +
        '<span class="date">{{activity.timestamp | timeago | camelcase}}</span>' +
    '</div>'
  };
  return directiveObj;
});