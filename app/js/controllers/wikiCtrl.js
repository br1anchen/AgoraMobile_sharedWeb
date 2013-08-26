'use strict';

app.controller('WikiCtrl',function($scope,$log,$state,$stateParams,WikiPageService,UtilityService,StorageService,$rootScope){
	$scope.childrenOpen = false;
	function renderContentList(){
		//Making sure UI knows we are in contentList
		$scope.root = true;

		//Making sure UI knows we are loading data
		$scope.loading = true;
		WikiPageService.getWikiContentTree($scope.currentGroup).then(function(wikiTreeHolder){
			$scope.wikiTreeHolder = wikiTreeHolder;
			//Making sure UI knows we finished loading data
			$scope.loading = false;
		});
	}

	function renderWikiPage(group,nId,title){
		//Making sure UI knows we are not in contentList
		$scope.root = false;

		console.log('render wiki page');
		//Making sure UI knows we are loading data
		$scope.loading = true;
		WikiPageService.getWikiPage(group,nId,title).then(function(wikiPageHolder){
			$scope.wikiPageHolder = wikiPageHolder;
			//Making sure UI knows we finished loading data
			$scope.loading = false;
		});
	}

	if($state.is('stage.wiki.contentlist')){
		renderContentList();
	}

	if($state.is('stage.wiki.page')){
		renderWikiPage($scope.currentGroup,$stateParams.nodeId,$stateParams.title);
	}

	$scope.showWiki = function (t){
		var nodeId = $scope.wikiTreeHolder ? $scope.wikiTreeHolder.mainNode.nodeId : $scope.wikiPageHolder.nodeId;
		$state.transitionTo('stage.wiki.page',{nodeId:nodeId,title:t});
	}

	$scope.showList = function (){
		$state.transitionTo('stage.wiki.contentlist');
	}

	$scope.selectWiki = function (t){
		$state.transitionTo('stage.wiki.page',{nodeId:$stateParams.nodeId,title:t});
	}
})