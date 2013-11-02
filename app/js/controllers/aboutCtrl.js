'use strict';

app.controller('AboutCtrl',
	function($scope,UtilityService){
		$scope.load = function(url){
			UtilityService.inAppBrowser.browser(url);
		}
	}
)