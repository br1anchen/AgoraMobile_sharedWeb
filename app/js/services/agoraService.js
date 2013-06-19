angular.module('app.agoraService',['app.utilityService']).
factory('AgoraService',['$http','$log','$q','$timeout','UtilityService',function($http,$log,$q,$timeout,UtilityService){
	var internal={
		url:"https://agora.uninett.no/api/secure/jsonws/",
		companyId:undefined,
		user:{}
	}

	return {
		//Returns an array of the activities for the given group. If no group is given the top level Agora group activities should be returned
		getActivityList:function(group){
		},
		//Returns an array of sub-groups for the given group, or for the top level Agora group if no group is given
		getGroups:function(group){
			
		},
		//Returns an array of documents for the given group, or for the top level Agora group if no group is given
		getDocuments:function(group){
			
		},
		//Returns an an object representing the MessageBoard for this grups or the top level Agora group if no group is given
		getMessageBoard:function(group){
		
		},
		//Returns an object representing the Wiki for this page, or for the top level Agora group if no group is given.
		getWiki:function(group){

		},
		//Tries to log the user in to Agora. 
		//If successfull the username, password and company id is stored. 
		//A promise object for response handling is always returned
		login:function(username,password){
			var deffered = $q.defer();

			var authToken = "Basic "+UtilityService.base64.encode(username + ':' + password);
			//GET request			
			$http({
			    url: internal.url+"company/get-company-by-virtual-host/virtual-host/agora.uninett.no",
			    method: "GET",
			    headers: {'Authorization': authToken}
			//Defining success function
			}).success(function(data, status, headers, config) {
				//Storing stuff
				//TOD also store this in webstorage
				internal.companyId = data.companyId;
				internal.user.username = username;
				internal.user.password = password;
				
				$log.log("AgoraService:login():companyId stored:"+internal.companId);
				deffered.resolve({data:data,status:status,headers:headers,config:config})
			//Defining error function
			}).error(function(data, status, headers, config) {
			    deffered.reject({data:data,status:status,headers:headers,config:config})

			});

			return deffered.promise;
		}
	}
}])