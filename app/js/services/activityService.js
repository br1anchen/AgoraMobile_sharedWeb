"use strict"

//Activity Service

angular.module('app.activityService',['app.storageService','app.httpService']).

factory('ActivityService',['$log','$q','StorageService','HttpService','AppService',function ($log,$q,StorageService,HttpService,AppService){

	//class entity in ActivityService
	var apiUser = AppService.getBaseURL() +  ":8080/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/";//489185/from/0/to/100
	var apiGroup = AppService.getBaseURL() + ":8080/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/";//489185/gid/10157/from/0/to/100";

	var activitiesHolder = {
		activities :[],
		groupId: undefined
	};

	// var latestLogTime;//check latest log time when get more || Not used

    function JSON2Act(json){//parse json to group obj 
      activity = {
      	date:json.data,
      	pic:json.pict,
      	user:json.user
      }
      if(json.WikiPage_nodeid){
      	activity.type = "wiki";
      	activity.node = json.WikiPage_nodeid;
      	activity.title = json.WikiPage_title;
      }
      else if(json.MBMessage_messageId){
      	activity.type = "message";
      }
      else if(json.DLFileEntry_filelink){
      	activity.type = "file";
      	activity.URL = json.DLFileEntry_filelink;
      	activity.folderURL = json.DLFileEntry_folderlink;
      }
    }
    function stripHTML(str){
		return str.replace(/<.*?>/g,"");
	}

    function storeActivities(groupId,data){
    	activitiesHolder.activities = [];// drop old data 
		StorageService.store("Group" + groupId + "_Activities",data);
    }

    function fetchActivities(groupId,number){
		var deffered = $q.defer();

		var user = StorageService.get('User');
    	if(!user || !user.id){
    		deffered.reject('ActivitySerice.fetchActivities(): no uid');
    		$log.error('ActivitySerice.fetchActivities(): no uid');
    	}
    	else{
    		var number = number ? number : 10;

			var promise = HttpService.request(apiGroup + user.id + 'gid/'+groupId+'/from/0/to/'+number,'','GET');

			promise.then(function(rep){

				storeActivities(groupId,JSON2Act(rep.data));
	          
				deffered.resolve(activitiesHolder);

	        },function(err){
	          deffered.reject(activitiesHolder);
	        });
    	}

		return deffered.promise;
	}
	function fetchTopActivities(number){
		var deffered = $q.defer();

		var user = StorageService.get('User');
    	if(!user || !user.id){
    		deffered.reject('ActivitySerice.fetchActivities(): no uid');
    		$log.error('ActivitySerice.fetchActivities(): no uid');
    	}
    	else{
    		var number = number ? number : 10;

			var promise = HttpService.request(apiUser + user.id + 'gid/'+groupId+'/from/0/to/'+number,'','GET');

			promise.then(function(rep){

				storeActivities(groupId,JSON2Act(rep.data));
	          
				deffered.resolve(activitiesHolder);

	        },function(err){
	          deffered.reject(activitiesHolder);
	        });
    	}

		return deffered.promise;
	}

    //return value in Activity Service
	return {
		getMoreActivities : function(group){
			//If the given group is the top group
			if(group.type == 1){
				fetchTopActivities(activitiesHolder.activities.length + 10);
			}

			return fetchActivities(group.id,activitiesHolder.activities.length+10);
		},
		updateActivities : function(group){
			//If the given group is the top group
			if(group.type == 1){
				fetchTopActivities(activitiesHolder.activities.length);
			}

			return fetchActivities(group.id,activitiesHolder.activities.length);
		},
		getActivities : function(group){
			//Checking runtime memory for activities for this group
			if( group.id == activitiesHolder.id && activitiesHolder.activities.length > 0){
				var deffered = $q.defer();
				deffered.resolve(activitiesHolder);
				return deffered.promise;
			}
			//Fetching activities for this group if present in webstorage
			else{
				var activities = StorageService.get("Group"+group.id+"_Activities");
				//Returning the stored activities if present
				if(activities && activities.length > 0){
					var deffered = $q.defer();
					deffered.resolve({activities:activities});	
					return deffered.promise;
					
				}
				//Fetching activities for this group from server
				return fetchActivities(group.id);
			}
			deffered.promise;
		}
	}
}])