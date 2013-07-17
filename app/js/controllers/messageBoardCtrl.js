'use strict';

app.controller('MessageBoardCtrl',['$scope','$log','$timeout','$q','MessageBoardService','StorageService','UtilityService','$state','$stateParams',function($scope,$log,$timeout,$q,MessageBoardService,StorageService,UtilityService,$state,$stateParams){

	function renderCategories (){
		console.log('render Categories');

		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);
		
		if(connect == 'No network connection'){
			console.log('no internet');
			var storedCats = StorageService.get('Group' + $scope.currentGroup.id + '_CategoryIDs');
			if(storedCats){
				angular.forEach(storedCats,function(cId,k){
					$scope.categories.push(StorageService.get('Category' + cId));
				});
				$('#noCategory').css("visibility", "hidden");
			}else{
				console.log('no stored categories');
			}
		}else{
			MessageBoardService.fetchCategories($scope.currentGroup.id).then(function(rep){
				console.log(rep);
				$scope.categories = MessageBoardService.getCategories();
				if(!$scope.categories){
					$('#noCategory').css("visibility", "visible");
				}else{
					$('#noCategory').css("visibility", "hidden");
				}
			},function(error){
				console.log(error);
			});
		}

	}

	function renderThreads (groupId,categoryId){
		console.log('render Threads');
		
		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);
		
		if(connect == 'No network connection'){
			console.log('no internet');
			
		}else{
			MessageBoardService.fetchThreads(groupId,categoryId).then(function(rep){
				console.log(rep);
				$scope.threads = MessageBoardService.getThreadsByCat(categoryId);

				if(!$scope.threads){
					$('#noThread').css("visibility", "visible");
				}else{
					$('#noThread').css("visibility", "hidden");
				}
			},function(error){
				console.log(error);
			});
		}


	}

	if($scope.currentGroup.id != 110 && $state.is('stage.messageBoard.categories')){
		$scope.categories = [];
		renderCategories();
	}

	if($state.is('stage.messageBoard.threads')){
		$scope.threads = [];
		console.log($scope.currentGroup.id + ":" + $stateParams.categoryId);
		renderThreads($scope.currentGroup.id,$stateParams.categoryId);
	}

	$scope.$on('scrollableUpdate',function(){
		
		//Dummy code to make it seam like it'a updating
		$timeout(function(){
			$scope.$emit("scrollableUpdated");
		},3000);
	})

	$scope.showTreads = function (category) {
		$state.transitionTo('stage.messageBoard.threads',{categoryId:category.categoryId});
	}
}])