'use strict';

app.controller('SearchCtrl',
	function($scope,$log,$timeout,SearchService,$rootScope, ContentService,$state){
		$scope.loading = false;
		$scope.keyword = undefined;
		$scope.searchType = "get-any";

		$scope.$on('scrollableUpdate',function(){

			if($scope.keyword && $scope.searchType){
				$scope.loading = true;

				//Updating content
				SearchService.getResults(20,$scope.keyword,$scope.searchType).then(
					function(resultsHolder){
						$scope.loading = false;
						$scope.results = resultsHolder.results;
					},
					function(error){
						console.error("SearchCtrl: Result Update failed");
						$rootScope.$broadcast("notification","Update failed");
						$scope.loading = false;
					}
				);
			}

		});

		$scope.$on('scrollableAppend',function(){

			if($scope.keyword && $scope.searchType){
				$scope.loading = true;

				//Appending content
				SearchService.getMoreResults().then(
					function(resultsHolder){
						$scope.loading = false;
						$scope.results = resultsHolder.results;
					},
					function(error){
						console.error("SearchCtrl: Append failed");
						$rootScope.$broadcast("notification","Append failed");
						$scope.loading = false;
					}
				)
			}
			
		});

		$scope.search = function(){
			if($scope.keyword && $scope.searchType){
				$scope.loading = true;

				//Updating content
				SearchService.getResults(20,$scope.keyword,$scope.searchType).then(
					function(resultsHolder){
						$scope.loading = false;
						$scope.results = resultsHolder.results;
					},
					function(error){
						console.error("SearchCtrl: Result Update failed");
						$rootScope.$broadcast("notification","Update failed");
						$scope.loading = false;
					}
				);
			}else{
				navigator.notification.alert(
	                'Please type key word to search',
	                function(){

	                },
	                'Agora Mobile',
	                'OK'
	            );
			}
		}
	}
)