"use strict"

//Message Board Service

angular.module('app.messageBoardService',['app.storageService','app.httpService','app.appService']).

factory('MessageBoardService',['$log','$q','StorageService','HttpService','AppService',function ($log,$q,StorageService,HttpService,AppService){

	//class entity in MessageBoardService
	var CategoryApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/mbcategory/get-categories/group-id/";
	var ThreadsApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/mbthread/get-threads/group-id/";
	var RootMessageApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/mbmessage/get-message/message-id/";
	var MessagesApiUrl = AppService.getBaseURL() + "/api/secure/jsonws/mbmessage/get-thread-messages/group-id/";

	var threadsIncrement = 50;
	var messagesIncrement = 200;

	var categoriesHolder = {
		groupId:undefined
	};

	var threadsHolder = {
		threads : {},
		groupId:undefined,
		categoryId:undefined
	};

	var messagesHolder = {
		messages : {},
		groupId:undefined,
		categoryId:undefined,
		threadId:undefined
	};

	function validateGroup(group){
		if(Object.prototype.toString.call(group) !== '[object Object]'){
			console.error("No group object given");
		}
		if(group && !group.id){
			console.error("No group id given");
		}
	}

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
			threadIds : [],
			categoryIds : []
	    }
    }
    function storeGroupCategoryIds(gid, idArray){
    	//Storing the array of Id's
    	StorageService.store('Group' + gid + '_CategoryIds',idArray);
    }
    //Sets the webstorage
    function storeCategories(gid,categories){
    	var idArray = [];
    	for(var i = 0 ; i < categories.length ; i ++){
    		
    		var category = categories[i];
    		var id = category.categoryId;

    		idArray.push(id);
    		
    		//Storing each category
    		StorageService.store('Group' + gid + '_Category' + id , category);	
    	}
    	storeGroupCategoryIds(gid, idArray);
    }
    function getCategories(gid){
    	var categoryIds = StorageService.get('Group' + gid + '_CategoryIds');
    	if(!categoryIds)return;
    	var categories = [];
    	for( var i = 0; i < categoryIds.length ; i++){
    		var category = StorageService.get('Group' + gid + '_Category' + categoryIds[i])
    		categories.push(category);	
    	}
    	return categories;
    }

    function addChildrenIds(node,candidates){
    	node.categoryIds = [];
    	var children =[];
    	//Adding immediate children if present
    	for(var i = 0 ; i < candidates.length ; i++){
    		if(candidates[i].parentCategoryId == node.categoryId){
    			var child = candidates.splice(i--,1)[0];
    			node.categoryIds.push(child.categoryId);
    			children.push(child);
    		}
    	}
    	//Reqursive calls after children has been removed from candidates if candidates left
    	if(candidates.length > 0){
	    	for(var i = 0 ; i < children.length ; i++){
	    		addChildrenIds(children[i], candidates);
	    	}
	    }
    	return node;
    }

    function linkCategories(categories){
    	return addChildrenIds({categoryId:0},categories.slice(0));
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
    	return addChildren({categoryId:0},categories);
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
    //Sets the webstorage
    function storeCategoryThreadIds(gid, categoryId, idArray){
    	//Storing the array of Id's
		StorageService.store('Group' + gid + '_Category' + categoryId + '_Threads',idArray);
    }
	function storeThreads(gid, categoryId, threads){
		var idArray = [];
    	for(var i = 0 ; i < threads.length ; i++){
    		var thread = threads[i];
    		var id = thread.categoryId;
    		idArray.push(id);
    		//Storing each thread
    		StorageService.store('Group' + gid + '_Thread' + id , thread);	
    	}
    	storeCategoryThreadIds(gid, categoryId, idArray);
	}
	function getThreads(gid, categoryId){
		var threadIds = StorageService.get('Group' + gid + '_Category' + categoryId + '_Threads');
		if(!threadIds)return;
    	var threads = [];
    	for( var i = 0; i < threadIds.length ; i++){
    		threads.push(
    			StorageService.get('Group' + gid + '_Thread' + threadIds[i])
			);	
    	}
    	return threads;
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
    function storeThreadMessageIds(gid, categoryId, threadId, idArray){
    	//Storing the array of Id's
		StorageService.store('Group' + gid + '_Category' + categoryId + '_Thread' + threadId + "_Messages",idArray);
    }
	function storeMessages(gid, categoryId, threadId, messages){
		var idArray = [];
    	for(var i = 0 ; i < messages.length ; i++){
    		var message = messages[i];
    		var id = message.threadId;
    		idArray.push(id);
    		//Storing each thread
    		StorageService.store('Message' + id , message);
    	}
    	storeThreadMessageIds(gid, categoryId, threadId, idArray);
	}
	function getMessages(gid, categoryId, threadId){
		var messageIds = StorageService.get('Group' + gid + '_Category' + categoryId + '_Thread' + threadId + "_Messages");
   		if(!messageIds)return;;
   		var messages = [];
    	for( var i = 0; i < messageIds.length ; i++){
    		messages.push(
    			StorageService.get('Message' + messageIds[i])
			);	
    	}
    	return messages;	
	}


    //Sets the runtime memory and webstorage
    function setCategories(gid,categories){
    	//If group changes drop all previous threads
    	if(gid != categoriesHolder.groupId) categoriesHolder = {};

        categoriesHolder.root = buildCategoryTree(categories);
        categoriesHolder.groupId = gid;
    }
    
	//Sets the runtime memory and webstorage
    function setThreads(gid,categoryId,threads){
    	//If group changes drop all previous threads
    	if(gid != threadsHolder.groupId) threadsHolder = {threads:{}};

    	//Seting ID's
    	threadsHolder.groupId = gid;
    	threadsHolder.categoryId = categoryId

    	//Setting threads
    	if(!threadsHolder.threads[categoryId]) threadsHolder.threads[categoryId] = {};
        threadsHolder.threads[categoryId].threads = threads;
    }

	//Sets the runtime memory and webstorage
    function setMessages(gid,categoryId,threadId,messages){
    	//If group changes drop all previous threads
    	if(gid != messagesHolder.groupId) messagesHolder = {messages:{}};

    	//Seting ID's
    	messagesHolder.groupId = gid;
    	messagesHolder.categoryId = categoryId;
    	messagesHolder.threadId = threadId;

    	//Setting messages
        if(!messagesHolder.messages[categoryId]) messagesHolder.messages[categoryId] = {};
    	if(!messagesHolder.messages[categoryId][threadId]) messagesHolder.messages[categoryId][threadId] = {};
        messagesHolder.messages[categoryId][threadId].messages = messages;
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
		        //Linking categories for storage
				linkCategories(categories);
				//Storing categories
				storeCategories(groupId , categories);
				//Setting runtimememory
		        setCategories(groupId , categories);
		        
	          
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
						//Runtimememory is updated by object reference, but we need to update webstrage with thread title
		    			thread.title = rep.data.subject;
	    			},
	    			function(error){
	    				console.log('MessageBoardService.fetchThreads() could not fetch title in background for thread ' + thread);
	    			}
    			);
    			promiseObjects.push(promise);
			})

			$q.all(promiseObjects).then(function(){
				setThreads(groupId,categoryId, threads);
				storeThreads(groupId,categoryId, threads)
				deffered.resolve(threadsHolder.threads[categoryId]);
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
	    	setMessages(groupId, categoryId, threadId, messages);
	    	storeMessages(groupId, categoryId, threadId, messages);
			deffered.resolve(messagesHolder.messages[categoryId][threadId]);
		},function(err){
			deffered.reject("MessageBoardService.fetchMessages():Colud not fetch messages for thread " + threadId);
			console.error("Colud not fetch messages for thread " + threadId);
		});

		return deffered.promise;
    }

    //return value in Message Board Service
	return {

		getCategories : function(group){
			validateGroup(group);
			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the group is the same
			if(categoriesHolder.groupId == group.id){
				deffered.resolve(categoriesHolder);
				
				//Updates in the background even if it has categories localy
				fetchCategories(group.id);
				return deffered.promise;
			}
			//Tries to fetch from Webstorage
			var categories = getCategories(group.id);
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
			validateGroup(group);
			return fetchCategories(group.id);
		},
		getThreads : function(group, categoryId, number){
			validateGroup(group);
			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the groupe is the same
			if(threadsHolder.groupId == group.id && threadsHolder.threads[categoryId]){
				deffered.resolve(threadsHolder.threads[categoryId]);
				
				//Updates in the background even if it has categories localy
				fetchThreads(group.id,categoryId, number);
				return deffered.promise;
			}
			//Tries to fetch from Webstorage
			var threads = getThreads(group.id,categoryId);
			if(threads){
				setThreads(group.id,categoryId,threads);
				deffered.resolve(threadsHolder.threads[categoryId]);
				
				//Updates in the background even if it has categories localy
				fetchThreads(group.id,categoryId, number);
				return deffered.promise;
			}
			else{
				return fetchThreads(group.id,categoryId, number);
			}
		},
		updateThreads : function(group,categoryId){
			validateGroup(group);
			var amount = (threadsHolder.threads.length > threadsIncrement) ? threadsHolder.threads.length : threadsIncrement;
			return fetchThreads(group.id, categoryId,amount );
		},
		getMoreThreads : function(group, categoryId){
			validateGroup(group);
			var amount = (threadsHolder.threads.length > threadsIncrement) ? threadsHolder.threads.length * 2 : threadsIncrement * 2;
			
			return fetchThreads(group.id, categoryId, amount);
		},
		getMessages : function(group, categoryId, threadId, number){
			validateGroup(group);
			var deffered = $q.defer();

			//Returning whatever is in the runtime memory if the groupe is the same
			if(messagesHolder.groupId == group.id && messagesHolder.messages[categoryId][threadId]){
				deffered.resolve(messagesHolder.messages[categoryId][threadId]);
				
				//Updates in the background even if it has categories localy
				fetchMessages(group.id,categoryId,threadId, number);
				return deffered.promise;
			}
			//Tries to fetch from Webstorage
			var messages = getMessages(group.id, categoryId, threadId);
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
			validateGroup(group);
			var amount = (messagesHolder.messages.length > messagesIncrement) ? messagesHolder.messages.length : messagesIncrement
			return fetchMessages(group.id, categoryId, threadId, amount);
		},
		getMoreMessages : function(group, categoryId, threadId, amount){
			validateGroup(group);
			var amount = (messagesHolder.messages.length > messagesIncrement) ? messagesHolder.messages.length * 2 : messagesIncrement * 2;
			return fetchMessages(group.id, categoryId, threadId, amount);
		}
	}
}])