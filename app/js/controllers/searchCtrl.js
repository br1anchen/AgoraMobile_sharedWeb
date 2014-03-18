'use strict';

app.controller('SearchCtrl',
	function($scope,$log,$timeout,SearchService,$rootScope, ContentService,$state,localize){

		$scope.loading = false;
		$scope.showprogress = false;
		$scope.keyword = undefined;
		$scope.searchType = {
			name: localize.getLocalizedString('_searchAnyText_'),
			value: 'get-any'
		};
		$scope.searchOptionsShowing = false;
		$scope.searchProgress = 0;
		$scope.endSearch = false;

		/*
		$scope.$on('scrollableUpdate',function(){

			if($scope.keyword && $scope.searchType.value && $scope.menuVar){
				$scope.loading = true;

				//Updating content
				SearchService.getResults(20,$scope.keyword,$scope.searchType.value).then(
					function(resultsHolder){
						$scope.loading = false;
						$scope.results = resultsHolder.results;
					},
					function(error){
						console.error("SearchCtrl: Result Update failed");
						$rootScope.$broadcast("notification",localize.getLocalizedString('_UpdateFailNotificationText_'));
						$scope.loading = false;
					}
				);
			}

		});
		*/

		$scope.$on('scrollableAppend',function(){

			if($scope.keyword && $scope.searchType.value && $scope.menuVar && !$scope.endSearch){
				$scope.loading = true;

				//Appending content
				SearchService.getMoreResults().then(
					function(resultsHolder){
						$scope.loading = false;
						$scope.results = resultsHolder.results;
						$scope.endSearch = resultsHolder.end;
					},
					function(error){
						console.error("SearchCtrl: Append failed");
						$rootScope.$broadcast("notification",localize.getLocalizedString('_AppendFailNotificationText_'));
						$scope.loading = false;
					}
				)
			}
			
		});

		$scope.setSearchType = function(name,value){
			$scope.searchType.name = localize.getLocalizedString(name);
			$scope.searchType.value = value;
			$scope.searchOptionsShowing = false;
			if($scope.keyword){
				$scope.search();
			}
		}

		$scope.search = function(){
			$scope.showprogress = true;
			$scope.searchProgress = 30;
			if($scope.keyword && $scope.searchType.value){
				$scope.loading = true;

				$scope.searchProgress = 70;
				//Updating content
				SearchService.getResults(20,$scope.keyword,$scope.searchType.value).then(
					function(resultsHolder){
						$scope.searchProgress = 100;
						$scope.loading = false;
						$scope.results = resultsHolder.results;
						$scope.endSearch = resultsHolder.end;
						$timeout(function(){
							$scope.showprogress = false;
							$scope.searchProgress = 0;
						},1000);
					},
					function(error){
						console.error("SearchCtrl: Result Update failed");
						$rootScope.$broadcast("notification",localize.getLocalizedString('_UpdateFailNotificationText_'));
						$scope.loading = false;
						$scope.showprogress = false;
						$scope.searchProgress = 0;
					}
				);
			}else{
				navigator.notification.alert(
	                localize.getLocalizedString('_searchErrorMsg_'),
	                function(){

	                },
	                'Agora Mobile',
	                'OK'
	            );
	            $scope.showprogress = false;
	            $scope.searchProgress = 0;
			}
		}
	}
)