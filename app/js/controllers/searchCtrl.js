'use strict';

app.controller('SearchCtrl',
	function($scope,$log,$timeout,SearchService,$rootScope, ContentService,$state,localize){

		$scope.loading = false;
		$scope.keyword = undefined;
		$scope.searchType = {
			name: localize.getLocalizedString('_searchAnyText_'),
			value: 'get-any'
		};
		$scope.searchOptionsShowing = false;

		$scope.$on('scrollableUpdate',function(){

			if($scope.keyword && $scope.searchType.value){
				$scope.loading = true;

				//Updating content
				SearchService.getResults(20,$scope.keyword,$scope.searchType.value).then(
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

			if($scope.keyword && $scope.searchType.value){
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

		$scope.setSearchType = function(name,value){
			$scope.searchType.name = localize.getLocalizedString(name);
			$scope.searchType.value = value;
			$scope.searchOptionsShowing = false;
			if($scope.keyword){
				$scope.search();
			}
		}

		$scope.search = function(){
			if($scope.keyword && $scope.searchType.value){
				$scope.loading = true;

				//Updating content
				SearchService.getResults(20,$scope.keyword,$scope.searchType.value).then(
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
	                localize.getLocalizedString('_searchErrorMsg_'),
	                function(){

	                },
	                'Agora Mobile',
	                'OK'
	            );
			}
		}
	}
)