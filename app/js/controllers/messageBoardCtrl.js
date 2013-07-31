'use strict';

app.controller('MessageBoardCtrl',['$scope','$log','$timeout','$q','MessageBoardService','StorageService','UtilityService','$state','$stateParams',function($scope,$log,$timeout,$q,MessageBoardService,StorageService,UtilityService,$state,$stateParams){

	function renderCategories (){
		console.log('render Categories');

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

	function renderThreads (groupId,categoryId){
		console.log('render Threads');
		
		MessageBoardService.fetchThreads(groupId,categoryId).then(function(rep){
			console.log(rep);
			$scope.threads = MessageBoardService.getThreads();

			if(!$scope.threads){
				$('#noThread').css("visibility", "visible");
			}else{
				$('#noThread').css("visibility", "hidden");
			}
		},function(error){
			console.log(error);
		});
	}

	function renderMessages (groupId,categoryId,threadId){
		console.log('render Messages');
		
		MessageBoardService.fetchMessages(groupId,categoryId,threadId).then(function(rep){
			console.log(rep);
			$scope.messages = MessageBoardService.getMessages();

			if(!$scope.threads){
				$('#noMessage').css("visibility", "visible");
			}else{
				$('#noMessage').css("visibility", "hidden");
			}
		},function(error){
			console.log(error);
		});
	}

	if($scope.currentGroup.id != 110 && $state.is('stage.messageBoard.categories')){
		$scope.categories = [];
		renderCategories();
	}

	if($state.is('stage.messageBoard.threads')){
		$scope.threads = [];
		renderThreads($scope.currentGroup.id,$stateParams.categoryId);
	}

	if($state.is('stage.messageBoard.messages')){
		$scope.messages = [];
		renderMessages($scope.currentGroup.id,$stateParams.categoryId,$stateParams.threadId);
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

	$scope.showMessages = function (thread) {
		$state.transitionTo('stage.messageBoard.messages',{categoryId:thread.categoryId,threadId:thread.threadId});
	}

	$scope.backToCategory = function (){
		console.log('back to message board home');
		$state.transitionTo('stage.messageBoard.categories');
	}

	$scope.backToThread = function (){
		console.log('back to Treads');
		$state.transitionTo('stage.messageBoard.threads',{categoryId:$scope.messages[0].categoryId})
	}
}])