'use strict';
app.controller('MainCtrl',['$scope','$log','$location','StorageService','$timeout','$state',function($scope,$log,$location,StorageService,$timeout,$state){

    $scope.$on("notifyTest",function(notification){
        alert("kake");
    })

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