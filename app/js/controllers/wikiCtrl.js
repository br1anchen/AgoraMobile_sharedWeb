'use strict';

app.controller('WikiCtrl',function($scope,$log,$state,$stateParams,WikiPageService,UtilityService,StorageService){
	
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
	$scope.linkify = function(content){
		var e = $(document.createElement('div'));
		e.append(content);
		//Searching for anchor elements in elements DOM
		var anchors = e.find('a');
		angular.forEach(anchors,function(a,k){
			a = $(a);
			var href = a.attr('href');
			var parts = href.split('/');
			var wikiName = parts[parts.length-1].replace(/\+/g,' ');
			var page = StorageService.get('Group' + $scope.currentGroup.id + '_WikiPageTitle:' + wikiName);

			if(page){
				a.removeAttr('href');
				a.attr('data-ng-click','selectWiki('+wikiName+')');
			}
		})
		return e.html();
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