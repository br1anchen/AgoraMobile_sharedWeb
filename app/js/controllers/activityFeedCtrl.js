'use strict';

app.controller('ActivityFeedCtrl',
	function($scope,$log,$timeout,ActivityService,$rootScope, ContentService){
		$rootScope.stateHistory = [];
		$rootScope.isHistory = false;
		
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
	}
)