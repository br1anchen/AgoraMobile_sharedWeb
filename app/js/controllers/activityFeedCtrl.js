'use strict';

app.controller('ActivityFeedCtrl',
	function($scope,$log,$timeout,ActivityService,$rootScope, ContentService,$state,localize){
		$scope.loading = true;

		$scope.$on('scrollableUpdate',function(){
			$scope.loading = true;

			//Updating content
			ActivityService.updateActivities($scope.currentGroup).then(
				function(activitiesHolder){
					$scope.loading = false;
					$scope.activities = activitiesHolder.activities;
				},
				function(error){
					console.error("ActivityCtrl: Update failed");
					$rootScope.$broadcast("notification",localize.getLocalizedString('_UpdateFailNotificationText_'));
					$scope.loading = false;
				}
			);
		});

		$scope.$on('scrollableAppend',function(){
			$scope.loading = true;

			//Appending content
			ActivityService.getMoreActivities($scope.currentGroup).then(
				function(activitiesHolder){
					$scope.loading = false;
					$scope.activities = activitiesHolder.activities;
				},
				function(error){
					console.error("Append failed");
					$rootScope.$broadcast("notification",localize.getLocalizedString('_AppendFailNotificationText_'));
					$scope.loading = false;
				}
			)
		});

		if($state.is('stage.activityFeed')){
			var groupId = $state.params.groupId;
			if($scope.currentGroup && groupId != $scope.currentGroup.id){
				var group = $scope.getGroup(groupId);
				if(group) $scope.showGroup(group).then(function(rep){
					$scope.loading = false;
				});
			}else{
				$scope.loading = true;

				//Updating content
				ActivityService.updateActivities({id:groupId}).then(
					function(activitiesHolder){
						$scope.loading = false;
						$scope.activities = activitiesHolder.activities;
					},
					function(error){
						console.error("ActivityCtrl: Update failed");
						$rootScope.$broadcast("notification",localize.getLocalizedString('_UpdateFailNotificationText_'));
						$scope.loading = false;
					}
				);
			
			}
		}
	}
)