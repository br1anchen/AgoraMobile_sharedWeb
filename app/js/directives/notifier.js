'use strict';

app.directive('notifier', function($log,$q,$timeout,$rootScope) {

    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope:{
            animation:'=',
            height:'@'
        },
        controller:function($scope){
                
        },
        template:
            '<div class="notifier">'+
                '<span class="notification" data-ng-bind=notification></span>'+
            '</div>'
        ,
        link: function(scope, element, attrs) {
            element = $(element);
            element.css('display','none');

            scope.notificationQue = [];

            //Litsents for notification broadcasts
            $rootScope.$on("notification",function(e,notification){
                console.log("notifyinit")
                if(!scope.show){
                    scope.notification = notification;
                    flash();
                }
                else{
                    scope.notificationQue.push(notification);
                }
            })
            scope.show =  false;                
            //Flashes a notifivation
            function flash(){
                $timeout(function(){scope.show = true;});
                $timeout(function(){
                    //Flashes a new notification if present
                    if(scope.notificationQue.length > 0){
                        scope.notification = scope.notificationQue.shift();
                        flash();

                    }
                    else{
                        scope.show = false;
                    }
                },3000);
            }

            scope.$watch('show',function(newValue,oldValue){
                console.log(scope.animation);
                if(newValue){
                    switch(scope.animation){
                        case 'slideVertical':
                            element.slideDown();
                        break;
                        case 'fade':

                        break;
                    }
                }
                else{
                    switch(scope.animation){
                        case 'slideVertical':
                            element.slideUp();
                        break;
                        case 'fade':

                        break;
                    }
                }
            })
        }
    }
})