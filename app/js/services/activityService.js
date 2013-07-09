"use strict"

//Activity Service

angular.module('app.activityService',['app.storageService','app.httpService']).

factory('ActivityService',['$log','$q','StorageService','HttpService',function ($log,$q,StorageService,HttpService){

	//class entity in ActivityService
	var apiUrl = "https://agora.uninett.no/api/secure/jsonws/activity/get-group-activitylogs/groupId/";

	var activityLogsHolder = {//only store first ten activity logs
		activities :[]
	};

	var activities = [];
	var latestLogTime;//check latest log time when get more

    function JSON2ActLog(json){//parse json to group obj
      return {
        name : json.name,
        groupId : json.groupId,
        className : json.className,
        classPK : json.classPK,
        timestamp : json.timestamp,
        involved : json.involved,
        posterImg : json.posterImgUrl,
        file : json.documentUrl
      }
    }

    function storeActivityLogs(data){
    	activities = [];// drop old data

    	var logIndex = 0;

        angular.forEach(data,function(a,k){
        	
        	logIndex ++;

        	var actLog = JSON2ActLog(a);

        	if(logIndex <= 10){//only store first 10 logs
        		StorageService.store("Group" + actLog.groupId + "_ActLog" + logIndex,actLog);
        	}

        	activities.push(actLog);
        });

        activityLogsHolder.activities = activities;
    }

    //return value in Activity Service
	return {

		fetchActivityLogs : function(groupId){
			var deffered = $q.defer();

			var promise = HttpService.request(apiUrl + groupId + '/number/10','','GET');

			promise.then(function(rep){

	          storeActivityLogs(rep.data);
	          
	          deffered.resolve("activity logs fetched");

	        },function(err){
	          deffered.reject("activity logs failed to get");
	        });

			return deffered.promise;
		},

		fetchMoreLogs : function(groupId){
			var deffered = $q.defer();

			var logNumber = activities.length + 10;
			var promise = HttpService.request(apiUrl + groupId + '/number/' +logNumber,'','GET');

			promise.then(function(rep){

	          storeActivityLogs(rep.data);
	          
	          deffered.resolve("10 more activity logs fetched");

	        },function(err){
	          deffered.reject("10 more activity logs failed to get");
	        });

			return deffered.promise;
		},

		getActivityLogs : function(){
			return activityLogsHolder.activities.length > 0 ? activityLogsHolder.activities : undefined;
		}
	}
}])