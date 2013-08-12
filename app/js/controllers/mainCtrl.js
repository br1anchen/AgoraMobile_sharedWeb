'use strict';
app.controller('MainCtrl',function($scope,$log,$location,StorageService,$timeout,$state){

	checkUserInfo();

	function checkUserInfo(){
		if(StorageService.get('User')){
			$state.transitionTo('stage.activityFeed');
		}else{
			console.log("no stored user info");
			$timeout(function(){
				$location.path("/login");
			})
		}
	}

});