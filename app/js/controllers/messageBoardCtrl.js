'use strict';

app.controller('MessageBoardCtrl',function($scope,$log,$timeout,$q,MessageBoardService,StorageService,UtilityService,$state,$stateParams,$rootScope){

	function renderCategories (){
		$scope.loading = true;

		MessageBoardService.getCategories($scope.currentGroup).then(function(categoriesHolder){
			$scope.categoriesHolder = categoriesHolder;
			$scope.loading = false;
		})
	}

	function renderThreads (groupId,categoryId){
		$scope.loading = true;
		MessageBoardService.getThreads($scope.currentGroup, categoryId).then(function(threadsHolder){
			$scope.threadsHolder = threadsHolder;
			$scope.loading = false;
		})
	}

	function renderMessages (groupId,categoryId,threadId){
		$scope.loading = true;
		MessageBoardService.getMessages($scope.currentGroup, categoryId, threadId).then(function(messagesHolder){
			$scope.messagesHolder = messagesHolder;
			$scope.loading = false;
		})
	}

	//When this controller is loaded it loads data dependent on the state:
	if($state.is('stage.messageBoard.categories')){
		$rootScope.stateHistory = [];
		$rootScope.isHistory = false;
		renderCategories();
	}

	if($state.is('stage.messageBoard.threads')){
		renderThreads($scope.currentGroup.id,$stateParams.categoryId);
	}

	if($state.is('stage.messageBoard.messages')){
		renderMessages($scope.currentGroup.id,$stateParams.categoryId,$stateParams.threadId);
	}

	$scope.$on('scrollableUpdate',function(){
		$scope.loading = true;
		if($state.is('stage.messageBoard.categories')){
			MessageBoardService.updateCategories($scope.currentGroup).then(function(){
				$scope.loading = false;
			},function(error){
				$rootScope.$broadcast("notification","Update failed");
				console.log("MessageBoardCtrl: Could not update categories becaues: "+ error);
			});
		}
		else if($state.is('stage.messageBoard.threads')){
			MessageBoardService.updateThreads($scope.currentGroup, $stateParams.categoryId).then(function(){
				$scope.loading = false;
			},function(error){
				$rootScope.$broadcast("notification","Update failed");
				console.log("MessageBoardCtrl: Could not update threads becaues: "+ error);
			});
		}
		else if($state.is('stage.messageBoard.messages')){
			MessageBoardService.updateMessages($scope.currentGroup, $stateParams.categoryId, $stateParams.threadId).then(function(){
				$scope.loading = false;
			},function(error){
				$rootScope.$broadcast("notification","Update failed");
				console.log("MessageBoardCtrl: Could not update messages becaues: "+ error);
			});
		}
	})
	$scope.$on('scrollableAppend',function(){
		$scope.loading = true;
		if($state.is('stage.messageBoard.categories')){
			MessageBoardService.getMoreCategories($scope.currentGroup).then(function(){
				$scope.loading = false;
			});
		}
		else if($state.is('stage.messageBoard.threads')){
			MessageBoardService.getMoreThreads($scope.currentGroup, $stateParams.categoryId).then(function(){
				$scope.loading = false;
			});
		}
		else if($state.is('stage.messageBoard.messages')){
			MessageBoardService.getMoreMessages($scope.currentGroup, $stateParams.categoryId, $stateParams.threadId).then(function(){
				$scope.loading = false;
			});
		}
	})
	//Going back by swypeRight if we are in the messages page
	$scope.$on('swipeRight',function(){
		if($state.is('stage.messageBoard.messages')){
			$scope.back();
		}
	})
	//Methods used in the partials for navigating
	$scope.showTreads = function (category) {
		$rootScope.isHistory = false;
		$state.transitionTo('stage.messageBoard.threads',{categoryId:category.categoryId});
	}

	$scope.showMessages = function (thread) {
		$rootScope.isHistory = false;
		$state.transitionTo('stage.messageBoard.messages',{categoryId:thread.categoryId,threadId:thread.threadId});
	}

})