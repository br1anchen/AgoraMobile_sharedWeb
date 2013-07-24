'use strict';

app.controller('WikiCtrl',['$scope','$log','$state','$stateParams','WikiPageService',function($scope,$log,$state,$stateParams,WikiPageService){
	
	function renderContentList(){
		console.log('render content list');
	}

	if($scope.currentGroup.id != 110 && $state.is('stage.wiki.contentlist')){
		$scope.listTree = [];
		renderContentList();
	}

}])