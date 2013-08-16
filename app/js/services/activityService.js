"use strict"

//Activity Service

angular.module('app.activityService',['app.storageService','app.httpService','app.appService']).

factory('ActivityService',['$log','$q','StorageService','HttpService','AppService',function ($log,$q,StorageService,HttpService,AppService){

	//class entity in ActivityService
	var apiUser = AppService.getBaseURL() +  "/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/";//489185/from/0/to/100
	var apiGroup = AppService.getBaseURL() + "/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/";//489185/gid/10157/from/0/to/100";
	var appendIncrement = 20;

	var activitiesHolder = {
		activities :[],
		groupId: undefined
	};

    function JSON2Activities(activities){//parse json to group obj
    	var parsedActivities = [];
    	angular.forEach(activities, function(object, key){
    		var body = stripHTML(object.body);
		  	var activity = {
		      	timestamp:object.date,
		      	pic:object.pict.substring(0,object.pict.indexOf('&')),
		      	user:object.user,
		      	groupId:parseInt(object.groupId),
		      	action:body.substring(0,body.indexOf(',')),
		      	reference:body.substring(body.indexOf(',')+2)
			}
		    if(object.WikiPage_nodeid){
				activity.type = "wiki";
				activity.node = parseInt(object.WikiPage_nodeid);
				activity.title = object.WikiPage_title;
		    }
		   	else if(object.MBMessage_messageId){
		      	activity.type = "message";
		      	activity.messageId = parseInt(object.MBMessage_messageId);
		    }
		    else if(object.DLFileEntry_filelink){
		      	activity.type = "file";
		      	var GETData =object.DLFileEntry_filelink.split('?').pop().split('&')
				for(var i=0; i<GETData.length; i++){
					if(GETData[i].indexOf('folderId')>-1){
						activity.folderId=parseInt(GETData[i].split('=').pop());
					}
					if(GETData[i].indexOf('title')>-1){
						activity.fileName = GETData[i].split('=').pop().replace(/\+/g,' ');
					}
				}
		    }
		    parsedActivities.push(activity);
		})
      	return parsedActivities;
    }
    function stripHTML(str){
		return str.replace(/<.*?>/g , "");
	}

    function storeActivities(groupId,activities){
    	activitiesHolder.activities = JSON2Activities(activities);//Replacing old data
		StorageService.store("Group" + groupId + "_Activities",activitiesHolder.activities);
    }

    function fetchActivities(groupId,number){
		var deffered = $q.defer();
		var user = StorageService.get('User');

		var amount = number ? number : appendIncrement;

		var promise = HttpService.request(apiGroup + user.id + '/gid/'+groupId+'/from/0/to/'+amount,'','GET');

		promise.then(function(res){
			setActivities(groupId,JSON2Activities(res.data));//Replacing old data
			storeActivities(groupId,res.data);
          
			deffered.resolve(activitiesHolder);

        },function(err){
          deffered.reject(activitiesHolder);
        });

		return deffered.promise;
	}
	function setActivities(gid,activities){
		activities.reverse();//For some reason the Agora API returns the activities as the oldest ones first, so we revert it
		activitiesHolder.activities = activities;//Replacing old data
		activitiesHolder.groupId = gid//Replacing old data
	}
	function fetchTopActivities(number){
		var deffered = $q.defer();
		var user = StorageService.get('User');

		var amount = number ? number : appendIncrement;
		// alert("T:"+apiUser + user.id + '/from/0/to/'+amount);
		var promise = HttpService.request(apiUser + user.id + '/from/0/to/'+amount,'','GET');
		// var promise = HttpService.request(apiUser + user.id + '/from/0/to/70','','GET');

		promise.then(function(res){
			//console.log("success:"+JSON.stringify(res));
			var topGroup = StorageService.get('TopGroup');
			if(!topGroup){
				console.error("ActivityService:Could not find TopGroup");	
			}
			else{
				setActivities(topGroup.id,JSON2Activities(res.data));//Replacing old data
				StorageService.store("TopGroup_Activities",activitiesHolder.activities);

			}
			deffered.resolve(activitiesHolder);
			
        },function(err){
        	// alert("ish");
			console.error("ActivitySerceice:fetchingTopActivities() failed:"+JSON.stringify(err));
          	deffered.reject(activitiesHolder);
        });

		return deffered.promise;
	}

    //return value in Activity Service
	return {
		getMoreActivities : function(group){
			var amount = activitiesHolder.activities.length <= appendIncrement ? appendIncrement : activitiesHolder.activities.length;

			//If the given group is the top group
			if(group.type == 1){
				return fetchTopActivities(amount + appendIncrement);
			}
			return fetchActivities(group.id,amount + appendIncrement);
		},
		updateActivities : function(group){
			var amount = activitiesHolder.activities.length <= appendIncrement ? appendIncrement : activitiesHolder.activities.length;
			//If the given group is the top group
			if(group.type == 1){
				return fetchTopActivities( amount );
			}
			return fetchActivities(group.id , amount );
		},
		getActivities : function(group,number){
			var amount = number ? number : appendIncrement;
			amount = amount <= appendIncrement ? appendIncrement : amount;
			var deffered = $q.defer();
			//Checking runtime memory for activities for this group
			if( group.id == activitiesHolder.groupId && activitiesHolder.activities.length > 0){
				deffered.resolve(activitiesHolder);
				//Because we don't know if the stored activities are up to date, we start a background update against the server as well
				this.updateActivities(group);
				return deffered.promise;
			}
			//Fetching activities from webstorage if present in webstorage
			else{
				var activities;
				if(group.type == 1){
					activities = StorageService.get("TopGroup_Activities");
				}
				else{
					activities = StorageService.get("Group"+group.id+"_Activities");
				}
				//Returning the stored activities if present
				if(activities && activities.length > 0){
					deffered.resolve({activities:activities});

					//Because we don't know if the stored activities are up to date, we start a background update against the server as well
					this.updateActivities(group);
					return deffered.promise;
					
				}
				var user = StorageService.get('User');
		    	if(!user || !user.id){
		    		deffered.reject('ActivitySerice.fetchActivities(): no uid');
		    		$log.error('ActivitySerice.fetchActivities(): no uid');
		    		return deffered.promise;
		    	}

				//Fetching activities for this group from server
				if(group.type == 1){
					return fetchTopActivities( amount );
				}
				return fetchActivities(group.id , amount);
			}
			deffered.promise;
		},
		getAppendIncrement : function(){
			return appendIncrement;
		},
		setAppendIncremetn : function(increment){
			getAppendIncrement = increment;
		}
	}
}])