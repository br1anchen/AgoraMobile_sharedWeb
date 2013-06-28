'use strict';
app.controller('MainCtrl',['$scope','$log','$location','StorageService','$timeout',function($scope,$log,$location,StorageService,$timeout){
	$scope.validUser = false;

	$scope.checkUserInfo = function(){
		console.log($scope.validUser);
		if(StorageService.get('UserScreenName')){
			$scope.validUser = true;
		}else{
			$scope.validUser = false;
		}
	}

	$scope.setValidUser = function(valid){
		
		$scope.validUser = valid;

	}

}]);