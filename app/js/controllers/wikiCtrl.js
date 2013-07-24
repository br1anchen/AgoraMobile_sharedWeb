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
				WikiPageService.fetchWikiPages(WikiPageService.getMainNode().nodeId).then(function(rep){
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

	if($scope.currentGroup.id != 110 && $state.is('stage.wiki.contentlist')){
		$scope.listTree = [];
		renderContentList();
	}

}])