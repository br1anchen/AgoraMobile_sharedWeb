'use strict';

app.controller('WikiCtrl',function($scope,$log,$state,$stateParams,WikiPageService,UtilityService,StorageService){


	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if(fromState.name == 'stage.activityFeed'){
			$scope.backToDirectory=true;
		}else{
			$scope.backToDirectory=false;
		}
		$scope.fromState = fromState;
		$scope.fromParams = fromParams;
	})

	$scope.back = function(){
		if($scope.fromState && $scope.fromParams && !$scope.backToDirectory){
			$state.transitionTo($scope.fromState,$scope.fromParams);
		}
		else{
			$state.transitionTo('stage.wiki.contentlist');	
		}
	}
	
	function renderContentList(){
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
		renderWikiPage($scope.currentGroup,$stateParams.nodeId,$stateParams.title);
	}

	$scope.showWiki = function (nId,t){
		$state.transitionTo('stage.wiki.page',{nodeId:nId,title:t});
	}

	$scope.showList = function (){
		$state.transitionTo('stage.wiki.contentlist');
	}

	$scope.selectWiki = function (t){
		$state.transitionTo('stage.wiki.page',{nodeId:$stateParams.nodeId,title:t});
	}

	$scope.openChildren = function(node){
		if(node.title == 'Tavle - Start') return;
		var cUl = 'cUl_' + node.title;
		var nIcon = 'icon_' + node.title;

		var ulElement  = $(document.getElementById(cUl));
      	var iconElement = $(document.getElementById(nIcon));

    	if (ulElement.hasClass('closeList')){
    		ulElement.removeClass('closeList').addClass('openList');
       		iconElement.removeClass('icon-folder-close-alt').addClass('icon-folder-open-alt');
       		var i = $(ulElement.parent().find('.leafTitle')[0]).find('.unfold>');
       		i.removeClass('icon-level-down');
       		i.addClass('icon-level-up');
    	} else {
    		ulElement.removeClass('openList').addClass('closeList');
       		iconElement.removeClass('icon-folder-open-alt').addClass('icon-folder-close-alt');
       		var i = $(ulElement.parent().find('.leafTitle')[0]).find('.unfold>');
       		i.removeClass('icon-level-up');
       		i.addClass('icon-level-down');
    	}
	}

})