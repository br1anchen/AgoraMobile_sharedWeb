angular.module('link', []).
directive('activeLink', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            // element.bind('touchstart',function(){
            //     scope.color = element.css('color');
            //     scope.textShadow = element.css('text-shadow','0em 0em 0.4em');

            //     element.css('text-shadow','0em 0em 0.4em');
            //     // element.css('color','white');
            //     element.css('color','white');

            //     // alert("touchstart");
            // })
            // element.bind('touchend',function(){
            //     // element.css('color',"blue");
            //     element.css('text-shadow',scope.textShadow);

            //     // alert("touchend");
            // })


            var clazz = attrs.activeLink;
            var path = attrs.href;
            path = path.replace('#','/'); //parse hashbang to url path
            scope.location = $location;
            scope.$watch('location.path()', function(newPath) {
                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }

    };
}]);