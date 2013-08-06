'use strict';

app.controller('WikiCtrl',['$scope','$log','$state','$stateParams','WikiPageService','UtilityService',function($scope,$log,$state,$stateParams,WikiPageService,UtilityService){
	
	function renderContentList(){
		console.log('render content list');

		$scope.showConentHeader = true;
		$scope.loading = true;
		WikiPageService.getWikiContentTree($scope.currentGroup).then(function(wikiTreeHolder){
			$scope.wikiTreeHolder = wikiTreeHolder;
			$scope.loading = false;
		});
	}

	function renderWikiPage(group,nId,title){
		console.log('render wiki page');

		//$scope.showConentHeader = true;
		$scope.loading = true;
		WikiPageService.getWikiPage(group,nId,title).then(function(wikiPageHolder){
			$scope.wikiPageHolder = wikiPageHolder;
			$scope.loading = false;
		});
	}

	if($state.is('stage.wiki.contentlist')){
		renderContentList();
	}

	if($state.is('stage.wiki.page')){
		$scope.childrenp = 'default';
		renderWikiPage($scope.currentGroup,$stateParams.nodeId,$stateParams.title);
	}

	$scope.showWiki = function (nId,t){
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

	$scope.openChildren = function(node){
		var cUl = 'cUl_' + node.title;
		var nIcon = 'icon_' + node.title;

		var ulElement  = document.getElementById(cUl);
      	var iconElement = document.getElementById(nIcon);

    	if ($(ulElement).hasClass('closeList')){
    		$(ulElement).removeClass('closeList').addClass('openList');
       		$(iconElement).removeClass('icon-folder-close-alt').addClass('icon-folder-open-alt');
    	} else {
    		$(ulElement).removeClass('openList').addClass('closeList');
       		$(iconElement).removeClass('icon-folder-open-alt').addClass('icon-folder-close-alt');
    	}
	}

}])