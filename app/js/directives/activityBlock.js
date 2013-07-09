'use strict';
//Activity Block Directive

app.directive('activityBlock', function factory($log) {
  var directiveObj = {
    priority: 0,
    template: 
      '<div>'+
          ''+
      '</div>',
    replace: true,
    transclude: true,
    restrict: 'E',
    scope: {
      activity:"="
    },
    controller: ['$scope', '$element', '$attrs', '$transclude',function($scope, $element, $attrs, $transclude){
      
    }],
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {  },
        post: function postLink(scope, iElement, iAttrs, controller) {  }
      }
    },
    link: function postLink(scope, iElement, iAttrs) {

    }
  };
  return directiveObj;
});