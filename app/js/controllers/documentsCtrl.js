'use strict';
app.controller('DocumentsCtrl',function($scope,$log,$timeout,$q,DocumentService,StorageService,AppService,$state,$stateParams,$rootScope){
	function renderDirectory(){
		console.log('render Root Folder Content');
		//Making sure the UI knows we are in top folder
		if($stateParams.root)$scope.root = true;

		//Making sure UI knows we are loading data
		$scope.loading = true;
		DocumentService.getDirectory($scope.currentGroup,0).then(function(rep){
			$scope.folderHolder = rep;
			//Making sure UI knows loading finished
			$scope.loading = false;
		});

	}

	function renderFolder(group,folderId){
		console.log('render Folder Content');
		//Making sure UI knows we are loading data
		$scope.loading = true;
		//Making sure the UI knows we are not in top folder
		$scope.root == false;
		DocumentService.getDirectory(group,folderId).then(function(rep){
			$scope.folderHolder = rep;
			$scope.loading = false;
		});

	}

	function renderFile(group,folderId,fileTitle){
		console.log('load file');
		//Making sure the UI knows we are not in top folder
		$scope.root == false;
		$scope.folderName = StorageService.get('Group' + group.id + '_Folder'+folderId).name;

		//Making sure UI knows we are loading data
		$scope.loading = true;
		DocumentService.getFile(group,folderId,fileTitle).then(function(rep){
			$scope.fileHolder = rep;
			//Making sure UI knows loading finished
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
	$scope.cachFile = function(file){
		if(file.offline){
			//Making sure UI knows we are loading data
			$scope.loading = true;
			DocumentService.downloadFile($scope.currentGroup.friendlyURL,file).then(function(dir){
				//Making sure UI knows loading finished
				$scope.loading = false;
				navigator.notification.confirm('File Download Finish',function(buttonIndex){
					switch(buttonIndex){
						case 1:
							openFile(dir,file.uti);
						break;
					}
				},'Agora Mobile','Open File,Close');
			},function(err){
				console.log(err);
				//Making sure UI knows loading finished
				$scope.loading = false;
				navigator.notification.alert(
                    'Failed to download file',
                    function(){
                    },
                    'Agora Mobile',
                    'OK'
                );
			});
		}
	}

	$scope.showFile = function(file){
		if(file.ifSupport){
			if(file.offline){
				openFile(file.localFileDir , file.uti);	
			}
			else{
				//Making sure UI knows we are loading data
				$scope.loading = true;
				DocumentService.downloadFile($scope.currentGroup.friendlyURL,file).then(function(dir){
					//Making sure UI knows loading finished
					$scope.loading = false;
					openFile(dir,file.uti);
				},function(err){
					console.log(err);
					//Making sure UI knows loading finished
					$scope.loading = false;
					navigator.notification.alert(
	                    'Failed to download file',
	                    function(){
	                    },
	                    'Agora Mobile',
	                    'OK'
	                );
				});
			}
		}else{
			navigator.notification.alert(
                'This file type is not support to open',
                function(){

                },
                'Agora Mobile',
                'I understand'
            );
		}

	}
	var openFile = function(fileDir,fileUTI){

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
		}, "ExternalFileUtil", "openWith",[encodeURI(fileDir), fileUTI]);
	}

	$scope.deleteFile = function(file){
		//Making sure UI knows we are loading data
		$scope.loading = true;
		DocumentService.removeFile(file).then(function(rep){
			//Making sure UI knows loading finished
			$scope.loading = false;
			navigator.notification.alert(
                'File ' + file.title + ' deleted',
                function(){
                	
                },
                'Agora Mobile',
                'OK'
            );
		},function(err){
			//Making sure UI knows loading finished
			$scope.loading = false;
			navigator.notification.alert(
                'File ' + file.title + ' failed to delete',
                function(){
                	
                },
                'Agora Mobile',
                'OK'
            );
		});
	}

	$scope.$watch('fileHolder.file.offline',function(newVal,oldVal){
		if(oldVal != undefined){
			if(newVal != oldVal && newVal == true){
				$scope.cachFile($scope.fileHolder.file);
			}else if(newVal != oldVal && newVal == false){
				$scope.deleteFile($scope.fileHolder.file);
			}
		}
	});
	
})