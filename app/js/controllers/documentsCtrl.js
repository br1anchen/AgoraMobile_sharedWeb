'use strict';
app.controller('DocumentsCtrl',function($scope,$log,$timeout,$q,DocumentService,StorageService,AppService,$state,$stateParams,$rootScope,localize,UtilityService){
	$scope.showprogress = false;
	$scope.downloadProgress = 0;

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
		$scope.showprogress = true;
		$scope.downloadProgress = 30;
		//$scope.loading = true;
		$timeout(function(){
			$scope.downloadProgress = 50;
		},200);
		DocumentService.downloadFile($scope.currentGroup.friendlyURL,file).then(function(dir){
			$scope.downloadProgress = 100;
			//Making sure UI knows loading finished
			$timeout(function(){
				$scope.showprogress = false;
				$scope.downloadProgress = 0;
			},1000);

			//$scope.loading = false;
			/*
			navigator.notification.confirm(localize.getLocalizedString('_FileDownloadFinsh_'),function(buttonIndex){
				switch(buttonIndex){
					case 1:
						openFile(dir,file.uti);
					break;
				}
			},'Agora Mobile',localize.getLocalizedString('_FileDownloadFinshBtns_'));
			*/
		},function(err){
			console.log(err);
			//Making sure UI knows loading finished
			//$scope.loading = false;
			$timeout(function(){
				$scope.showprogress = false;
				$scope.downloadProgress = 0;
			},1000);
			navigator.notification.alert(
                localize.getLocalizedString('_FileDownloadFailTitle_'),
                function(){
                },
                'Agora Mobile',
                'OK'
            );
		});
	}

	$scope.showFile = function(file){
		if(file.ifSupport){
			if(file.offline && file.localFileDir){
				openFile(file.localFileDir , file.uti);	
			}
			else{
				//Making sure UI knows we are loading data
				$scope.showprogress = true;
				$scope.downloadProgress = 30;
				//$scope.loading = true;
				$timeout(function(){
					$scope.downloadProgress = 50;
				},200);
				DocumentService.downloadFile($scope.currentGroup.friendlyURL,file).then(function(dir){
					$scope.downloadProgress = 100;
					//Making sure UI knows loading finished
					$timeout(function(){
						$scope.showprogress = false;
						$scope.downloadProgress = 0;
					},1000);
					//$scope.loading = false;
					openFile(dir,file.uti);
				},function(err){
					console.log(err);
					//Making sure UI knows loading finished
					//$scope.loading = false;
					$timeout(function(){
						$scope.showprogress = false;
						$scope.downloadProgress = 0;
					},1000);
					navigator.notification.alert(
	                    localize.getLocalizedString('_FileDownloadFailTitle_'),
	                    function(){
	                    },
	                    'Agora Mobile',
	                    'OK'
	                );
				});
			}
		}else{
			navigator.notification.alert(
                localize.getLocalizedString('_FileNotSupportTitle_'),
                function(){

                },
                'Agora Mobile',
                'OK'
            );
		}

	}
	var openFile = function(fileDir,fileUTI){

        if(fileDir.indexOf("file://") == -1){
            fileDir = encodeURI('file://' + fileDir);
        }

		/* open file with third-party application for android since chrome does not have pdf viewer*/
		if(device.platform == 'Android'){
		    cordova.exec(function(rep){
            	console.log(rep);
            	},function(err){
            		console.log(err);
            		navigator.notification.alert(
                        localize.getLocalizedString('_NoAppOpenTitle_'),
                        function(){

                        },
                        'Agora Mobile',
                        'OK'
                    );
                }, "ExternalFileUtil", "openWith",[encodeURI(fileDir), fileUTI]);
		}else{
		    UtilityService.inAppBrowser.browser(fileDir);
		}
	}

	$scope.deleteFile = function(file){
		//Making sure UI knows we are loading data
		$scope.loading = true;
		DocumentService.removeFile(file).then(function(rep){
			//Making sure UI knows loading finished
			$scope.loading = false;
			navigator.notification.alert(
                localize.getLocalizedString('_FileSingleWord_') + file.title + localize.getLocalizedString('_DeletedSingleWord_'),
                function(){

                },
                'Agora Mobile',
                'OK'
            );
		},function(err){
			//Making sure UI knows loading finished
			$scope.loading = false;
			navigator.notification.alert(
                localize.getLocalizedString('_FileSingleWord_') + file.title + localize.getLocalizedString('_FailToDeleWords_'),
                function(){
                	
                },
                'Agora Mobile',
                'OK'
            );
		});
	}

	$scope.switchOffline = function (offline){
		if(offline){
			$scope.cachFile($scope.fileHolder.file);
		}else{
			$scope.deleteFile($scope.fileHolder.file);
		}
	}
	
})