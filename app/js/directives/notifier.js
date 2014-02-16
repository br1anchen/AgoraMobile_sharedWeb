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
            '<div class="notifier" data-ng-click="delete()">'+
                '<span class="que">'+
                '   <i class="fa fa-exclamation-circle"></i>'+
                '   <span data-ng-bind="notificationQue.length" data-ng-hide="noQue"></span>'+
                '</span>'+ 
                '<span class="notification" ng-bind-html-unsafe="notification"></span>'+
            '</div>'
        ,
        link: function(scope, element, attrs) {
            element = $(element);
            element.css({
                'display':'none',
            });

            var que=element.find('.que');
            que.css({
                'padding-left':'0.2em'
                ,'position':'absolute'
                ,'display':'inline-block'
                ,'left':'0'
                ,'bottom':'0'
            });

            scope.$watch('notificationQue.length',function(newVal,oldVal){
                scope.noQue = (newVal > 0) ? false : true;
            })

            scope.notificationQue = [];
            var show =  false;
            //Listener for notification broadcasts
            $rootScope.$on("notification",function(e,notification){
                console.log("notification added: "+notification);
                if(!show){
                    scope.notification = notification;
                    flash();
                }
                else{
                    scope.notificationQue.push(notification);
                }
            })

            $rootScope.$on("removeNotification",function(e,notification){
                console.log("notification remove: " + notification);
                
                if(scope.notificationQue.length > 0){
                    scope.notificationQue = jQuery.grep(scope.notificationQue, function (note) {
                        return note != notification;
                    });
                    flash();
                }else{
                    hide();
                }
                
            })

            //Hide animation
            function hide(){
                if(show){
                    show = false;
                    //hide animation
                    switch(scope.animation){
                        case 'slideVertical':
                            element.slideUp();
                            que.slideUp();
                        break;
                        case 'fade':

                        break;
                    }
                }
            }

            //Flashes a notifivation
            function flash(){
                if(!show){
                    //Show animation
                    show = true;
                    switch(scope.animation){
                        case 'slideVertical':
                            element.slideDown();
                            que.slideDown();
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
                        hide();
                    }
                },3000);
            }

            scope.delete = function(){
                if(scope.notificationQue.length > 0){
                    scope.notification = scope.notificationQue.shift();
                    flash();
                }
                else{
                    hide();
                }
            }
        }
    }
})