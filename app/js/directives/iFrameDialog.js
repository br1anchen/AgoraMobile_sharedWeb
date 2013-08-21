app.directive('iFrameDialog', function($dialog,$log,UtilityService) {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:{
            url:'@',
            lable:'@'
        },
        controller:function($scope){
            $scope.launch = function(){
                var ref = UtilityService.inAppBrowser.browser($scope.url);
                ref.addEventListener('exit', function(){
                    console.log('close feide login window');

                    cordova.exec(function(rep){
                      console.log(rep);
                    }, function(error) {
                      console.log(error);
                    }, "cookieManager","deleteCookies",[]);
                
                });
            }
        },
        template:
            '<button id="feideBtn" data-ng-click="launch()">'+
                '<i class="icon-info-sign icon-2x"></i>'+
                '{{lable}}' +
            '</button>'
        ,
        link: function(scope, element, attrs) {
            var element = $(element);
        }
    }
})