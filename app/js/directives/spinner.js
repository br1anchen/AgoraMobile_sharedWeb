'use strict';

app.directive('spinner', function($log) {

    return {
        restrict: 'A',
        replace: false,
        link: function(scope, element, attrs) {
            element = $(element);

            var opts = {
                lines: scope.lines, // The number of lines to draw
                length: scope.length, // The length of each line
                width: scope.width, // The line thickness
                radius: scope.radius, // The radius of the inner circle
                corners: scope.corners, // Corner roundness (0..1)
                rotate: scope.rotate, // The rotation offset
                direction: scope.direction, // 1: clockwise, -1: counterclockwise
                color: attrs.loadingColor ? ('#'+attrs.loadingColor) : '#000', // #rgb or #rrggbb
                speed: scope.speed, // Rounds per second
                trail: scope.trail, // Afterglow percentage
                shadow: scope.shadow, // Whether to render a shadow
                hwaccel: scope.hwaccel, // Whether to use hardware acceleration
                className: scope.className, // The CSS class to assign to the spinner
                zIndex: scope.zIndex, // The z-index (defaults to 2000000000)
                // top: 'auto', // Top position relative to parent in px
                // left: 'auto' // Left position relative to parent in px
                top: element.height()/2+"px", // Top position relative to parent in px
                left: element.width()/2+"px" // Left position relative to parent in px. Subtrackting because of the scrollbar
            };
            var spinner = new Spinner(opts);
            scope.$watch('loading',function(value){
                if(value == "true"){
                    spinner.spin(element[0]);
                }else if(value == "false"){
                    spinner.stop();
                }
            })
        }
    }
})