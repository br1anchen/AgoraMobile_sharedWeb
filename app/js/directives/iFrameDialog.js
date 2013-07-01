app.directive('iFrameDialog', function($dialog,$log) {
// app.directive('iFrameDialog', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:{
            url:'@',
            lable:'@'
            // url:'https://agora.uninett.no',
            // lable:'knapp'
        },
        controller:function($scope){
            $scope.launch = function(){
                //Dialog options
                $scope.opts = {
                    backdrop: true,
                    keyboard:true,
                    backdropClick:true,
                    template:
                        '<button type="button" class="close" data-ng-click="close()">x</button>'+
                        '<div id="iFrameDialog">'+
                            '<iframe onLoad="loaded()" src="'+$scope.url+'" seamless height="100%" width="100%" >'+
                            '</iframe>'+
                        '</div>'
                    ,
                    controller:function DialogCtrl($scope,dialog){
                        $scope.close = function(result){
                            dialog.close(result);
                        };
                        var iframe = $(dialog.modalEl).find('iframe')[0];
                        window.loaded=function (){
                            
                        }
                    }
                }

                var d = $dialog.dialog($scope.opts);
                d.open().then(
                    function(result){
                        if(result){
                            $log.log("Dialog closed with result");
                        }else{
                            $log.log("Dialog closed without result");
                        }
                        
                    }
                )
            }
        },
        template:
            '<button id="feideBtn" data-ng-click="launch()">'+
                '<i class="icon-info-sign icon-2x"></i>'+
                ' Feide user click here to set Agora account info'+
            '</button>'
        ,
        link: function(scope, element, attrs) {
            var element = $(element);
        }
    }
})