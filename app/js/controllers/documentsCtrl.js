'use strict';
app.controller('DocumentsCtrl',['$scope','$log','$timeout','$q','DocumentService','StorageService','UtilityService','$state','$stateParams',function($scope,$log,$timeout,$q,DocumentService,StorageService,UtilityService,$state,$stateParams){
	
	function renderDirectory(){
		console.log('render Document Directory');

		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);
		
		if(connect == 'No network connection'){
			console.log('no internet');
			
		}else{
			DocumentService.fetchFolders($scope.currentGroup.id);
			
			DocumentService.fetchFileObjs($scope.currentGroup.id).then(function(rep){
				$scope.folder = DocumentService.getFolderWithFiles();
			},function(err){
				console.log(err);
			});
		}
	}

	function renderFolder(groupId,folderId){
		console.log('render Folder Content');

		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);
		
		if(connect == 'No network connection'){
			console.log('no internet');
			
		}else{
			$scope.folder = DocumentService.getFolderContent(groupId,folderId);
		}
	}

	function renderFile(groupId,folerId,fileTitle){
		console.log('load file');

		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);
		
		if(connect == 'No network connection'){
			console.log('no internet');
			
		}else{
			$scope.file = DocumentService.getFile(groupId,folderId,fileTitle);
		}
	}

	if($state.is('stage.documents.root')){
		$scope.folder = {};
		renderDirectory();
	}

	if($state.is('stage.documents.folder')){
		$scope.folder = {};
		renderFolder($scope.currentGroup.id,$stateParams.folderId);
	}

	if($state.is('stage.documents.file')){
		$scope.file = {};
		renderFile($scope.currentGroup.id,$stateParams.folderId,$stateParams.fileTitle);
	}

	$scope.gotoFolder = function(folder){
		$state.transitionTo('stage.documents.folder',{folderId:folder.folderId});
	}

	$scope.fileDetail = function(file){
		$state.transitionTo('stage.documents.file',{folderId:file.folderId,fileTitle:file.title});
	}

	$scope.showFile = function(file){
		console.log('show file: ' + file.title);
	}
}])