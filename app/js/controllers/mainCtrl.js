'use strict';
app.controller('MainCtrl',function($scope,$log,$location,StorageService,$timeout,$state,$rootScope,localize){

	localize.initLocalizedResources();//init localization file

	checkUserInfo();

	document.addEventListener("offline", function(){

		$timeout(function(){
			$rootScope.$broadcast("notification",localize.getLocalizedString('_AppNoInternetInfo_'));
		});

	}, false);

	function checkUserInfo(){
		if(StorageService.get('User')){
			$state.transitionTo('stage.activityFeed');
		}else{
			console.log("no stored user info");
			$state.transitionTo('login');
		}
	}

});
