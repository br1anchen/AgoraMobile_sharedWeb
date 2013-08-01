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
                '<span class="notification" ng-bind-html-unsafe="notification"></span>'+
            '</div>'
        ,
        link: function(scope, element, attrs) {
            element = $(element);
            element.css('display','none');

            scope.notificationQue = [];
            var show =  false;
            //Listener for notification broadcasts
            $rootScope.$on("notification",function(e,notification){
                console.log("notification added:"+notification)
                if(!show){
                    scope.notification = notification;
                    flash();
                }
                else{
                    scope.notificationQue.push(notification);
                }
            })
            //Flashes a notifivation
            function flash(){
                if(!show){
                    //Show animation
                    show = true;
                    switch(scope.animation){
                        case 'slideVertical':
                            element.slideDown();
                        break;
                        case 'fade':

                        break;
                    }
                }
                $timeout(function(){
                    //Flashes a new notification if present
                    if(scope.notificationQue.length > 0){
                        scope.notification = scope.notificationQue.shift();
                        flash();

                    }
                    else{
                        show = false;
                        //hide animation
                        switch(scope.animation){
                            case 'slideVertical':
                                element.slideUp();
                            break;
                            case 'fade':

                            break;
                        }
                    }
                },3000);
            }
        }
    }
})