'use strict';

app.directive('gestureBroadcast', function($log,$timeout) {

    return {
        restrict: 'A',
        replace: false,
        transclude: false,
        link: function(scope, element, attrs) {
            element.hammer().on('swipeleft',function(event){
                $timeout(function(){
                    scope.$broadcast('swipeleft',
                        {
                            id:attrs.id,
                            element:element
                        }
                    )
                });
                console.log("gestureBradcast: broadcasting swipeleft");
            })
            element.hammer().on('swiperight',function(event){
                $timeout(function(){

                    scope.$broadcast('swiperight',
                        {
                            id:attrs.id,
                            element:element
                        }
                    )
                })   
                console.log("gestureBradcast: broadcasting swiperight");
            })
            element.hammer().on('swipeup',function(event){
                $timeout(function(){

                    scope.$broadcast('swipeup',
                        {
                            id:attrs.id,
                            element:element
                        }
                    )
                })
                console.log("gestureBradcast: broadcasting swipeup");
            })
            element.hammer().on('swipedown',function(event){
                $timeout(function(){

                    scope.$broadcast('swipedown',
                        {
                            id:attrs.id,
                            element:element
                        }
                    )
                })
                console.log("gestureBradcast: broadcasting swipedown");
            })
        }
    }
})