"use strict"

//Activity Service

angular.module('app.searchService',['app.storageService','app.httpService','app.appService']).

factory('SearchService',function ($log,$q,StorageService,HttpService,AppService){

	//class entity in SearchService
	var apiSearch = AppService.getBaseURL() + "/api/secure/jsonws/agora-simple-search-portlet.searcher/";//get-any,get-dl-file-entry,get-message-board,get-wiki/uid/250919/from/0/to/20/keywords/agora

	var appendIncrement = 20;

	var resultsHolder = {
		results :[],
		number : undefined,
		keyword : undefined,
		searchType : undefined
	};

    function JSON2Results(results){//parse json to result obj
    	var parsedResults = [];
    	angular.forEach(results, function(object, key){
    		var strClassName = object.entryClassName.split(".");
    		var entryType = strClassName[strClassName.length - 1];

    		var ifAccess = jQuery.grep(StorageService.get('groups'),function(g,k){
            	return (g.id == object.groupId);
        	});

    		var result = undefined;

    		if(ifAccess.length != 0){
    			result = {};

    			result.groupId = object.groupId;
    			result.gName = ifAccess[0].name;
    			result.snippet = object.snippet;
    			result.relateUser = object.userName;
    			result.modifiedDate = object.modified.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,"$1/$2/$3 $4:$5:$6");

    			switch(entryType){
    				case "WikiPage":

    					result.type = "wiki";
    					result.nodeId = object.nodeId;
		    			result.title = object.title;
    				
    					break;
    				case "DLFileEntry":

    					result.type = "file";
    					result.folderId = object.folderId;
    					result.fileName = object.title;
    					result.description = object.description;

    					break;
    				case "MBMessage":

    					result.type = "message";
    					result.threadId = object.threadId;
    					result.categoryId = object.categoryId;

    					break;
    			}
    			
    		}

    		if(result){
    			parsedResults.push(result);
    		}
		});

      	return parsedResults;
    }
    function stripHTML(str){
    	if(!str)return str;
		return str.replace(/<.*?>/g , "");
	}

    function searchResults(number,keyword,searchType){
		var deffered = $q.defer();
		var user = StorageService.get('User');

		var amount = number ? number : appendIncrement;

		var promise = HttpService.request(apiSearch + searchType + '/uid/' + user.id + '/from/0/to/'+ amount + '/keywords/' + keyword,'','GET');

		promise.then(function(res){
			setResults(number,keyword,searchType,JSON2Results(res.data));
          
			deffered.resolve(resultsHolder);

        },function(err){
          deffered.reject(resultsHolder);
        });

		return deffered.promise;
	}
	function setResults(number,keyword,searchType,results){
		resultsHolder.results = results;//Replacing old data
		resultsHolder.number = number;
		resultsHolder.keyword = keyword;
		resultsHolder.searchType = searchType;
	}

    //return value in Search Service
	return {
		getMoreResults : function(){
			var amount = resultsHolder.activities.length <= appendIncrement ? appendIncrement : resultsHolder.activities.length;

			return searchResults(amount + appendIncrement,resultsHolder.keyword,resultsHolder.searchType);
		},
		getResults : function(number,keyword,searchType){
			var amount = number ? number : appendIncrement;
			amount = amount <= appendIncrement ? appendIncrement : amount;
			
			return searchResults(amount,keyword,searchType);
		}
	}
})
