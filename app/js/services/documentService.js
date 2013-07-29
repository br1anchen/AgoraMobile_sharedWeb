"use strict"

//Document Service

angular.module('app.documentService',['app.storageService','app.httpService','app.appService']).

factory('DocumentService',['$log','$q','StorageService','HttpService','AppService',function ($log,$q,StorageService,HttpService,AppService){

	//class entity in DocumentService
	var FileNumberApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-group-file-entries-count/group-id/";
	var FoldersApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/dlapp/get-folders/repository-id/";

	var FilesTreeHolder = {
		filesTree : []
	};

	var FoldersTreeHolder = {
		foldersTree : []
	};

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
			subFolders: []
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
		
		FoldersTreeHolder.foldersTree = getSubFolders(0);

	}

    //return value in Document Service
	return {
		fetchFolders : function (groupId) {
			factoryFolders(groupId);
		},

		getFolders : function(){
			return FoldersTreeHolder.foldersTree.length > 0 ? FoldersTreeHolder.foldersTree : undefined;
		}
	}
}])