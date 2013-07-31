'use strict';

app.controller('WikiCtrl',['$scope','$log','$state','$stateParams','WikiPageService','UtilityService',function($scope,$log,$state,$stateParams,WikiPageService,UtilityService){
	
	function renderContentList(){
		console.log('render content list');

		WikiPageService.fetchMainNode($scope.currentGroup.id).then(function(rep){
			console.log(rep);
			$scope.nodeId = WikiPageService.getMainNode().nodeId;
			WikiPageService.fetchWikiPages($scope.nodeId).then(function(rep){
				console.log(rep);
				$scope.listTree = WikiPageService.getWikiTree();
			},function(err){
				console.log(err);
			});
		},function(error){
			console.log(error);
		});
	}

	function renderWikiPage(title,nId){
		console.log('render wiki page');

		WikiPageService.fetchWikiPage(title,nId).then(function(rep){
			$scope.currentPage = WikiPageService.getWikipage();
		},function(err){
			console.log(err);
		});
	}

	if($scope.currentGroup.id != 110 && $state.is('stage.wiki.contentlist')){
		$scope.listTree = [];
		$scope.nodeId;
		renderContentList();
	}

	if($state.is('stage.wiki.page')){
		$scope.currentPage = {};
		$scope.childrenp = 'default';
		renderWikiPage($stateParams.title,$stateParams.nodeId);
	}

	$scope.showWiki = function (t,nId){
		$state.transitionTo('stage.wiki.page',{nodeId:nId,title:t});
	}

	$scope.showList = function (){
		$state.transitionTo('stage.wiki.contentlist');
	}

	$scope.selectWiki = function (t){
		if(t != 'default'){
			$state.transitionTo('stage.wiki.page',{nodeId:$stateParams.nodeId,title:t});
		}
	}

}])