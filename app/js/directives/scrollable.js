app.directive('scrollable', function($log,$q,$timeout,$rootScope) {
    //Global triggers used in controller and linking function
    var onUpdateTrigger;
    var onAppendTrigger;
    var onScrollTrigger;
    var onScrollDownTrigger;
    var onScrollUpTrigger;

    //Helper object for queing events
    function EventTrigger(fn){
        var que = [];
        var trigger = {
            append:function(fn){
                if(typeof(fn) == 'function'){
                    que.push(fn);
                }
                return this;
            },
            fire:function(){
                for(f in que){
                    que[f]();
                }
            }
        }
        return trigger.append(fn);
    }

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
            preventEmit:'='//Not implemented yet. Shoud be able to prevent $emit events with this
        },

        controller:function($scope){
            //Default configurations

            //Setting default criteria for the update function if given. Distance from the bottom
            $scope.triggerDistanceDefault = 150;// Distance from bottom at update event trigger

                onUpdateTrigger = EventTrigger(function(){
                    //Adding default emit events if not prevented
                    if(!$scope.preventEmit){
                        // $scope.$emit("scrollableUpdate"); //Default update functions
                        // $scope.$broadcast("scrollableUpdate");
                        $rootScope.$broadcast("scrollableUpdate");
                    }
                    //Validating and adding custom event trigger
                    if($scope.onUpdate && typeof($scope.onUpdate) == "function"){
                        $scope.onUpdate();                  
                    }
                })
                onAppendTrigger = EventTrigger(function(){
                    //Adding default emit events if not prevented
                    if(!$scope.preventEmit){
                        // $scope.$emit("scrollableAppend"); //Default update functions
                        // $scope.$broadcast("scrollableAppend");
                        $rootScope.$broadcast("scrollableAppend");
                    }
                    //Validating and adding custom event trigger
                    if($scope.onUpdate && typeof($scope.onUpdate) == "function"){
                        $scope.onAppend();                  
                    }
                })
                onScrollTrigger = EventTrigger(function(){
                    //Adding default emit events if not prevented
                    if(!$scope.preventEmit){
                        // $scope.$emit("scrolling"); //Default update functions
                        // $scope.$broadcast("scrolling");
                        $rootScope.$broadcast("scrolling");
                    }
                    //Validating and adding custom event trigger
                    if($scope.onUpdate && typeof($scope.onUpdate) == "function"){
                        $scope.onScroll();                  
                    }
                })
                onScrollDownTrigger = EventTrigger(function(){
                    //Adding default emit events if not prevented
                    if(!$scope.preventEmit){
                        // $scope.$emit("scrollingDown"); //Default update functions
                        // $scope.$broadcast("scrollingDown");
                        $rootScope.$broadcast("scrollingDown");
                    }
                    //Validating and adding custom event trigger
                    if($scope.onUpdate && typeof($scope.onUpdate) == "function"){
                        $scope.onScrollDown();                  
                    }
                })
                onScrollUpTrigger = EventTrigger(function(){
                    //Adding default emit events if not prevented
                    if(!$scope.preventEmit){
                        // $scope.$emit("scrollingUp"); //Default update functions
                        // $scope.$broadcast("scrollingUp");
                        $rootScope.$broadcast("scrollingUp");
                    }
                    //Validating and adding custom event trigger
                    if($scope.onUpdate && typeof($scope.onUpdate) == "function"){
                        $scope.onScrollUp();                  
                    }
                })
        },
        template:
            '<div class="scrollableWrapper">'+//Expands to height 100%
                '<div class="scrollableInnerWrapper">'+//Ajusts to the size of the parent
                    '<div class="scrollableContent" ng-transclude ></div>'+
                '</div>'+
            '</div>'
        ,
        link: function(scope, element, attrs) {
            
            //Setting up scrollable element by doing DOM stuff
            var wrapper = $(element);
            var innerWrapper = element.children();
            var content = innerWrapper.children();

            wrapper.css('position','relative');
            wrapper.css('height','100%');

            innerWrapper.css('position','absolute');

            innerWrapper.css('height',wrapper.height());
            innerWrapper.css('width',wrapper.width());
            innerWrapper.css('overflow-y','scroll');

            var prevScrollTop = innerWrapper.scrollTop(); // Used to determin scroll direction
            //Triggering update when scrolling is near the bottom
            innerWrapper.on('scroll',function(event){
                onScrollTrigger.fire();
                if( prevScrollTop < innerWrapper.scrollTop() ){//Scrolling down
                    onScrollDownTrigger.fire();
                    if( ( content.height() - (scope.triggerDistance || scope.triggerDistanceDefault) ) < (innerWrapper.height() + innerWrapper.scrollTop() ) ) {//Checking append criterias
                        scope.lastAppendHeight = innerWrapper.scrollTop();
                        onAppendTrigger.fire();
                    }
                }
                else if( prevScrollTop > innerWrapper.scrollTop() ){//Scrolling up
                    onScrollUpTrigger.fire()
                }
                prevScrollTop = innerWrapper.scrollTop();// To make sure only scrolling down triggers this event
            })

            wrapper.hammer().on('swipedown',function(event){
                if(innerWrapper.scrollTop() == 0){//If scrollable is at the top
                    $timeout(function(){onUpdateTrigger.fire()});
                }
            })
            wrapper.hammer().on('swipeup',function(event){
            })
        }
    }
})