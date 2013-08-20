'use strict';
app.controller('MainCtrl',function($scope,$log,$location,StorageService,$timeout,$state,$rootScope){

	checkUserInfo();

	document.addEventListener("offline", function(){

		$timeout(function(){
			$rootScope.$broadcast("notification",'No Internet connection');
		});

	}, false);

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