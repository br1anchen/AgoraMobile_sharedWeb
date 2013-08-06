'use strict';
app.controller('DocumentsCtrl',['$scope','$log','$timeout','$q','DocumentService','StorageService','UtilityService','AppService','$state','$stateParams',function($scope,$log,$timeout,$q,DocumentService,StorageService,UtilityService,AppService,$state,$stateParams){

	function renderDirectory(){
		console.log('render Document Directory');

		$scope.showConentHeader = true;

		$scope.loading = true;
		DocumentService.getDirectory($scope.currentGroup,0).then(function(rep){
			$scope.folderHolder = rep;
			$scope.loading = false;
		});

	}

	function renderFolder(group,folderId){
		console.log('render Folder Content');

		$scope.showConentHeader = true;
		$scope.loading = true;
		DocumentService.getDirectory(group,folderId).then(function(rep){
			$scope.folderHolder = rep;
			$scope.loading = false;
		});

	}

	function renderFile(group,folderId,fileTitle){
		console.log('load file');
		
		$scope.folderName = StorageService.get('Group' + group.id + '_Folder'+folderId).name;

		$scope.showConentHeader = true;
		
		$scope.loading = true;
		DocumentService.getFile(group,folderId,fileTitle).then(function(rep){
			$scope.fileHolder = rep;
			$scope.loading = false;
		});

	}

	if($state.is('stage.documents.root')){
		renderDirectory();
	}

	if($state.is('stage.documents.folder')){
		renderFolder($scope.currentGroup,$stateParams.folderId);
	}

	if($state.is('stage.documents.file')){
		renderFile($scope.currentGroup,$stateParams.folderId,$stateParams.fileTitle);
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

	$scope.toFolder = function(folderId){
		if(folderId != 0){
			$state.transitionTo('stage.documents.folder',{folderId:folderId});
		}else{
			$state.transitionTo('stage.documents.root');
		}
	}
	
}])