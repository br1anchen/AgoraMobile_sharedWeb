'use strict';
//Activity Block Directive

app.directive('activityBlock', function factory($log) {
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
    controller: ['$scope', '$element', '$attrs', '$transclude',function($scope, $element, $attrs, $transclude){
      
    }],
    link: function postLink(scope, iElement, iAttrs) {

    },
    template: 
    '<div id="activityBlock">'+
        '<img id="peopleImg" src="{{activity.posterImg}}"></img>' +
        '<p id="date">{{activity.timestamp}}</p>' +
        '<a id="file" href="{{activity.file}}">{{activity.fileName}}</a>' +
        '<h3 id="content">{{activity.body}}</h3>' +
    '</div>'
  };
  return directiveObj;
});