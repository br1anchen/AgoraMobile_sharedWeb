"use strict"

//Wiki Page Service

angular.module('app.wikiPageService',['app.storageService','app.httpService']).

factory('WikiPageService',['$log','$q','StorageService','HttpService',function ($log,$q,StorageService,HttpService){

	//class entity in Wiki Page Service
	var NodeApiUrl = "https://agora.uninett.no/api/secure/jsonws/wikinode/get-node/group-id/";
	var PagesApiUrl = "https://agora.uninett.no/api/secure/jsonws/wikipage/get-node-pages/node-id/";

	var nodeHolder = {
		mainNode : {}
	};

	var pagesHolder = {
		pages : []
	};

	var mainNode = {};
	var pages = [];

	function JSON2Page(json){
		return {
			companyId: json.companyId,
			content: json.content,
			createDate: moment(json.createDate).format('DD/MM/YYYY, HH:mm:ss'),
			format: json.format,
			groupId: json.groupId,
			modifiedDate: moment(json.modifiedDate).format('DD/MM/YYYY, HH:mm:ss'),
			nodeId: json.nodeId,
			pageId: json.pageId,
			parentTitle: json.parentTitle,
			statusDate: moment(json.statusDate).format('DD/MM/YYYY, HH:mm:ss'),
			title: json.title,
			userId: json.userId,
			userName: json.userName,
			version: json.version,
			childrenPages: []
		}
	}

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

		nodeHolder.mainNode = mainNode;
		StorageService.store('Group' + gId + '_WikiNode' + data.nodeId,mainNode);

	}

	function factoryPages2Store(data,nodeId){
		pages = [];

		angular.forEach(data,function(p,k){

			var page = JSON2Page(p);

			pages.push(page);

        });

        pagesHolder.pages = pages;
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
			return nodeHolder.mainNode;
		},

		fetchWikiPages : function (nodeId){
			var deffered = $q.defer();

			var promise = HttpService.request(PagesApiUrl + nodeId + '/max/100','','GET');

			promise.then(function(rep){

	          factoryPages2Store(rep.data,nodeId);
	          
	          deffered.resolve("wiki pages fetched for node " + nodeId);

	        },function(err){
	          deffered.reject("wiki pages failed to get");
	        });

			return deffered.promise;
		},

		getWikiPages : function() {
			return pagesHolder.pages.length > 0 ? pagesHolder.pages : undefined;
		}
	}

}])