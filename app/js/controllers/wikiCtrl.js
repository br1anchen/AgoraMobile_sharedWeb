'use strict';

app.controller('WikiCtrl',['$scope','$log','$state','$stateParams','WikiPageService','UtilityService',function($scope,$log,$state,$stateParams,WikiPageService,UtilityService){
	
	function renderContentList(){
		console.log('render content list');

		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);

		if(connect == 'No network connection'){
			console.log('no internet');
			
		}else{
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
	}

	function renderWikiPage(title,nId){
		console.log('render wiki page');

		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);

		if(connect == 'No network connection'){
			console.log('no internet');
			
		}else{
			WikiPageService.fetchWikiPage(title,nId).then(function(rep){
				$scope.currentPage = WikiPageService.getWikipage();
			},function(err){
				console.log(err);
			});
		}
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

	$scope.$watch('childrenp',function(nV,oV){
		if(nV != oV && nV != 'default'){
			$state.transitionTo('stage.wiki.page',{nodeId:$stateParams.nodeId,title:nV});
		}
	});

	$scope.showWiki = function (t,nId){
		$state.transitionTo('stage.wiki.page',{nodeId:nId,title:t});
	}

	$scope.showList = function (){
		$state.transitionTo('stage.wiki.contentlist');
	}

}])