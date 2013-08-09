angular.module('app.contentService',['app.messageBoardService','app.documentService','app.wikiPageService']).
factory('ContentService',function($log,$rootScope,$q,MessageBoardService,DocumentService,WikiPageService){
		
		var messageBoardCDeffer;

		var messageBoardTDeffer;
		
		var messageBoardMDeffer;

		var documentsDeffer;

		var wikiDeffer;

		//Hooking up promises other views can use
		function buildPromises(){
			messageBoardCDeffer = $q.defer();
			
			messageBoardTDeffer = $q.defer();
			
			messageBoardMDeffer = $q.defer();

			documentsDeffer = $q.defer();
			
			wikiDeffer = $q.defer();
		}

	return {
		getMBCPromise : function(){
			return messageBoardCDeffer.promise;
		},
		getMBTPromise : function(){
			return messageBoardTDeffer.promise;
		},
		getMBMPromise : function(){
			return messageBoardMDeffer.promise;
		},
		getDocumentsPromise : function(){
			return documentsDeffer.promise;
		},
		getWikiPromise : function(){
			return wikiDeffer.promise;
		},
		loadGroupContent : function(curretGroup){
			buildPromises();

			//Loading all messageBoard content
			//Loading all categories
			MessageBoardService.getCategories(curretGroup)
			.then(
				function(categoriesHolder){
					messageBoardCDeffer.resolve();
					var threadPromises = [];
					angular.forEach(categoriesHolder.categories,function(c,k){
						//Loading all threads
						var threadsPromise = MessageBoardService.getThreads(curretGroup,c.categoryId).then(function(threadHolder){

							var messagesPromises = [];
							angular.forEach(threadHolder.threads,function(t,k){
								//Loading all messages
								messagesPromises.push(MessageBoardService.getMessages(curretGroup,c.categoryId,t.threadId));

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
				}
			)
			//Loading documents
			.then(function(){
				//TODO
			})
			//Loading wikies
			.then(function(){
				//TODO
			})
		}
	}
})