"use strict"

//Document Service

angular.module('app.documentService',['app.storageService','app.httpService','app.appService']).

factory('DocumentService',['$log','$q','StorageService','HttpService','AppService','$timeout',function ($log,$q,StorageService,HttpService,AppService,$timeout){

	//class entity in DocumentService
	var FileNumberApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-group-file-entries-count/group-id/";
	var FoldersApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-folders/repository-id/";
	var FilesApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-group-file-entries/group-id/";
	var DownloadApiUrl = AppService.getBaseURL() + "/api/secure/webdav";

	var FoldersTreeHolder = {
		rootFolder : {
			folderId: 0,
			name: 'rootFolder',
			subFolders: [],
			files:[]
		}
	};

	var rootFS;

	function JSON2Folder(json){
		return {
			companyId: json.companyId,
			createDate: moment(json.createDate).format('DD/MM/YYYY, HH:mm:ss'),
			description: json.description,
			folderId: json.folderId,
			groupId: json.groupId,
			modifiedDate: moment(json.modifiedDate).format('DD/MM/YYYY, HH:mm:ss'),
			name: json.name,
			parentFolderId: json.parentFolderId,
			repositoryId: json.repositoryId,
			userId: json.userId,
			userName: json.userName,
			subFolders: [],
			files: []
		}
	}

	function JSON2File(json){
		return {
			companyId: json.companyId,
			createDate: moment(json.createDate).format('DD/MM/YYYY, HH:mm:ss'),
			description: json.description,
			extension: json.extension,
			fileEntryId: json.fileEntryId,
			folderId: json.folderId,
			groupId: json.groupId,
			mimeType: json.mimeType,
			modifiedDate: moment(json.modifiedDate).format('DD/MM/YYYY, HH:mm:ss'),
			name: json.name,
			readCount: json.readCount,
			repositoryId: json.repositoryId,
			title: json.title,
			userId: json.userId,
			userName: json.userName,
			version: json.version,
			versionUserId: json.versionUserId,
			versionUserName: json.versionUserName,
			localFileDir: '',
			remoteFileDir: ''
		}
	}

	function factoryFolders(gId){

		var getSubFolders = function (fId) {
			var folders = [];

			HttpService.request(FoldersApiUrl + gId + '/parent-folder-id/' + fId,'','GET').then(function(rep){
				if(rep.data.length != 0){
					angular.forEach(rep.data,function(f,k){
						var folder = JSON2Folder(f);

						var folderNode = {
							folderId: folder.folderId,
							name: folder.name,
							subFolders: getSubFolders(folder.folderId)
						}

						StorageService.store('Group' + gId + '_Folder' + folder.folderId,folder);

						folders.push(folderNode);
					});

					if(fId != 0){//update parentFolder with subfolders
						var parentFolder = StorageService.get('Group' + gId + '_Folder' + fId);
						parentFolder.subFolders = folders;
						StorageService.store('Group' + gId + '_Folder' + fId, parentFolder);
					}
				}
			},function(err){

			});
			
			return folders;
		}
		
		FoldersTreeHolder.rootFolder.subFolders = getSubFolders(0);

	}

	function factoryFiles(data,groupId){
		var getAllNestedFolders = function(fId){
			if(fId != 0){
				var folder = StorageService.get('Group' + groupId + '_Folder' + fId);
				return getAllNestedFolders(folder.parentFolderId) + '/' + folder.name;
			}else{
				return '';
			}
		}

		angular.forEach(data,function(f,k){
			var file = JSON2File(f);

			file.remoteFileDir = getAllNestedFolders(file.folderId) + '/' + file.title;
			
			StorageService.store('Group' + groupId + '_Folder' + file.folderId + '_FileTitle:' + file.title, file)
		});

		var putFile2Folder = function(fNode){
			var files = [];

			angular.forEach(data,function(f,k){
				var file = 	StorageService.get('Group' + groupId + '_Folder' + f.folderId + '_FileTitle:' + f.title);;

				if(file.folderId == fNode.folderId){
					files.push(file);
				}
			});

			fNode.files = files;
			if(fNode.folderId != 0){
				var storedFolder = StorageService.get('Group' + groupId + '_Folder' + fNode.folderId);
				storedFolder.files = files;
				StorageService.store('Group' + groupId + '_Folder' + fNode.folderId,storedFolder);
			}

			angular.forEach(fNode.subFolders,function(sn,k){
				putFile2Folder(sn);
			});
		}

		putFile2Folder(FoldersTreeHolder.rootFolder);

	}

	function getFileSystem(){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
			console.log(fileSystem.name);
    		console.log(fileSystem.root.name);
			rootFS = fileSystem.root;
		}, function(evt){
			console.log(evt.target.error.code);
		});
	}

	getFileSystem();

    //return value in Document Service
	return {
		fetchFolders : function (groupId) {
			factoryFolders(groupId);
		},

		getFolders : function(){
			return FoldersTreeHolder.rootFolder.subFolders.length > 0 ? FoldersTreeHolder.rootFolder : undefined;
		},

		fetchFileObjs : function (groupId) {
			var deffered = $q.defer();

			var promise = HttpService.request(FileNumberApiUrl + groupId + '/user-id/0','','GET');

			promise.then(function(rep){
				console.log('Files number ' + rep.data);

	          	HttpService.request(FilesApiUrl + groupId + '/user-id/0/root-folder-id/0/start/0/end/' + rep.data,'','GET').then(function(rep){

	          		factoryFiles(rep.data,groupId);

	          		deffered.resolve("files fetched");
	          	},function(err){
	          		deffered.reject("files failed to fetch");
	          	});

	        },function(err){
	          	deffered.reject("files number failed to get");
	        });

			return deffered.promise;
		},

		getFolderWithFiles : function(){
			return FoldersTreeHolder.rootFolder;
		},

		getFolderContent : function(groupId,folderId){
			return StorageService.get('Group' + groupId + '_Folder' + folderId);
		},

		getFile : function(groupId,folderId,fileTitle){
			return StorageService.get('Group' + groupId + '_Folder' + folderId + '_FileTitle:' + fileTitle);
		},

		downloadFile : function(groupUrl,file){
			var deffered = $q.defer();
			var downloadURL= "";

			rootFS.getDirectory("FilesDir", {create: true, exclusive: false},
			    function(filesDir){
			        var fileTransfer = new FileTransfer();

					var uri = encodeURI(DownloadApiUrl + groupUrl + '/document_library' + file.remoteFileDir);

					var localfileDir = file.remoteFileDir.replace(/\s+/g,'');
					if(localfileDir.split('.').pop() == localfileDir){
						localfileDir = localfileDir + '.' + file.extension;
					}

					fileTransfer.download(
					    uri,
					    filesDir.fullPath + '/' + file.groupId + localfileDir,
					    function(entry) {
					    	
					        console.log("download complete: " + entry.fullPath);

					        downloadURL = entry.fullPath;

							file.localFileDir = entry.fullPath;
							StorageService.store('Group' + file.groupId + '_Folder' + file.folderId + '_FileTitle:' + file.title,file);
					    	
					    	$timeout(function(){
					    		deffered.resolve(downloadURL);
					    	});
					    },
					    function(error) {
					        console.log("download error source " + error.source);
					        console.log("download error target " + error.target);
					        console.log("upload error code" + error.code);

					        $timeout(function(){
					    		deffered.reject("file download failed");
					    	});
					        
					    },
					    false,
					    {
					        headers: {
					            "Authorization": StorageService.get('User').auth
					        }
					    }
					);
			    },
			    function(error){
			        console.log("ERROR getDirectory");
			        console.log(error);

			        $timeout(function(){
			    		deffered.resolve("Direcoty created failed");
			    	});
			        
			    }
			);

			return deffered.promise;
		}

	}
}])