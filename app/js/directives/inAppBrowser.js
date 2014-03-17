app.directive('inAppBrowser', function(UtilityService) {

    return {
        restrict: 'A',
        replace: true,
        scope:{
            url:'=',
            href:'='
        },
        controller:function($scope){
            $scope.launch = function(){
                var url = $scope.url ? $scope.url : $scope.href;
                var ref = UtilityService.inAppBrowser.browser(url,'_blank');
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
        link: function(scope, element, attrs) {
            var element = $(element).bind('click',scope.launch);
        }
    }
})