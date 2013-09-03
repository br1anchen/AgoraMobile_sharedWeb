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
            triggerDistance:'@',//Optional trigger configuration
            preventEvents:'@',//Not implemented yet. Shoud be able to prevent $emit events with this
            loading:'@',
            loadingColor:'@',
            scrollEase:'@'
        },

        controller:function($scope){
            //Default configurations
            
            //Setting default criteria for the update function if given. Distance from the bottom
            $scope.triggerDistanceDefault = 150;// Distance from bottom at update event trigger

                onUpdateTrigger = EventTrigger(function(){
                    //Adding default emit events if not prevented
                    if(!$scope.preventEvents){
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
                    if(!$scope.preventEvents){
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
                    if(!$scope.preventEvents){
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
                    if(!$scope.preventEvents){
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
                    if(!$scope.preventEvents){
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

            //Setting default values if attributes not set
            attrs.$observe( 'scrollEase', function( val ) {
                scope.scrollEase = angular.isDefined( val ) ? val : 0;
            });

            //Setting up scrollable element by doing DOM stuff

            var wrapper = $(element);
            var innerWrapper = element.children();
            var content = innerWrapper.children();

            function updateScrollEase(){
                var contentOverflow = content.height() - innerWrapper.height();
                scope.sEase = (contentOverflow <= scope.scrollEase) ? 0 : scope.scrollEase;
            }
            updateScrollEase();

            wrapper.css('position','relative');
            wrapper.css('height','100%');

            innerWrapper.css('position','absolute');

            // innerWrapper.css('height',wrapper.height());
            innerWrapper.css('height','100%');
            innerWrapper.css('width','100%');
            innerWrapper.css('overflow-y','scroll');
            innerWrapper.css('overflow-x','hidden');
            innerWrapper.css('-webkit-overflow-scrolling','touch');


            var prevScrollTop = innerWrapper.scrollTop(); // Used to determin scroll direction
            //Triggering update when scrolling is near the bottom
            innerWrapper.on('scroll',function(event){
                updateScrollEase();
                if( Math.abs( innerWrapper.scrollTop() - prevScrollTop) > scope.sEase){
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
                }
            })

            wrapper.hammer().on('swipedown',function(event){
                if(innerWrapper.scrollTop() == 0){//If scrollable is at the top
                    $timeout(function(){onUpdateTrigger.fire()});
                }
            })
            wrapper.hammer().on('swiperight',function(event){
                console.log("swipeRight")
                $timeout(function(){$rootScope.$broadcast("swipeRight")});
            })
            wrapper.hammer().on('swipeleft',function(event){
                $timeout(function(){$rootScope.$broadcast("swipeLeft")});
                console.log("swipeLeft")
            })

            var opts = {
                lines: scope.lines, // The number of lines to draw
                length: scope.length, // The length of each line
                width: scope.width, // The line thickness
                radius: scope.radius, // The radius of the inner circle
                corners: scope.corners, // Corner roundness (0..1)
                rotate: scope.rotate, // The rotation offset
                direction: scope.direction, // 1: clockwise, -1: counterclockwise
                color: attrs.loadingColor ? ('#'+attrs.loadingColor) : '#000', // #rgb or #rrggbb
                speed: scope.speed, // Rounds per second
                trail: scope.trail, // Afterglow percentage
                shadow: scope.shadow, // Whether to render a shadow
                hwaccel: scope.hwaccel, // Whether to use hardware acceleration
                className: scope.className, // The CSS class to assign to the spinner
                zIndex: scope.zIndex, // The z-index (defaults to 2000000000)
                // top: 'auto', // Top position relative to parent in px
                // left: 'auto' // Left position relative to parent in px
                top: innerWrapper.height()/2+"px", // Top position relative to parent in px
                left: innerWrapper.width()/2 -22+"px" // Left position relative to parent in px. Subtrackting because of the scrollbar
            };
            var spinner = new Spinner(opts);

            scope.$watch('loading',function(value){
                if(value == "true"){
                    spinner.spin(wrapper[0]);
                }else if(value == "false"){
                    spinner.stop();
                }
            })
        }
    }
})