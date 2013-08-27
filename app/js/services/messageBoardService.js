"use strict"

//Message Board Service

angular.module('app.messageBoardService',['app.storageService','app.httpService','app.appService']).

factory('MessageBoardService',['$log','$q','StorageService','HttpService','AppService',function ($log,$q,StorageService,HttpService,AppService){

	//class entity in MessageBoardService
	var CategoryApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/mbcategory/get-categories/group-id/";
	var ThreadsApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/mbthread/get-threads/group-id/";
	var RootMessageApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/mbmessage/get-message/message-id/";
	var MessagesApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/mbmessage/get-thread-messages/group-id/";

	var threadsIncrement = 20;
	var messagesIncrement = 40;

	var categoriesHolder = {
		groupId:undefined,
		root: []
	};

	var threadsHolder = {
		threads : [],
		groupId:undefined,
		categoryId:undefined
	};

	var messagesHolder = {
		messages : [],
		groupId:undefined,
		categoryId:undefined,
		threadId:undefined
	};

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
			lastPostDate:json.lastPostDate,
			userId : json.userId,
			userName : json.userName,
			threadIds : []
	    }
    }
    function addChildren(node,candidates){
    	node.children = [];
    	//Adding immediate children if present
    	for(var i = 0 ; i < candidates.length ; i++){
    		if(candidates[i].parentCategoryId == node.categoryId){
    			node.children.push(candidates.splice(i--,1)[0]);
    		}
    	}
    	//Reqursive calls after children has been removed from candidates if candidates left
    	if(candidates.length > 0){
	    	for(var i = 0 ; i < node.children.length ; i++){
	    		addChildren(node.children[i], candidates);
	    	}
	    }
    	return node;
    }

    function buildCategoryTree(categories){
    	return addChildren({categoryId:0},categories)
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

    //Sets the webstorage
    function storeCategories(gid,categories){
    	StorageService.store('Group' + gid + '_Categories',categories);
    }
    //Sets the runtime memory and webstorage
    function setCategories(gid,categories){
        categoriesHolder.root = categories;
        categoriesHolder.groupId = gid;
        storeCategories(gid,categories);
    }
    //Sets the webstorage
	function storeThreads(gid, categoryId, threads){
		StorageService.store('Group' + gid + '_Category' + categoryId + '_Threads',threads);
	}
	//Sets the runtime memory and webstorage
    function setThreads(gid,categoryId,threads){
        threadsHolder.threads = threads;
        threadsHolder.groupId = gid;
        threadsHolder.categoryId = categoryId
        storeThreads(gid,categoryId,threads);
    }

    //Sets the webstorage
	function storeMessages(gid, categoryId, threadId, messages){
		StorageService.store('Group' + gid + '_Category' + categoryId + '_Thread' + threadId + "_Messages",messages);
	}
	//Sets the runtime memory and webstorage
    function setMessages(gid,categoryId,threadId,messages){
        messagesHolder.messages = messages;
        messagesHolder.groupId = gid;
        messagesHolder.categoryId = categoryId;
        messagesHolder.threadId = threadId;
        storeMessages(gid, categoryId, threadId, messages);
    }

    function fetchCategories(groupId){
    	var deffered = $q.defer();

			var promise = HttpService.request(CategoryApiUrl + groupId,'','GET');

			promise.then(function(rep){

				var categories = [];

				angular.forEach(rep.data,function(c,k){
					var category = JSON2Cat(c);

		    		categories.push(category);
		        });

		        setCategories(groupId , buildCategoryTree(categories) );
	          
	          deffered.resolve(categoriesHolder);

	        },function(err){
	          deffered.reject("MessageBoardService.fetchCategories():MessageBoardService.fetchCategories:Failed to get categories for group "+ groupId);
	          console.error("MessageBoardService.fetchCategories:Failed to get categories for group "+ groupId);
	        });

			return deffered.promise;
    }
    function fetchThreads(groupId, categoryId, number){
    	var amount = (number && number > threadsIncrement) ? number : threadsIncrement;
    	var deffered = $q.defer();

		var promise = HttpService.request(ThreadsApiUrl + groupId + '/category-id/' + categoryId + '/status/0/start/0/end/' + amount,'','GET');

		promise.then(function(rep){
			var threads = [];
			angular.forEach(rep.data,function(t,k){
				var thread = JSON2Thread(t);
				threads.push(thread);
			})

			//We resolve after all titles have been fetched for each thread. 
			//For some reason titles are not returned by the API, and we have to do idividual request to get them

			//Update all thread titles

			var promiseObjects = [];

			angular.forEach(threads,function(thread,key){

				var promise = HttpService.request(RootMessageApiUrl + thread.rootMessageId,'','GET');
				promise.then(
					function(rep){
						//Sets the title for this thread
		    			thread.title = rep.data.subject;
		    			//Runtimememory is updated by object reference, but we need to update webstrage with thread title
		    			storeThreads(groupId,categoryId,threads);
	    			},
	    			function(error){
	    				console.log('MessageBoardService.fetchThreads() could not fetch title in background for thread ' + thread);
	    			}
    			);
    			promiseObjects.push(promise);
			})

			$q.all(promiseObjects).then(function(){
				setThreads(groupId,categoryId,threads);
				deffered.resolve(threadsHolder);
			})

		},function(err){
			deffered.reject('MessageBoardService.fetchThreads(): Could not fetch threads for category ' + categoryId);
			console.error('MessageBoardService.fetchThreads(): Could not fetch threads for category ' + categoryId);
		});

		return deffered.promise;
    }
    function fetchMessages(groupId, categoryId, threadId, number){
    	var amount = (number && number > messagesIncrement) ? number : messagesIncrement;
    	var deffered = $q.defer();

		var promise = HttpService.request(MessagesApiUrl + groupId + '/category-id/' + categoryId + '/thread-id/' + threadId + '/status/0/start/0/end/' + amount,'','GET');

		promise.then(function(rep){
			var messages = [];

			angular.forEach(rep.data,function(m,k){
	    		var message = JSON2Msg(m);
	    		messages.push(message);
	    	});
	    	setMessages(groupId,categoryId,threadId,messages);
			deffered.resolve(messagesHolder);
		},function(err){
			deffered.reject("MessageBoardService.fetchMessages():Colud not fetch messages for thread " + threadId);
			console.error("Colud not fetch messages for thread " + threadId);
		});

		return deffered.promise;
    }

    //return value in Message Board Service
	return {

		getCategories : function(group){
			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the groupe is the same
			if(categoriesHolder.groupId == group.id){
				deffered.resolve(categoriesHolder);
				
				//Updates in the background even if it has categories localy
				fetchCategories(group.id);
				return deffered.promise;
			}
			//Tries to fetch from Webstorage
			var categories = StorageService.get('Group' + group.id + '_Categories');
			if(categories){
				setCategories(group.id,categories);
				deffered.resolve(categoriesHolder);
				
				//Updates in the background even if it has categories localy
				fetchCategories(group.id);
				return deffered.promise;
			}
			else{
				return fetchCategories(group.id);
			}
		},
		updateCategories : function(group){
			return fetchCategories(group.id);
		},
		getThreads : function(group, categoryId, number){
			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the groupe is the same
			if(threadsHolder.groupId == group.id && threadsHolder.categoryId == categoryId){
				deffered.resolve(threadsHolder);
				
				//Updates in the background even if it has categories localy
				fetchThreads(group.id,categoryId, number);
				return deffered.promise;
			}
			//Tries to fetch from Webstorage
			var threads = StorageService.get('Group' + group.id + '_Category' + categoryId + '_Threads');
			if(threads){
				setThreads(group.id,categoryId,threads);
				deffered.resolve(threadsHolder);
				
				//Updates in the background even if it has categories localy
				fetchThreads(group.id,categoryId, number);
				return deffered.promise;
			}
			else{
				return fetchThreads(group.id,categoryId, number);
			}
		},
		updateThreads : function(group,categoryId){
			var amount = (threadsHolder.threads.length > threadsIncrement) ? threadsHolder.threads.length : threadsIncrement;
			return fetchThreads(group.id, categoryId,amount );
		},
		getMoreThreads : function(group, categoryId){
			var amount = (threadsHolder.threads.length > threadsIncrement) ? threadsHolder.threads.length * 2 : threadsIncrement * 2;
			
			return fetchThreads(group.id, categoryId, amount);
		},
		getMessages : function(group, categoryId, threadId, number){
			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the groupe is the same
			if(messagesHolder.groupId == group.id && messagesHolder.categoryId == categoryId && messagesHolder.threadId == threadId){
				deffered.resolve(messagesHolder);
				
				//Updates in the background even if it has categories localy
				fetchMessages(group.id,categoryId,threadId, number);
				return deffered.promise;
			}
			//Tries to fetch from Webstorage
			var messages = StorageService.get('Group' + group.id + '_Category' + categoryId + '_Thread' + threadId + "_Messages");
			if(messages){
				setMessages(group.id,categoryId, threadId,messages);
				deffered.resolve(messagesHolder);
				
				//Updates in the background even if it has categories localy
				fetchMessages(group.id, categoryId, threadId, number);
				return deffered.promise;
			}
			else{
				return fetchMessages(group.id, categoryId, threadId, number);
			}
		},
		updateMessages : function (group, categoryId, threadId){
			var amount = (messagesHolder.messages.length > messagesIncrement) ? messagesHolder.messages.length : messagesIncrement
			return fetchMessages(group.id, categoryId, threadId, amount);
		},
		getMoreMessages : function(group, categoryId, threadId, amount){
			var amount = (messagesHolder.messages.length > messagesIncrement) ? messagesHolder.messages.length * 2 : messagesIncrement * 2;
			return fetchMessages(group.id, categoryId, threadId, amount);
		}
	}
}])