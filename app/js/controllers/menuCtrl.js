'use strict';
app.controller('MenuCtrl',['$scope','$log','$location','StorageService','GroupService','$rootScope',function($scope,$log,$location,StorageService,GroupService,$rootScope){

	if($scope.validUser){
		GroupService.fetchGroups().then(function(rep){
			console.log(rep);
			$scope.groups = GroupService.getGroups();
			$scope.screenName = StorageService.get('UserScreenName');
			$scope.setCurrent(StorageService.get('TopGroup'));
		},function(err){
			console.log('fail to fetch groups');
		});
	}else{
		console.log('user has not logined yet');
	}

	$scope.updateGroups = function(){
	 	GroupService.updateGroups().then(function(rep){
	 		console.log(rep);
	 		$scope.groups = GroupService.getGroups();
	 	});
	 }

}])