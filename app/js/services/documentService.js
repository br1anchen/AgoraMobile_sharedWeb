"use strict"

//Document Service

angular.module('app.documentService',['app.storageService','app.httpService','app.appService','app.utilityService']).

factory('DocumentService',['$log','$q','StorageService','HttpService','AppService','$timeout','UtilityService',function ($log,$q,StorageService,HttpService,AppService,$timeout,UtilityService){

	//class entity in DocumentService
	var FoldersApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-folders/repository-id/";
	var FilesApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-file-entries/repository-id/";
	var SingleFileApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-file-entry/file-entry-id/";
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

	var savedFilesHolder = {
		savedFiles: []
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

	getFileSystem();

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
		var validUTI = UtilityService.iosUTI.getUTIByExtension(json.extension);
		var support = true;
		if(validUTI == 'noUti'){
			support = false;
		}

		return {
			companyId: json.companyId,
			createDate: moment(json.createDate).format('DD/MM/YYYY, HH:mm:ss'),
			description: json.description,
			extension: json.extension,
			fileEntryId: json.fileEntryId,
			folderId: json.folderId,
			folderName : StorageService.get('Group' + json.groupId + '_Folder' + json.folderId).name,
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
			remoteFileDir: '',
			offline: false,
			ifSupport: support,
			uti: validUTI
		}
	}

	function storeFolder(gId,fId,folder){
		StorageService.store('Group' + gId + '_Folder' + fId,folder);
	}

	function storeFile(gId,fId,fTitle,file){
		StorageService.store('Group' + gId + '_Folder' + fId + '_FileTitle:' + fTitle, file)
	}

	function storeSavedList(savedList){
		StorageService.store('SavedFilesList',savedList);
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

	function setSavedList(savedList){
		savedFilesHolder.savedFiles = savedList;
	}

	function fetchFolderContent(gId,fId){
		var deffered = $q.defer();

		if(fId == 0){
			var rootFolder = {
				folderId: 0,
				name: 'Documents',
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

						var storedFile = StorageService.get('Group' + file.groupId + '_Folder' + file.folderId + '_FileTitle:' + file.title);
						if(storedFile){
							if(storedFile.version == file.version){
								file.localFileDir = storedFile.localFileDir;
								file.offline = storedFile.offline;
							}
							file.remoteFileDir = storedFile.remoteFileDir;
						}else{
							file.remoteFileDir = getAllNestedFolders(file.folderId) + '/' + file.title;
						}
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

	function fetchFileInfo(file){

		var deffered = $q.defer();

		var promise = HttpService.request(SingleFileApiUrl + file.fileEntryId,'','GET').then(function(rep){
			var file = JSON2File(rep.data);

			deffered.resolve(file);
		},function(err){
			deffered.reject('documentService.fetchFileInfo: file failed to fetch');
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
			if(fileHolder.groupId == group.id && fileHolder.file && fileHolder.file.folderId == folderId && fileHolder.file.title == fileTitle){
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
			else{//init directory if no localstorage to show single file detail

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

			fetchFileInfo(file).then(function(f){
				
				var storedFile = StorageService.get('Group' + f.groupId + '_Folder' + f.folderId + '_FileTitle:' + f.title);

				if(f.version <= storedFile.version && storedFile.offline == true){
					console.log('use downloaded file');

					deffered.resolve(storedFile.localFileDir);
				
				}else{

					rootFS.getDirectory("Files", {create: true, exclusive: false},
					    function(filesDir){
					        var fileTransfer = new FileTransfer();

							var uri = encodeURI(DownloadApiUrl + groupUrl + '/document_library' + file.remoteFileDir);

							var localFileDir = file.remoteFileDir.replace(/\s+/g,'');
							if(localFileDir.split('.').pop() == localFileDir){
								localFileDir = localFileDir + '.' + file.extension;
							}

							fileTransfer.download(
							    uri,
							    filesDir.fullPath + '/' + file.groupId + localFileDir,
							    function(entry) {
							    	
							        console.log("download complete: " + entry.fullPath);

							        downloadURL = entry.fullPath;

									file.localFileDir = entry.fullPath;
									file.offline = true;
									setFile(file.groupId,file.folderId,file);
									storeFile(file.groupId,file.folderId,file.title,file);

									//generate saved files list
									var savedList = StorageService.get('SavedFilesList');
									if(!savedList){savedList = [];}
									if(jQuery.inArray(file, savedList) == -1){
										savedList.push(file);
										setSavedList(savedList);
							    		storeSavedList(savedList);
									}

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
				}
			},function(err){
				deffered.reject(err);
			});
			
			return deffered.promise;
		},

		removeFile : function(file){
			var deffered = $q.defer();
			var fileURI;

			if(file.localFileDir.indexOf('/') == 0){// set file uri path for different os
				fileURI = 'file://' + file.localFileDir; //for ios
			}else{
				fileURI = file.localFileDir; //for android
			}
			console.log(fileURI);
			window.resolveLocalFileSystemURI(encodeURI(fileURI), function(fileEntry){

    			fileEntry.remove(function(entry){

    				file.localFileDir = '';
					file.offline = false;
					setFile(file.groupId,file.folderId,file);
					storeFile(file.groupId,file.folderId,file.title,file);

					//delete in saved files list
					var savedList = StorageService.get('SavedFilesList');
					savedList = jQuery.grep(savedList , function (f,k) {
					    return f.remoteFileDir != file.remoteFileDir;
					});
					
					setSavedList(savedList);
					storeSavedList(savedList);

    				
    				$timeout(function(){
		    			deffered.resolve("delete file success");
		    		});
    			}, function(err){
    				$timeout(function(){
		    			deffered.reject("ERROR getFileEntry");
		    		});
    			});

			},function(evt){
				console.log('resolveLocalFileSystemURI failed: code '+ evt.code);
		        $timeout(function(){
		    		deffered.reject("ERROR getFileEntry");
		    	});
			});

			return deffered.promise;
		},

		getSavedFiles : function(){
			var savedList = StorageService.get('SavedFilesList');
			if(!savedList){savedList = [];}
			setSavedList(savedList);
			return savedFilesHolder;

		},

		deleteAllSavedFiles : function(){
			var deffered = $q.defer();

			rootFS.getDirectory("Files", {create: true, exclusive: false},function(filesDir){
				filesDir.removeRecursively(function(){
					var savedList = StorageService.get('SavedFilesList');
					if(savedList){
						angular.forEach(savedList,function(f,k){
							var storedFile = StorageService.get('Group' + f.groupId + '_Folder' + f.folderId + '_FileTitle:' + f.title);
							storedFile.localFileDir = '';
							storedFile.offline = false;
							setFile(storedFile.groupId,storedFile.folderId,storedFile);
							storeFile(storedFile.groupId,storedFile.folderId,storedFile.title,storedFile);
						});
					}
					
					savedList = [];
					setSavedList(savedList);
					storeSavedList(savedList);

					$timeout(function(){
		    			deffered.resolve("delete all saved files success");
		    		});
				}, function(err){
					$timeout(function(){
			    		deffered.reject("deleteAllSavedFiles() removeRecursively failed: code" + err.code);
			    	});
				});
			},function(err){
				$timeout(function(){
		    		deffered.reject("deleteAllSavedFiles() getDirectory failed: code" + err.code);
		    	});
			});

			return deffered.promise;
		}

	}
}])