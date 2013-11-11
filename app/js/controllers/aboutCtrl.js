'use strict';

app.controller('AboutCtrl',
	function($scope,UtilityService){
		$scope.load = function(url){
			UtilityService.inAppBrowser.browser(url);
		}

		$scope.compserEmail = function(){
			cordova.exec(function () {
        			
    			}, null, 'EmailComposer', 'open', [{
    												subject: 'Feedback About Agora Mobile',
    												recipients: ['adam@uninett.no']}]);
		}
	}
)