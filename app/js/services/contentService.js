angular.module('app.contentService',['app.messageBoardService','app.documentService','app.wikiPageService','app.activityService']).
factory('ContentService',function($log,$rootScope,$q,MessageBoardService,DocumentService,WikiPageService,ActivityService){
		
		var activityDeffer;

		var messageBoardCDeffer;

		var messageBoardTDeffer;
		
		var messageBoardMDeffer;

		var messageBoardDeffer;

		var documentsDeffer;

		var wikiDeffer;

		var groupDeffer;

		//Hooking up promises other views can use
		function buildPromises(){
			activityDeffer = $q.defer();

			messageBoardCDeffer = $q.defer();
			
			messageBoardTDeffer = $q.defer();
			
			messageBoardMDeffer = $q.defer();
			
			messageBoardDeffer = $q.defer();

			documentsDeffer = $q.defer();
			
			wikiDeffer = $q.defer();
			
			groupDeffer = $q.defer();
		}

	return {
		getActivitiesPromise : function(){
			return activityDeffer.promise;
		},
		getMBCPromise : function(){
			return messageBoardCDeffer.promise;
		},
		getMBTPromise : function(){
			return messageBoardTDeffer.promise;
		},
		getMBMPromise : function(){
			return messageBoardMDeffer.promise;
		},
		getMBPromise : function(){
			return messageBoardDeffer.promise;
		},
		getDocumentsPromise : function(){
			return documentsDeffer.promise;
		},
		getWikiPromise : function(){
			return wikiDeffer.promise;
		},
		getGroupPromise : function(){
			return groupDeffer.promise;
		},
		loadGroupContent : function(group){
			buildPromises();

			//Setting up the messageBoard promise
			$q.all([
				messageBoardCDeffer.promise,
				messageBoardTDeffer.promise,
				messageBoardMDeffer.promise
			])
			.then(
				function(res){
					messageBoardDeffer.resolve(res);
				},
				function(err){
					messageBoardDeffer.reject(err);
				}
			)
			//Setting up the group promise
			$q.all([
				activityDeffer.promise,
				messageBoardDeffer.promise,
				wikiDeffer.promise,
				documentsDeffer.promise
			])
			.then(
				function(res){
					groupDeffer.resolve(res);
				},
				function(err){
					groupDeffer.reject(err);
				}
			)

			//Loading activities for this group
			ActivityService.getActivities(group,30).then(
				function(res){
					activityDeffer.resolve(res);
				},function(err){
					activityDeffer.reject(err)
				}
			)
			//Loading all messageBoard content
			//Loading all categories
			MessageBoardService.getCategories(group)
			.then(
				function(categoriesHolder){
					messageBoardCDeffer.resolve();
					var threadPromises = [];
					angular.forEach(categoriesHolder.root,function(c,k){
						//Loading all threads
						var threadsPromise = MessageBoardService.getThreads(group,c.categoryId).then(function(threadHolder){

							var messagesPromises = [];
							angular.forEach(threadHolder.threads,function(t,k){
								//Loading all messages
								messagesPromises.push(MessageBoardService.getMessages(group,c.categoryId,t.threadId));

							})
							$q.all(messagesPromises).then(function(){
								messageBoardMDeffer.resolve();
							},function(){
								messageBoardMDeffer.reject();
							})

						})
						threadPromises.push(threadsPromise);

					})
					
					$q.all(threadPromises).then(function(){
						messageBoardTDeffer.resolve();
					},function(){
						messageBoardTDeffer.reject();
					});
				},
				function(err){
					messageBoardCDeffer.reject(err);
				}
			)
			//Loading documents
			DocumentService.getDirectory(group,0).then(
				function(res){
					documentsDeffer.resolve(res);
				},
				function(err){
					documentsDeffer.reject(err);
				}
			)
			//Loading wikiPages
			WikiPageService.getWikiContentTree(group).then(
				function(res){
					wikiDeffer.resolve(res);
				},
				function(err){
					wikiDeffer.reject(err);
				}
			)
			
			return groupDeffer.promise;
		}
	}
})