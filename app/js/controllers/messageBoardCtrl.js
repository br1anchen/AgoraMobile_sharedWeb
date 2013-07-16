'use strict';

app.controller('MessageBoardCtrl',['$scope','$log','$timeout','$q','MessageBoardService','StorageService','UtilityService',function($scope,$log,$timeout,$q,MessageBoardService,StorageService,UtilityService){

	function renderCategories (){
		console.log('renderCategories');
		
		$scope.categories = [];

		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);
		
		if(connect == 'No network connection'){
			console.log('no internet');
			var storedCats = StorageService.get('Group' + $scope.currentGroup.id + '_CategoryIDs');
			if(storedCats){
				angular.forEach(storedCats,function(cId,k){
					$scope.categories.push(StorageService.get('Category' + cId));
				});
			}else{
				console.log('no stored categories');
			}
		}else{
			MessageBoardService.fetchCategories($scope.currentGroup.id).then(function(rep){
				console.log(rep);
				$scope.categories = MessageBoardService.getCategories();
			},function(error){
				console.log(error);
			});
		}

	}

	if($scope.currentGroup.id != 110){
		renderCategories();
	}

	$scope.$on('renderCategories', function (){
		renderCategories();
	});

	$scope.$on('scrollableUpdate',function(){
		
		//Dummy code to make it seam like it'a updating
		$timeout(function(){
			$scope.$emit("scrollableUpdated");
		},3000);
	})

	var appendcounter = 0;
	$scope.$on('scrollableAppend',function(){

		$timeout(function(){ //Inside $timeout to update childscope
			$scope.messages.push("Appended message number "+ ++appendcounter);
		})
	})
}])