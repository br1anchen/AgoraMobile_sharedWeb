'use strict';

app.controller('WikiCtrl',function($scope,$log,$state,$stateParams,WikiPageService,UtilityService,StorageService,$rootScope){
	
	function renderContentList(){
		$scope.loading = true;
		WikiPageService.getWikiContentTree($scope.currentGroup).then(function(wikiTreeHolder){
			$scope.wikiTreeHolder = wikiTreeHolder;
			$scope.loading = false;
		});
	}

	function renderWikiPage(group,nId,title){
		console.log('render wiki page');

		$scope.loading = true;
		WikiPageService.getWikiPage(group,nId,title).then(function(wikiPageHolder){
			$scope.wikiPageHolder = wikiPageHolder;
			$scope.loading = false;
		});
	}

	if($state.is('stage.wiki.contentlist')){
		$rootScope.stateHistory = [];
		$rootScope.isHistory = false;
		renderContentList();
	}

	if($state.is('stage.wiki.page')){
		renderWikiPage($scope.currentGroup,$stateParams.nodeId,$stateParams.title);
	}

	$scope.showWiki = function (t){
		$rootScope.isHistory = false;
		$state.transitionTo('stage.wiki.page',{nodeId:$scope.wikiTreeHolder.mainNode.nodeId,title:t});
	}

	$scope.showList = function (){
		$state.transitionTo('stage.wiki.contentlist');
	}

	$scope.selectWiki = function (t){
		$rootScope.isHistory = false;
		$state.transitionTo('stage.wiki.page',{nodeId:$stateParams.nodeId,title:t});
	}
})