app.directive('scrollable', function($log) {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope:{
            onUpdate:'&',//Optional updatefunction
            onAppend:'&',//Optional get more content function
            onScroll:'&',//Optional trigger function
            onScrollDown:'&',//Optional trigger function
            onScrollUp:'&',//Optional trigger function
            triggerDistance:'=',//Optional trigger configuration
            broadcast:'='
        },

        controller:function($scope){
           
        },
        template:
            '<div class="scrollableWrapper">'+//Expands to height 100%
                '<div class="scrollableInnerWrapper">'+//Ajusts to the size of the parent
                    '<div class="scrollableContent" ng-transclude ></div>'+
                '</div>'+
            '</div>'
            // '<div id="meta"></div>'
        ,
        link: function(scope, element, attrs) {
            //Default configurations
            var triggerDistanceDefault = 150// Distance from bottom at update event trigger
            var onUpdateDefault = function(){
                scope.$broadcast("updateScrollable"); //Default update function
            }
            var onAppendDefault = function(){
                scope.$broadcast("appendScrollable"); //Default update function
            }
            var onScrollDefault = function(){
                scope.$broadcast("scrolling"); //Default update function
            }
            var onScrollDownDefault = function(){
                scope.$broadcast("scrollingUp"); //Default update function
            }
            var onScrollUpDefault = function(){
                scope.$broadcast("scrollingDown"); //Default update function
            }

            //Setting default configurations is not set
                //Setting default criteria for the update function. Distance from the bottom
                scope.triggerDistance = scope.triggerDistance || triggerDistanceDefault;
                
                //Setting default update function
                if(!scope.onUpdate && typeof(scope.onUpdate) == "function"){
                    scope.onUpdate = onUpdateDefault;
                }
                //Setting default append function
                if(!scope.onAppend && typeof(scope.onAppend) == "function"){
                    scope.onAppend = onAppendDefault;
                }
                //Setting default onScroll function
                if(!scope.onScroll && typeof(scope.onScroll) == "function"){
                        scope.onScroll = onScrollDefault;
                }
                //Setting default scroll up the update function
                if(!scope.onScrollDown && typeof(scope.onScrollDown) == "function"){
                    scope.onScrollDown = onScrollDownDefault;
                }
                //Setting default scroll down for the update function
                if(!scope.onScrollUp && typeof(scope.onScrollUp) == "function"){
                    scope.onScrollUp = scope.onScrollUpDefault;
                }

            //Setting up scrollable element by doing DOM stuff
            var wrapper = $(element);
            var innerWrapper = element.children();
            var content = innerWrapper.children();

            wrapper.css('height','100%');
            innerWrapper.css('position','absolute');

            innerWrapper.css('height',wrapper.height());
            innerWrapper.css('width',wrapper.width());
            innerWrapper.css('overflow-y','scroll');

            var prevScrollTop = innerWrapper.scrollTop();
            //Triggering update when scrolling is near the bottom
            innerWrapper.on('scroll',function(event){
                if( (prevScrollTop < innerWrapper.scrollTop()) ){

                    if((content.height() - scope.triggerDistance) < (innerWrapper.height() + innerWrapper.scrollTop())){
                        scope.lastAppendHeight = innerWrapper.scrollTop();
                        scope.onAppend();
                    }
                };
                prevScrollTop = innerWrapper.scrollTop();// To make sure only scrolling down triggers this event
            })

            wrapper.hammer().on('swipedown',function(event){
                if(innerWrapper.scrollTop() == 0){//If scrollable is at the top
                    scope.onUpdate();
                }
            })
            wrapper.hammer().on('swipeup',function(event){
            })
            // wrapper.on('touchmove',function(){
            //     scope.touchDistance = 
            // }
            // wrapper.on('touchstart',function(){
                
            // })
            // content.css('height','200px');
            // content.css('padding-bottom','100px');


        }
    }
})