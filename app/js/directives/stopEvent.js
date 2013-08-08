app.directive('stopEvent', function() {
    return {
        restrict: 'A',
        replace: false,
        link: function(scope, element, attrs) {
            var element = $(element);
            var event = attrs.stopEvent;
            element.bind(event,function(e){
                e.stopPropagation();
            })
        }
    }
})