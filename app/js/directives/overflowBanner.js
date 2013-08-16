'use strict';

app.directive('overflowBanner', function($log,$timeout) {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        $scope:{
            carousel:'=',//Not implemented
            duration:'=',
        },
        template:
        '<div class="overflowBanner">'+
        '   <span class="bannerContent" data-ng-transclude >'+
        '   </span>'+
        '</div>'

        ,link: function(scope, element, attrs) {
            element = $(element);
            var span = element.find('.bannerContent');

            span.css({
                'white-space': 'nowrap',
                'display': 'inline-block',
                'width':'initial'
            })

            element.css({
                'overflow':'hidden',
            })

            $timeout(function(){
                scope.duration = scope.duration ? scope.duration : 2000

                span.animate(
                    {
                        textIndent: "-" + (span.width() - element.width()) + "px"
                    }
                    ,{
                        duration:scope.duration,
                        easing: "linear",
                        complete:function(){
                            span.css(
                                "textIndent", "0px"
                            );
                        }
                    }
                )
            },1000)
        }
    }
})