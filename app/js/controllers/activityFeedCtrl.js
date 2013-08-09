'use strict';

app.controller('ActivityFeedCtrl',['$scope','$log','$timeout','ActivityService','UtilityService','StorageService','$rootScope','AppService','$state','$q',function($scope,$log,$timeout,ActivityService,UtilityService,StorageService,$rootScope,AppService,$state,$q){

	$scope.loading = true;

	ActivityService.getActivities($scope.currentGroup,30).then(
		function(activitiesHolder){
			$scope.activitiesHolder = activitiesHolder;
			$scope.loading = false;
		},
		function(error){
			console.error("ActivityCtrl: getActivities() failed");
			$rootScope.$broadcast("notification","Get activities failed");
			$rootScope.$broadcast("notification","Are you online?");
			$scope.loading = false;
		}
	);

	$scope.$on('scrollableUpdate',function(){
		$scope.loading = true;

		//Updating content
		ActivityService.updateActivities($scope.currentGroup).then(
			function(res){
				$scope.loading = false;
			},
			function(error){
				console.error("ActivityCtrl: Update failed");
				$rootScope.$broadcast("notification","Update failed");
				$scope.loading = false;
			}
		);
	});

	$scope.$on('scrollableAppend',function(){
		$scope.loading = true;

		//Appending content
		ActivityService.getMoreActivities($scope.currentGroup).then(
			function(res){
				$scope.loading = false;
			},
			function(error){
				console.error("Append failed");
				$rootScope.$broadcast("notification","Append failed");
				$scope.loading = false;
			}
		)
	});
}])