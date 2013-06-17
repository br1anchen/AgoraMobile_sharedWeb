app.directive('testDirective', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller:function($scope){
            $scope.smiley = ":)";
            $scope.addSmiley = function(){
                
            }
        },
        template:
        '<div id="testDirective">'+
            '<button data-ng-click="addSmiley()">{{button}}'+
        '</div>'
        ,
        link: function(scope, element, attrs) {
            var element = $(element);
            scope.addSmiley = function(){
                element.append(scope.smiley+scope.button);
            }
        }
    }
})