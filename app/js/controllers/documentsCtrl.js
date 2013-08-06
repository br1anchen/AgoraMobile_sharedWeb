'use strict';
app.controller('DocumentsCtrl',['$scope','$log','$timeout','$q','DocumentService','StorageService','UtilityService','AppService','$state','$stateParams',function($scope,$log,$timeout,$q,DocumentService,StorageService,UtilityService,AppService,$state,$stateParams){

	function renderDirectory(){
		console.log('render Document Directory');

		$scope.showConentHeader = true;

		DocumentService.fetchFolders($scope.currentGroup.id);
		
		DocumentService.fetchFileObjs($scope.currentGroup.id).then(function(rep){
			$scope.folder = DocumentService.getFolderWithFiles();
		},function(err){
			console.log(err);
		});

	}

	function renderFolder(groupId,folderId){
		console.log('render Folder Content');

		$scope.showConentHeader = true;

		$scope.folder = DocumentService.getFolderContent(groupId,folderId);

	}

	function renderFile(groupId,folderId,fileTitle){
		console.log('load file');
		if(parseInt(folderId) == 0){
			$scope.folderName = "Documents";
		}
		else{
			$scope.folderName = StorageService.get('Group' + groupId + '_Folder'+folderId).name;
		}

		$scope.showConentHeader = true;
		
		$scope.file = DocumentService.getFile(groupId,folderId,fileTitle);

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

		var validUTI = UtilityService.iosUTI.getUTIByExtension(file.extension);
		$scope.loading = true;

		if(validUTI != 'noUti'){
			
			DocumentService.downloadFile($scope.currentGroup.friendlyURL,file).then(function(dir){
				$scope.loading = false;
				cordova.exec(function(rep){
								console.log(rep);
							},function(err){
								console.log(err);
								navigator.notification.alert(
	                                'Your device has no application to open this file',
	                                function(){
	                                	
	                                },
	                                'Agora Mobile',
	                                'OK'
	                            );
							}, "ExternalFileUtil", "openWith",[encodeURI(dir), validUTI]);
			},function(err){
				console.log(err);
				$scope.loading = false;
				navigator.notification.alert(
                    'Failed to download file',
                    function(){
                    	
                    },
                    'Agora Mobile',
                    'OK'
                );
			});
		}else{
			$scope.loading = false;
			navigator.notification.alert(
                'This file type is not support to open',
                function(){

                },
                'Agora Mobile',
                'I understand'
            );
		}

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