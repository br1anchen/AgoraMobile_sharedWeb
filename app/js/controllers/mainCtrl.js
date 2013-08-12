'use strict';
app.controller('MainCtrl',function($scope,$log,$location,StorageService,$timeout,$state){

	checkUserInfo();

	function checkUserInfo(){
		if(StorageService.get('User')){
			$state.transitionTo('stage');
		}else{
			console.log("no stored user info");
			$state.transitionTo('login');
		}
	}

});