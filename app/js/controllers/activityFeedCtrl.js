'use strict';

app.controller('ActivityFeedCtrl',['$scope','$log','$timeout','ActivityService','UtilityService','StorageService','$rootScope','AppService','$state',function($scope,$log,$timeout,ActivityService,UtilityService,StorageService,$rootScope,AppService,$state){

	function renderActLogs(){
		//console.log('render act logs');
		
		$scope.showConentHeader = true;
		
		ActivityService.getActivities($scope.currentGroup,30).then(
			function(activitiesHolder){
				// alert(JSON.stringify($scope.currentGroup));
				// alert(JSON.stringify(activitiesHolder.activities));
				$scope.activitiesHolder = activitiesHolder;
				
			},
			function(error){
				// alert("error:"+JSON.stringify(error));
				console.log(error);
			}
		);
	}

	if($scope.currentGroup.id != 110 && $state.is('stage.activityFeed')){
		renderActLogs();
	}

	$scope.$on('renderActLogs',function(){
		renderActLogs();
	});

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