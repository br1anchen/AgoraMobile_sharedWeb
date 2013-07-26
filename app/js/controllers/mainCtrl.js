'use strict';
app.controller('MainCtrl',['$scope','$log','$location','StorageService','$timeout','$state',function($scope,$log,$location,StorageService,$timeout,$state){

    $scope.$on("notify",function(notification){
        alert("kake");
    })

	checkUserInfo();
	$state.transitionTo('stage.activityFeed');

	function checkUserInfo(){
		if(StorageService.get('User')){
			console.log("user auth : " + StorageService.get('User').auth);
			$state.transitionTo('stage.activityFeed');
		}else{
			console.log("no stored user info");
			$state.transitionTo('login');
		}
	}

}]);