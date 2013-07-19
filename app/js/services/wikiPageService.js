"use strict"

//Wiki Page Service

angular.module('app.wikiPageService',['app.storageService','app.httpService']).

factory('WikiPageService',['$log','$q','StorageService','HttpService',function ($log,$q,StorageService,HttpService){

	//class entity in Wiki Page Service
	var NodeApiUrl = "https://agora.uninett.no/api/secure/jsonws/wikinode/get-node/group-id/";
	var PagesApiUrl = "https://agora.uninett.no/api/secure/jsonws/wikipage/get-node-pages/node-id/";

	var nodeHolder = {
		mainNodes : []
	};

	var mainNode = {};

	function storeMainNode(data,gId){
		mainNode = {
			companyId: data.companyId,
			createDate: moment(data.createDate).format('DD/MM/YYYY, HH:mm:ss'),
			groupId: data.groupId,
			name: data.name,
			nodeId: data.nodeId,
			userId: data.userId,
			userName: data.userName
		};

		StorageService.store('Group' + gId + '_WikiNode' + data.nodeId,mainNode);

	}

    //return value in Wiki Page Service
	return {
		fetchMainNode : function (groupId) {
			var deffered = $q.defer();

			var promise = HttpService.request(NodeApiUrl + groupId + '/name/Main','','GET');

			promise.then(function(rep){

	          storeMainNode(rep.data,groupId);
	          
	          deffered.resolve("wiki nodeId fetched");

	        },function(err){
	          deffered.reject("wiki nodeId failed to get");
	        });

			return deffered.promise;
		},

		getMainNode : function (){
			return mainNode;
		}
	}

}])