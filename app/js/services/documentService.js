"use strict"

//Document Service

angular.module('app.documentService',['app.storageService','app.httpService','app.appService']).

factory('DocumentService',['$log','$q','StorageService','HttpService','AppService','$timeout',function ($log,$q,StorageService,HttpService,AppService,$timeout){

	//class entity in DocumentService
	var FoldersApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-folders/repository-id/";
	var FilesApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-file-entries/repository-id/";
	var SingleFileApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-file-entry/group-id/";
	var DownloadApiUrl = AppService.getBaseURL() + "/api/secure/webdav";

	var folderHolder = {
		folder : {},
		folderId : undefined,
		groupId : undefined
	};

	var fileHolder = {
		file : {},
		folderId : undefined,
		groupId : undefined
	};

	var rootFS;

	function getFileSystem(){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
			console.log(fileSystem.name);
    		console.log(fileSystem.root.name);
			rootFS = fileSystem.root;
		}, function(evt){
			console.log(evt.target.error.code);
		});
	}

	//getFileSystem();

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

	function storeFolder(gId,fId,folder){
		StorageService.store('Group' + gId + '_Folder' + fId,folder);
	}

	function storeFile(gId,fId,fTitle,file){
		StorageService.store('Group' + gId + '_Folder' + fId + '_FileTitle:' + fTitle, file)
	}

	function setFolder(gId,fId,folder){
		folderHolder.groupId = gId;
		folderHolder.folderId = fId;
		folderHolder.folder = folder;
	}

	function setFile(gId,fId,file){
		fileHolder.groupId = gId;
		fileHolder.folderId = fId;
		fileHolder.file = file;
	}

	function fetchFolderContent(gId,fId){
		var deffered = $q.defer();

		if(fId == 0){
			var rootFolder = {
				folderId: 0,
				name: 'rootFolder',
				subFolders: [],
				files:[],
				groupId : gId
			}
			storeFolder(gId,0,rootFolder);
		}

		var promiseObjects = [];

		//generate remote directory path for file
		var getAllNestedFolders = function(folderId){
			if(folderId != 0){
				var folder = StorageService.get('Group' + gId + '_Folder' + folderId);
				return getAllNestedFolders(folder.parentFolderId) + '/' + folder.name;
			}else{
				return '';
			}
		}

		//fetch all folder content
		var getSubContent = function (folderId) {
			var subfolders = [];
			var subfiles = [];

			var folderPromise = HttpService.request(FoldersApiUrl + gId + '/parent-folder-id/' + folderId,'','GET').then(function(rep){
				if(rep.data.length != 0){
					angular.forEach(rep.data,function(f,k){
						var folder = JSON2Folder(f);

						storeFolder(gId,folder.folderId,folder);

						var subfolder = {
							folderId : folder.folderId,
							name : folder.name,
							groupId : folder.groupId
						}
						subfolders.push(subfolder);

						if(fId == 0){
							getSubContent(folder.folderId);
						}
					});
				}
				
				//update parentFolder with subfolders
				var parentFolder = StorageService.get('Group' + gId + '_Folder' + folderId);
				parentFolder.subFolders = subfolders;
				storeFolder(gId,folderId,parentFolder);

			},function(err){
				console.log("documentService.getSubContent: subfolders failed to fetch");
				deffered.reject("documentService.getSubContent: subfolders failed to fetch");
			});

			promiseObjects.push(folderPromise);

			var filePromise = HttpService.request(FilesApiUrl + gId + '/folder-id/' + folderId,'','GET').then(function(rep){
				if(rep.data.length != 0){
					angular.forEach(rep.data,function(f,k){
						var file = JSON2File(f);

						file.remoteFileDir = getAllNestedFolders(file.folderId) + '/' + file.title;

						subfiles.push(file);
						storeFile(gId,file.folderId,file.title,file);
					});
				}

				//update parentFolder with subfiles
				var parentFolder = StorageService.get('Group' + gId + '_Folder' + folderId);
				parentFolder.files = subfiles;
				storeFolder(gId,folderId,parentFolder);

			},function(err){
				console.log("documentService.getSubContent: sub files failed to fetch");
				deffered.reject("documentService.getSubContent: sub files failed to fetch");
			});
			
			promiseObjects.push(filePromise);
		}
		
		getSubContent(fId);

		$q.all(promiseObjects).then(function(){
			setFolder(gId,fId,StorageService.get('Group' + gId + '_Folder' + fId));
			deffered.resolve(folderHolder);
		});

		return deffered.promise;
	}

    //return value in Document Service
	return {
		getDirectory : function (group,folderId) {
			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the groupe is the same
			if(folderHolder.groupId == group.id && folderHolder.folder.folderId == folderId){
				deffered.resolve(folderHolder);
				
				//Updates in the background even if it has folder content localy
				fetchFolderContent(group.id,folderId);
				return deffered.promise;
			}
			//Tries to fetch from Webstorage
			var folder = StorageService.get('Group' + group.id + '_Folder' + folderId);
			if(folder){
				setFolder(group.id,folderId,folder);
				deffered.resolve(folderHolder);
				
				//Updates in the background even if it has folder content localy
				fetchFolderContent(group.id,folderId);
				return deffered.promise;
			}
			else{
				return fetchFolderContent(group.id,folderId);
			}
		},

		getFile : function(group,folderId,fileTitle){
			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the groupe is the same
			if(fileHolder.groupId == group.id && fileHolder.file.folderId == folderId && fileHolder.file.title == fileTitle){
				deffered.resolve(fileHolder);
				
				return deffered.promise;
			}

			//Tries to fetch from Webstorage
			var file = StorageService.get('Group' + group.id + '_Folder' + folderId + '_FileTitle:' + fileTitle);
			if(file){
				setFile(group.id,folderId,file);
				deffered.resolve(fileHolder);
				
				return deffered.promise;
			}
			else{

				fetchFolderContent(group.id,folderId).then(function(rep){
					var file = StorageService.get('Group' + group.id + '_Folder' + folderId + '_FileTitle:' + fileTitle);
					setFile(group.id,folderId,file);
					deffered.resolve(fileHolder);
				},function(err){
					deffered.reject("documentService.fetchFolderContent: init directory failed");
				});

				return deffered.promise;
			}

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
							storeFile(file.groupId,file.folderId,file.title,file);
					    	
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
			    		deffered.reject("Directory created failed");
			    	});
			        
			    }
			);

			return deffered.promise;
		}

	}
}])