'use strict';

app.controller('ActivityFeedCtrl',['$scope','$log','$timeout','ActivityService','UtilityService','StorageService','$rootScope','AppService','$state','$q',function($scope,$log,$timeout,ActivityService,UtilityService,StorageService,$rootScope,AppService,$state,$q){

	function renderActLogs(){
		//console.log('render act logs');
		
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
	$scope.goToGroup = function(group){
		$rootScope.$broadcast("notification",
			"Already showing activityfeed"
		);
		$rootScope.$broadcast("notification",
			"Click on <i class='icon-align-justify'></i> to change group"
		);
	}
}])