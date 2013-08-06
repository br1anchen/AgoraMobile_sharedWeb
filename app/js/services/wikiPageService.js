"use strict"

//Wiki Page Service

angular.module('app.wikiPageService',['app.storageService','app.httpService','app.appService']).

factory('WikiPageService',['$log','$q','StorageService','HttpService','AppService',function ($log,$q,StorageService,HttpService,AppService){

	//class entity in Wiki Page Service
	var NodeApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/wikinode/get-node/group-id/";
	var PagesApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/wikipage/get-node-pages/node-id/";
	var PageApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/wikipage/get-page/node-id/";

	var wikiPageHolder = {
		page : {},
		nodeId : undefined,
		groupId : undefined
	};

	var wikiTreeHolder = {
		contentTree : [],
		mainNode : undefined,
		groupId : undefined
	};

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
			childrenPagesTitle: []
		}
	}

	function JSON2MainNode(json){
		return {
			companyId: json.companyId,
			createDate: moment(json.createDate).format('DD/MM/YYYY, HH:mm:ss'),
			groupId: json.groupId,
			name: json.name,
			nodeId: json.nodeId,
			userId: json.userId,
			userName: json.userName
		}
	}

	function storeMainNode(gId,mNode){
		StorageService.store('Group' + gId + '_WikiMainNode',mNode);
	}

	function storeContentTree(gId,tree){
		StorageService.store('Group' + gId + '_WikiContentTree',tree);
	}

	function storeWikiPage(gId,title,page){
		StorageService.store('Group' + gId + '_WikiPageTitle:' + title,page);
	}

	function setWikiTree(gId,mNode,tree){
		wikiTreeHolder.contentTree = tree;
		wikiTreeHolder.mainNode = mNode;
		wikiTreeHolder.groupId = gId;
	}

	function setWikiPage(gId,nId,page){
		wikiPageHolder.page = page;
		wikiPageHolder.nodeId = nId;
		wikiPageHolder.groupId = gId;
	}

	function factoryPages2Store(data){
		var pages = [];

		angular.forEach(data,function(p,k){
			if(p.redirectTitle == ""){
			
				var page = JSON2Page(p);

				pages.push(page);
			}

        });

        angular.forEach(pages,function(p,k){
        	var pTitle = p.parentTitle;
        	var sTitle = p.title;

        	if(pTitle != ""){
        		pages = jQuery.map(pages,function(pp){
		    		if(pp.title == pTitle){
		    			pp.childrenPagesTitle.push(sTitle);
		    		}
		    		return pp;
		    	});
        	}
        });

        angular.forEach(pages,function(p,k){
        	storeWikiPage(p.groupId,p.title,p);
        });

        return pages;
	}

	function generateWikiTree(pages) {
		
		var recursiveNode = function(parentTitle) {
	  
	  		var nodes = [];

	  		angular.forEach(pages,function(p,k){
	  			if(p.parentTitle === parentTitle){
	  				var node = {
	  					title: p.title,
	  					childrenNodes : recursiveNode(p.title)
	  				}

	  				nodes.push(node);
	  			}
	  		});

	  		return nodes;
	 	}
		
		return recursiveNode("");
	}

	function fetchContentTree(gId){
		var deffered = $q.defer();
		var mNode,contentTree;

		var promise = HttpService.request(NodeApiUrl + gId + '/name/Main','','GET');

		promise.then(function(rep){
			mNode = JSON2MainNode(rep.data);
			storeMainNode(gId,mNode);

			var promise = HttpService.request(PagesApiUrl + mNode.nodeId + '/max/100','','GET');
			promise.then(function(rep){
				var pages = factoryPages2Store(rep.data);
				contentTree = generateWikiTree(pages);
				setWikiTree(gId,mNode,contentTree);
				deffered.resolve(wikiTreeHolder);
			},function(err){
				deffered.reject('wikiPageService.fetchContentTree: wiki pages failed to fetch');
			})

		},function(err){
			deffered.reject('wikiPageService.fetchContentTree: wiki nodeId failed to get');
		});

		return deffered.promise;
	}

	function fetchWikiPage(gId,nId,title){
		var deffered = $q.defer();

		var promise = HttpService.request(PageApiUrl + nId + '/title/' + title,'','GET');

		promise.then(function(rep){
			var page = JSON2Page(rep.data);
			var storedPage = StorageService.get('Group' + page.groupId + '_WikiPageTitle:' + page.title);

			page.childrenPagesTitle = storedPage.childrenPagesTitle;

			setWikiPage(gId,nId,page);
			storeWikiPage(gId,title,page);

			deffered.resolve(wikiPageHolder);
		},function(err){
			deffered.reject('wikiPageService.fetchWikiPage: wiki page failed to fetch');
		});

		return deffered.promise;
	}

    //return value in Wiki Page Service
	return {

		getWikiContentTree : function(group) {
			
			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the groupe is the same
			if(wikiTreeHolder.groupId == group.id){
				deffered.resolve(wikiTreeHolder);
				
				//Updates in the background even if it has content Tree localy
				fetchContentTree(group.id);
				return deffered.promise;
			}
			//Tries to fetch from Webstorage
			var contentTree = StorageService.get('Group' + group.id + '_WikiContentTree');
			var mainNode = StorageService.get('Group' + group.id + '_WikiMainNode');

			if(contentTree && mainNode){
				setWikiTree(group.id,mainNode,contentTree);
				deffered.resolve(wikiTreeHolder);
				
				//Updates in the background even if it has content Tree localy
				fetchContentTree(group.id);
				return deffered.promise;
			}
			else{
				return fetchContentTree(group.id);
			}
		},

		getWikiPage : function(group,nodeId,title){

			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the groupe is the same
			if(wikiPageHolder.groupId == group.id){
				deffered.resolve(wikiPageHolder);
				
				//Updates in the background even if it has page localy
				fetchWikiPage(group.id,nodeId,title);
				return deffered.promise;
			}
			//Tries to fetch from Webstorage
			var page = StorageService.get('Group' + group.id + '_WikiPageTitle:' + title);

			if(page){
				setWikiPage(group.id,nodeId,page);
				deffered.resolve(wikiPageHolder);
				
				//Updates in the background even if it has page localy
				fetchWikiPage(group.id,nodeId,title);
				return deffered.promise;
			}
			else{//init content tree if no localstorage to show single wiki page

				fetchContentTree(group.id).then(function(rep){
					var page = StorageService.get('Group' + group.id + '_WikiPageTitle:' + title);
					setWikiPage(group.id,nodeId,page);
					deffered.resolve(wikiPageHolder);
				},function(err){
					deffered.reject("wikiPageService.fetchContentTree: init content tree failed");
				});

				return deffered.promise;
			}
		}
	}

}])