"use strict"

//Message Board Service

angular.module('app.messageBoardService',['app.storageService','app.httpService']).

factory('MessageBoardService',['$log','$q','StorageService','HttpService',function ($log,$q,StorageService,HttpService){

	//class entity in MessageBoardService
	var CategoryApiUrl = "https://agora.uninett.no/api/secure/jsonws/mbcategory/get-categories/group-id/";

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
		userName : json.userName
      }
    }

    function storeCategoryList(data,groupId){
    	categories = [];// drop old data
    	categoryIds = [];

        angular.forEach(data,function(c,k){

        	var category = JSON2Cat(c);

        	categoryIds.push(category.categoryId);
        	categories.push(category);

        	StorageService.store('Category' + category.categoryId,category);
        });

        categoryHolder.categories = categories;
        StorageService.store('Group' + groupId + '_CategoryIDs',categoryIds);
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
		}
	}
}])