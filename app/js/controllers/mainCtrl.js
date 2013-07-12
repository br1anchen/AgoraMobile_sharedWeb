'use strict';
app.controller('MainCtrl',['$scope','$log','$location','StorageService','$timeout','$state',function($scope,$log,$location,StorageService,$timeout,$state){

	checkUserInfo();

	function checkUserInfo(){
		if(StorageService.get('UserScreenName')){
			console.log("user auth : " + StorageService.get(StorageService.get('UserScreenName')).auth);
			$state.transitionTo('stage.activityFeed');
		}else{
			console.log("no stored user info");
			$state.transitionTo('login');
		}
	}

}]);