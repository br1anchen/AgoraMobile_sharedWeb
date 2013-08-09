'use strict';
app.controller('MainCtrl',['$scope','$log','$location','StorageService','$timeout','$state',function($scope,$log,$location,StorageService,$timeout,$state){

	checkUserInfo();

	function checkUserInfo(){
		if(StorageService.get('User')){
			$state.transitionTo('stage.activityFeed');
		}else{
			console.log("no stored user info");
			$state.transitionTo('login');
		}
	}

}]);