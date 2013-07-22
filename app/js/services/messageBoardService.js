"use strict"

//Message Board Service

angular.module('app.messageBoardService',['app.storageService','app.httpService']).

factory('MessageBoardService',['$log','$q','StorageService','HttpService',function ($log,$q,StorageService,HttpService){

	//class entity in MessageBoardService
	var CategoryApiUrl = "https://agora.uninett.no/api/secure/jsonws/mbcategory/get-categories/group-id/";
	var ThreadsApiUrl = "https://agora.uninett.no/api/secure/jsonws/mbthread/get-threads/group-id/";
	var RootMessageApiUrl = "https://agora.uninett.no/api/secure/jsonws/mbmessage/get-message/message-id/";
	var MessagesApiUrl = "https://agora.uninett.no/api/secure/jsonws/mbmessage/get-thread-messages/group-id/";

	var categoryHolder = {
		categories : []
	};

	var threadHolder = {
		threads : []
	};

	var messageHolder = {
		messages : []
	};

    var categories = [];
    var categoryIds = [];
    var threads = [];
    var threadIds = [];
    var messages = [];
    var messageIds = [];

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
			threadIds : []
	    }
    }

    function JSON2Thread(json){//parse json to thread obj
		return {
			categoryId : json.categoryId,
		    companyId : json.companyId,
		    groupId : json.groupId,
		    lastPosterId : json.lastPostByUserId,
		    lastPostDate : moment(json.lastPostDate).format('DD/MM/YYYY, HH:mm:ss'),
		    messageCount : json.messageCount,
		    rootMessageId : json.rootMessageId,
		    rootMessageUserId : json.rootMessageUserId,
		    statusByUserId : json.statusByUserId,
		    statusByUserName : json.statusByUserName,
		    statusDate : moment(json.statusDate).format('DD/MM/YYYY, HH:mm:ss'),
		    threadId : json.threadId,
		    viewCount : json.viewCount,
		    title : '',
		    messageIds : []
		}
    }

    function JSON2Msg(json){//parse json to message obj
    	if(json.format == "bbcode"){
    		var parseResult = XBBCODE.process({
			    text: json.body,
			    removeMisalignedTags: true,
			    addInLineBreaks: false
			});

			json.body = parseResult.html;
    	}

    	return {
			anonymous : json.anonymous,
			attachments : json.attachments,
			body : json.body,
			categoryId : json.categoryId,
			companyId : json.companyId,
			createDate : moment(json.createDate).format('DD/MM/YYYY, HH:mm:ss'),
			format : json.format,
			groupId : json.groupId,
			messageId : json.messageId,
			modifiedDate : moment(json.modifiedDate).format('DD/MM/YYYY, HH:mm:ss'),
			parentMessageId : json.parentMessageId,
			rootMessageId : json.rootMessageId,
			statusByUserId: json.statusByUserId,
			statusByUserName : json.statusByUserName,
			statusDate : moment(json.statusDate).format('DD/MM/YYYY, HH:mm:ss'),
			subject : json.subject,
			threadId : json.threadId,
			userId : json.userId,
			userName : json.userName
    	}
    }

    function storeCategoryList(cats,gId){
    	categories = [];// drop old data
    	categoryIds = [];

        angular.forEach(cats,function(c,k){

			var category = JSON2Cat(c);

    		categoryIds.push(category.categoryId);
    		categories.push(category);

    		StorageService.store('Category' + category.categoryId,category);

        });

        categoryHolder.categories = categories;
        StorageService.store('Group' + gId + '_CategoryIDs',categoryIds);
    }

    function storeThreads(ths,cId){
    	threads = [];
    	threadIds = [];

    	angular.forEach(ths,function(t,k){
    		var title = '';

    		var thread = JSON2Thread(t);
    		threads.push(thread);
    		threadIds.push(thread.threadId);

			var promise = HttpService.request(RootMessageApiUrl + t.rootMessageId,'','GET');
			promise.then(function(rep){
				title = rep.data.subject;
    			thread.title = title;

    			StorageService.store('Thread' + thread.threadId,thread);
    		});
    	});

    	categories = jQuery.map(categories,function(c){
    		if(c.categoryId == cId){
    			c.threadIds = threadIds;
    		}
    		StorageService.store('Category' + c.categoryId,c);
    		return c;
    	});

    	categoryHolder.categories = categories;
    	threadHolder.threads = threads;
    	StorageService.store('Category' + cId + '_ThreadIDs',threadIds);
    }

    function storeMessages(msgs,cId,tId){
    	messages = [];
    	messageIds = [];

    	angular.forEach(msgs,function(m,k){

    		var message = JSON2Msg(m);
    		messages.push(message);
    		messageIds.push(message.messageId);

    		StorageService.store('Message' + message.messageId,message);
    	});

    	threads = jQuery.map(threads,function(t){
    		if(t.threadId == tId){
    			t.messageIds = messageIds;
    		}
    		StorageService.store('Thread' + t.threadId,t);
    		return t;
    	});

    	threadHolder.threads = threads;
    	messageHolder.messages = messages;
    	StorageService.store('Thread' + tId + '_MessageIDs',messageIds);
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

				deffered.resolve("threads fetched for category " + categoryId);
			},function(err){
				deffered.reject("threads failed fetched for category " + categoryId);
			});

			return deffered.promise;

		},

		getThreads : function(){
			return threadHolder.threads.length > 0 ? threadHolder.threads : undefined;
		},

		fetchMessages : function(groupId,categoryId,threadId){
			var deffered = $q.defer();

			var promise = HttpService.request(MessagesApiUrl + groupId + '/category-id/' + categoryId + '/thread-id/' + threadId + '/status/0/start/0/end/20','','GET');

			promise.then(function(rep){

				storeMessages(rep.data,categoryId,threadId);

				deffered.resolve("messages fetched for thread " + threadId);
			},function(err){
				deffered.reject("messages failed fetched for thread " + threadId);
			});

			return deffered.promise;
		},

		getMessages : function(){
			return messageHolder.messages.length > 0 ? messageHolder.messages : undefined;
		}
	}
}])