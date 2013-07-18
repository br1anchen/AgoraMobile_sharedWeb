"use strict"

//Message Board Service

angular.module('app.messageBoardService',['app.storageService','app.httpService']).

factory('MessageBoardService',['$log','$q','StorageService','HttpService',function ($log,$q,StorageService,HttpService){

	//class entity in MessageBoardService
	var CategoryApiUrl = "https://agora.uninett.no/api/secure/jsonws/mbcategory/get-categories/group-id/";
	var ThreadsApiUrl = "https://agora.uninett.no/api/secure/jsonws/mbthread/get-threads/group-id/";
	var RootMessageApiUrl = "https://agora.uninett.no/api/secure/jsonws/mbmessage/get-message/message-id/";

	var categoryHolder = {
		categories :[]
	};

	var categories = [];
	var categoryIds = [];

    function JSON2Cat(json){//parse json to category obj
	    return {
	        categoryId : json.categoryId,
			companyId : json.companyId,
			description : json.description,
			groupId : json.groupId,
			messageCount : json.messageCount,
			name : json.name,
			parentCategoryId : json.parentCategoryId,
			threadCount : json.threadCount,
			userId : json.userId,
			userName : json.userName,
			threads : []
	    }
    }

    function JSON2Thread(json){//parse json to thread obj
		return {
			categoryId : json.categoryId,
		    companyId : json.companyId,
		    groupId : json.groupId,
		    lastPosterId : json.lastPostByUserId,
		    lastPostDate : new Date(json.lastPostDate).toLocaleString(),
		    messageCount : json.messageCount,
		    rootMessageId : json.rootMessageId,
		    rootMessageUserId : json.rootMessageUserId,
		    statusByUserId : json.statusByUserId,
		    statusByUserName : json.statusByUserName,
		    statusDate : new Date(json.statusDate).toLocaleString(),
		    threadId : json.threadId,
		    viewCount : json.viewCount,
		    title : ''
		}
    }

    function storeCategoryList(cats,groupId){
    	categories = [];// drop old data
    	categoryIds = [];

        angular.forEach(cats,function(c,k){

			var category = JSON2Cat(c);

    		categoryIds.push(category.categoryId);
    		categories.push(category);

    		StorageService.store('Category' + category.categoryId,category);

        });

        categoryHolder.categories = categories;
        StorageService.store('Group' + groupId + '_CategoryIDs',categoryIds);
    }

    function storeThreads(ths,categoryId){
    	var threads = [];
    	var threadIds = [];

    	angular.forEach(ths,function(t,k){
    		var title = '';

    		var thread = JSON2Thread(t);

			var promise = HttpService.request(RootMessageApiUrl + t.rootMessageId,'','GET');
			promise.then(function(rep){
				title = rep.data.subject;
    			thread.title = title;
    			threads.push(thread);
    			threadIds.push(thread.threadId);

    			StorageService.store('Thread' + thread.threadId,thread);
    		});
    	});

    	categories = jQuery.map(categories,function(c){
    		if(c.categoryId == categoryId){
    			c.threads = threads;
    		}

    		return c;
    	});
    	
    	categoryHolder.categories = categories;
    	StorageService.store('Category' + categoryId + '_ThreadIDs',threadIds);
    }

    //return value in Message Board Service
	return {

		fetchCategories : function(groupId){
			var deffered = $q.defer();

			var promise = HttpService.request(CategoryApiUrl + groupId,'','GET');

			promise.then(function(rep){

	          storeCategoryList(rep.data,groupId);
	          
	          deffered.resolve("messageBoard categories fetched");

	        },function(err){
	          deffered.reject("messageBoard categories failed to get");
	        });

			return deffered.promise;
		},

		getCategories : function(){
			return categoryHolder.categories.length > 0 ? categoryHolder.categories : undefined;
		},

		fetchThreads : function(groupId,categoryId){
			var deffered = $q.defer();

			var promise = HttpService.request(ThreadsApiUrl + groupId + '/category-id/' + categoryId + '/status/0/start/0/end/20','','GET');

			promise.then(function(rep){

				storeThreads(rep.data,categoryId);

				deffered.resolve("threads fetched for category" + categoryId);
			},function(err){
				deffered.reject("threads failed fetched for category" + categoryId);
			});

			return deffered.promise;

		},

		getThreadsByCat : function(categoryId){

			var chosenCat = jQuery.grep(categoryHolder.categories,function(c){
				return c.categoryId == categoryId;
			});

			return chosenCat[0].threads;
		}
	}
}])