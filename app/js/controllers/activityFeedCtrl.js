'use strict';

app.controller('ActivityFeedCtrl',
	function($scope,$log,$timeout,ActivityService,$rootScope, ContentService){
		
		$scope.loading = true;

		//If not group is present we wait for it to load:
		$scope.gettingGroupsPromise.then(
			function(){
				//When group is present we load the activities for this group
				ActivityService.getActivities($scope.currentGroup,30).then(
					function(activitiesHolder){
						$scope.activitiesHolder = activitiesHolder;
						$scope.loading = false;
						if(activitiesHolder.activities.length == 0){
							$rootScope.$broadcast("notification","No activities");
						}
					},
					function(error){
						console.error("ActivityCtrl: getActivities() failed");
						$rootScope.$broadcast("notification","Get activities failed");
						$rootScope.$broadcast("notification","Are you online?");
						$scope.loading = false;
					}
				)
				//After the activities are loaded, we try to load everything else in this group before the user click something.
				.then(
					function(){
						ContentService.loadGroupContent($scope.currentGroup);
					}
				)
			},
			function(){
				console.error("ActivityCtrl:Group not available");
				$rootScope.$broadcast("notification","No groups");
				$scope.loading = false;
			}
		)
		
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