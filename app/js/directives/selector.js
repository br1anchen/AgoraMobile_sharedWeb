app.directive('selector', function($dialog,$log) {
// app.directive('iFrameDialog', function() {
    return {
        restrict: 'A',
        replace: false,
        transclude: true,
        controller:function($scope){

        },
        template:
            '<select ng-transclude >'+
            '</select>'
        ,
        link: function(scope, element, attrs) {
            var element = $(element);
            element.on('click',function(){
                element.find('select')[0].focus();
                // element.find('select')[0].onclick();
                element.find('select').trigger('click');
            })
        }
    }
})