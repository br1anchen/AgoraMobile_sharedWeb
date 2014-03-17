'use strict';

app.controller('AboutCtrl',
	function($scope,UtilityService){

		var getVersionFromApp = function(){
			cordova.exec(function(version){
				console.log(version);
				$scope.version = version;
			},null, 'ApplicationInfo', 'getVersionNumber',[]);
		}

		getVersionFromApp();

		$scope.load = function(url){
			UtilityService.inAppBrowser.browser(url,'_system');
		}

		$scope.compserEmail = function(){
			cordova.exec(function () {
        			
    			}, null, 'EmailComposer', 'open', [{
    												subject: 'Feedback About Agora Mobile',
    												recipients: ['adam@uninett.no']}]);
		}
	}
)