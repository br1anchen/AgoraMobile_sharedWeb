'use strict';

app.controller('WikiCtrl',function($scope,$log,$state,$stateParams,WikiPageService,UtilityService,StorageService,$timeout){
	$scope.wikiTreeHolder = {};

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
		$scope.loading = true;
		WikiPageService.getWikiContentTree($scope.currentGroup).then(function(wikiTreeHolder){
			$timeout(function(){
				$scope.wikiTreeHolder = wikiTreeHolder;
				$scope.loading = false;
			})
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

	$scope.showWiki = function (t){
		$state.transitionTo('stage.wiki.page',{nodeId:$scope.wikiTreeHolder.mainNode.nodeId,title:t});
	}

	$scope.showList = function (){
		$state.transitionTo('stage.wiki.contentlist');
	}

	$scope.selectWiki = function (t){
		if(t != 'default'){
			$state.transitionTo('stage.wiki.page',{nodeId:$stateParams.nodeId,title:t});
		}
	}
})