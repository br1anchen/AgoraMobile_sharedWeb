'use strict';

app.controller('MessageBoardCtrl',function($scope,$log,$timeout,$q,MessageBoardService,StorageService,UtilityService,$state,$stateParams,$rootScope,StateService){

	function renderCategories (category){
		$scope.rootCategory = category;

		//Manipulating stored state for later back navigation
		if(!StateService.getCurrentStateParameter("categoryStack")){
			StateService.setCurrentStateParameter("categoryStack",[]);	
		} 

		var categoryStack = StateService.getCurrentStateParameter("categoryStack");
		categoryStack.push(category);

		if($scope.rootCategory.categoryId == 0){

			//Making sure UI knows we are in top category
			$scope.root = true;
		}
		else{
			//Making sure UI knows we are not in top category
			$scope.root = false;
		}
	}

	function renderThreads (groupId,categoryId){
		//Making sure UI knows we are not in top category
		$scope.root = false;

		//Making sure UI knows we are loading data
		$scope.loading = true;

		MessageBoardService.getThreads($scope.currentGroup, categoryId).then(function(threadsHolder){
			$scope.threadsHolder = threadsHolder;
			//Making sure UI knows we finished loading data
			$scope.loading = false;
		})
	}

	function renderMessages (groupId,categoryId,threadId){
		//Making sure UI knows we are not in top category
		$scope.root = false;

		//Making sure UI knows we are loading data
		$scope.loading = true;
		MessageBoardService.getMessages($scope.currentGroup, categoryId, threadId).then(function(messagesHolder){
			$scope.messagesHolder = messagesHolder;
			//Making sure UI knows we finished loading data
			$scope.loading = false;
		})
	}

	

	//When this controller is loaded it loads data dependent on the state:
	if($state.is('stage.messageBoard.categories')){
		
		if($stateParams.categoryStack){
			//Fetching latest categoryhistory for this state
			renderCategories($stateParams.categoryStack.pop());
		}
		else{
			//Making sure UI knows we are loading data
			$scope.loading = true;
				MessageBoardService.getCategories($scope.currentGroup).then(function(categoriesHolder){

					$scope.categoriesHolder = categoriesHolder;
					//Making sure UI knows we finished loading data
					$scope.loading = false;
					renderCategories($scope.categoriesHolder.root);
				})
		}
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
		if($state.is('stage.messageBoard.threads')){
			$scope.loading = true;
			MessageBoardService.getMoreThreads($scope.currentGroup, $stateParams.categoryId).then(function(){
				$scope.loading = false;
			},function(error){
				$scope.loading = false;
				console.log("MessageBoardCtrl: Could not append more threads: "+ error);
			});
		}
		else if($state.is('stage.messageBoard.messages')){
			$scope.loading = true;
			MessageBoardService.getMoreMessages($scope.currentGroup, $stateParams.categoryId, $stateParams.threadId).then(function(){
				$scope.loading = false;
			},function(error){
				$scope.loading = false;
				console.log("MessageBoardCtrl: Could not append more messages: "+ error);
			});
		}
	})
	//Going back by swypeRight if we are in the messages page
	$scope.$on('swipeRight',function(){
		if($state.is('stage.messageBoard.messages')){
			$scope.back();
		}
	})
	//Methods used to open category threads
	var showTreads = function (category) {
		$state.transitionTo('stage.messageBoard.threads',{categoryId:category.categoryId});
	}

	$scope.showMessages = function (thread) {
		$state.transitionTo('stage.messageBoard.messages',{categoryId:thread.categoryId,threadId:thread.threadId});
	}
	$scope.openCategory = function(category){
		if(category.children && category.children.length > 0){
			renderCategories(category);
		}
		else{
			showTreads(category);
		}
	}
	$scope.goBack = function(){
		// var prevState = StateService.peekPreviousState();
		var categoryStack = StateService.getCurrentStateParameter("categoryStack");

		if($state.current.name === 'stage.messageBoard.categories' && categoryStack && categoryStack.length > 1){
			//Removing current category from stack
			categoryStack.pop()
			//rendering previous category
			renderCategories(categoryStack.pop());
		}
		else{
			$scope.back();
		}
	}
})