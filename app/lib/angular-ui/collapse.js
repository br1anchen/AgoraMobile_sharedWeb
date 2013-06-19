angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition'])

// The collapsible directive indicates a block of html that will expand and collapse
.directive('collapse', ['$transition', function($transition) {

  return {
    link: function(scope, element, attrs) {
      var isCollapsed;
      var initialAnimSkip = attrs.initialAnimSkip || true;
      var widthOrHeight   = (attrs.collapseType == "horizontal") ? "width" : "height";
      var scrollType      = (widthOrHeight == "height") ? "scrollHeight" : "scrollWidth"

      // CSS transitions don't work with height: auto, so we have to manually change the height to a
      // specific value and then once the animation completes, we can reset the height to auto.
      // Unfortunately if you do this while the CSS transitions are specified (i.e. in the CSS class
      // "collapse") then you trigger a change to height 0 in between.
      // The fix is to remove the "collapse" CSS class while changing the height back to auto - phew!
      var fixUpSize = function(scope, element, size) {
        // We remove the collapse CSS class to prevent a transition when we change to height: auto
        element.removeClass('collapse');
        var p = {};
        p[widthOrHeight] = size;
        element.css(p);
        // It appears that  reading offsetWidth makes the browser realise that we have changed the
        // height already :-/
        var x = element[0].offsetWidth;
        var x = element[0].offsetHeight;
        element.addClass('collapse');
      };


      scope.$watch(function (){ return element[0][scrollType]; }, function (value) {
        //The listener is called when scollHeight changes
        //It actually does on 2 scenarios: 
        // 1. Parent is set to display none
        // 2. angular bindings inside are resolved
        //When we have a change of scrollHeight we are setting again the correct height if the group is opened
        if (element[0][scrollType] !== 0) {
          if (!isCollapsed) {
            var size = 'auto';
            if (initialAnimSkip) {
              size = element[0][scrollType] + 'px';
            }
            fixUpSize(scope, element, size);
          }
        }
      });
      
      scope.$watch(attrs.collapse, function(value) {
        if (value) {
          collapse();
        } else {
          expand();
        }
      });
      

      var currentTransition;
      var doTransition = function(change) {
        if ( currentTransition ) {
          currentTransition.cancel();
        }
        var animateFn = function(element){
          element.animate(change); 
        }
        currentTransition = $transition(element, animateFn);
        currentTransition.then(
          function() { currentTransition = undefined; },
          function() { currentTransition = undefined; }
        );
        return currentTransition;
      };

      var expand = function() {
        if (initialAnimSkip) {
          initialAnimSkip = false;
          if ( !isCollapsed ) {
            fixUpSize(scope, element, 'auto');
          }
        } else {
          var p = {};
          p[widthOrHeight] = element[0][scrollType] + 'px';
          doTransition(p)
          .then(function() {
            // This check ensures that we don't accidentally update the height if the user has closed
            // the group while the animation was still running
            if ( !isCollapsed ) {
              fixUpSize(scope, element, 'auto');
            }
          });
        }
        isCollapsed = false;
      };
      
      var collapse = function() {
        isCollapsed = true;
        if (initialAnimSkip) {
          initialAnimSkip = false;
          fixUpSize(scope, element, 0);
        } else {
          fixUpSize(scope, element, element[0][scrollType] + 'px');
          var p = {};
          p[widthOrHeight] = '0'
          doTransition(p);
        }
      };
    }
  };
}]);
