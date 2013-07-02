'use strict';
app.controller('MainCtrl',['$scope','$log','$location','StorageService','$timeout',function($scope,$log,$location,StorageService,$timeout){

	$scope.validUser = true;//checkUserInfo();

	function checkUserInfo(){
		if(StorageService.get('UserScreenName')){
			console.log("user auth : " + StorageService.get(StorageService.get('UserScreenName')).auth);
			return true;
		}else{
			console.log("no stored user info");
			return false;
		}
	}

	$scope.setValidUser = function(valid){
		
		$scope.validUser = valid;

	}

}]);