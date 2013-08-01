'use strict';
app.controller('DocumentsCtrl',['$scope','$log','$timeout','$q','DocumentService','StorageService','UtilityService','AppService','$state','$stateParams',function($scope,$log,$timeout,$q,DocumentService,StorageService,UtilityService,AppService,$state,$stateParams){

	function renderDirectory(){
		console.log('render Document Directory');

		$scope.showConentHeader = true;

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

		$scope.showConentHeader = true;

		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);
		
		if(connect == 'No network connection'){
			console.log('no internet');
			
		}else{
			$scope.folder = DocumentService.getFolderContent(groupId,folderId);
		}
	}

	function renderFile(groupId,folderId,fileTitle){
		console.log('load file');

		$scope.showConentHeader = true;
		
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

		DocumentService.downloadFile($scope.currentGroup.friendlyURL,file).then(function(dir){
			cordova.exec(function(rep){
							console.log(rep);
						},function(err){
							console.log(err);
						}, "ExternalFileUtil", "openWith",[encodeURI(dir), 'public.jpeg']);
		},function(err){
			console.log(err);
		});

	}

	$scope.upFolder = function(folderId){
		if(folderId != 0){
			$state.transitionTo('stage.documents.folder',{folderId:folderId});
		}else{
			$state.transitionTo('stage.documents.root');
		}
	}

	$scope.backFolder = function(folderId){
		if(folderId != 0){
			$state.transitionTo('stage.documents.folder',{folderId:folderId});
		}else{
			$state.transitionTo('stage.documents.root');
		}
	}
}])