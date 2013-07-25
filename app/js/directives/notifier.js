app.directive('notifier', function($log,$q,$timeout,$rootScope) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,

        controller:function($scope){
            // $scope.$on("notify",function(){
            //     alert("directive triggered");
            // })

            // $rootScope.$on("notify",function(){
            //     alert("directive triggered");
            // })
        },
            
        template:
            '<div class="notifier" data-ng-bind=notification>'+
            '</div>'
        ,
        link: function(scope, element, attrs) {
            element = $(element);
            element.css('display','none');
            $rootScope.$watch("notify",function(oldVal,newVal){
                // alert("directive triggered");
                scope.notification = newVal;
                element.fadeIn();
                $timeout(function(){
                    element.fadeOut();
                },3000);
            })
        }
    }
})