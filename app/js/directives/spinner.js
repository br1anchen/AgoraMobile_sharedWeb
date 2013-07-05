app.directive('spinner', function($log) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:{
            show:'=',
            lines: '=', // The number of lines to draw
            length: '=', // The length of each line
            width: '=', // The line thickness
            radius: '=', // The radius of the inner circle
            corners: '=', // Corner roundness (0..1)
            rotate: '=', // The rotation offset
            direction: '=', // 1: clockwise, -1: counterclockwise
            color: '=', // #rgb or #rrggbb
            speed: '=', // Rounds per second
            trail: '=', // Afterglow percentage
            shadow: '=', // Whether to render a shadow
            hwaccel: '=', // Whether to use hardware acceleration
            className: '=', // The CSS class to assign to the spinner
            zIndex: '=', // The z-index (defaults to 2000000000)
            // top: 'auto', // Top position relative to parent in px
            // left: 'auto' // Left position relative to parent in px
            top: '=', // Top position relative to parent in px
            left: '=' // Left position relative to parent in px
        },

        controller:function($scope,$attrs){
           //  //Setting default values to isolated scope
           // $attrs.$observe( 'length', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.length = 6;
           //      }
           //  });
           // $attrs.$observe( 'width', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.width = 4;
           //      }
           //  });
           // $attrs.$observe( 'radius', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.radius = 7;
           //      }
           //  });
           // $attrs.$observe( 'corners', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.corners = 1.0;
           //      }
           //  });
           // $attrs.$observe( 'rotate', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.rotate = 32;
           //      }
           //  });
           // $attrs.$observe( 'direction', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.direction = 1;
           //      }
           //  });
           // $attrs.$observe( 'color', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.color = '#000';
           //      }
           //  });
           // $attrs.$observe( 'speed', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.speed = 1;
           //      }
           //  });
           // $attrs.$observe( 'trail', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.trail = 61;
           //      }
           //  });
           // $attrs.$observe( 'shadow', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.shadow = false;
           //      }
           //  });
           // $attrs.$observe( 'hwaccel', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.hwaccel = false;
           //      }
           //  });
           // $attrs.$observe( 'className', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.className = 'spinner';
           //      }
           //  });
           // $attrs.$observe( 'zIndex', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.zIndex = 2e9;
           //      }
           //  });
           // $attrs.$observe( 'top', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.top = '0em';
           //      }
           //  });
           // $attrs.$observe( 'left', function(val) {
           //      if ( !angular.isDefined( val ) ) {
           //          $scope.left = '0em';
           //      }
           //  });


        },
        template:
            '<div data-ng-transclude>'+
            '</div>'
        ,
        link: function(scope, element, attrs) {
            var element = $(element);
            // element.css('position','relative');
            // element.css('width','100px');
            // element.css('height','100px');
            // element.css('z-index','10');
            var opts = {
                lines: scope.lines, // The number of lines to draw
                length: scope.length, // The length of each line
                width: scope.width, // The line thickness
                radius: scope.radius, // The radius of the inner circle
                corners: scope.corners, // Corner roundness (0..1)
                rotate: scope.rotate, // The rotation offset
                direction: scope.direction, // 1: clockwise, -1: counterclockwise
                color: scope.color ? ('#'+scope.color) : '#000', // #rgb or #rrggbb
                speed: scope.speed, // Rounds per second
                trail: scope.trail, // Afterglow percentage
                shadow: scope.shadow, // Whether to render a shadow
                hwaccel: scope.hwaccel, // Whether to use hardware acceleration
                className: scope.className, // The CSS class to assign to the spinner
                zIndex: scope.zIndex, // The z-index (defaults to 2000000000)
                // top: 'auto', // Top position relative to parent in px
                // left: 'auto' // Left position relative to parent in px
                // top: scope.top, // Top position relative to parent in px
                // left: scope.left // Left position relative to parent in px
                top: '50%', // Top position relative to parent in px
                left: '50%' // Left position relative to parent in px
            };
            var spinner = new Spinner(opts).spin(element[0]);

            scope.$watch('show',function(value){
                if(value){
                    spinner.spin(element[0]);
                }else{
                    spinner.stop();
                }
            })
        }
    }
})