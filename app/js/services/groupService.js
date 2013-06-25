'use strict';

angular.module('app.groupService',['app.storageService','app.httpService'])
.factory('GroupService', ['$http','$log','$q','StorageService','HttpService',function ($http,$log,$q,StorageService,HttpService) {

	//class entity in HttpService
  	var apiUrl = "group/get-user-places/-class-names/max/10";
    var tempGroup = {
      id : "",
      name : "",
      type : "",
      site : ""
    }

  	//return value from GroupService
  	return{

  		//fetch function
      fetchGroups : function(customizedAuth){
        return  HttpService.request(apiUrl,customizedAuth,'GET');
      },

      requestStorage : function(resp){
        var groupIds = [];
        angular.forEach(resp.data, function(g, k){

          tempGroup.id = g.groupId;
          tempGroup.name = g.name;
          tempGroup.type = g.type;
          tempGroup.site = g.site;
          
          StorageService.store("Group"+tempGroup.id,tempGroup);
          
          groupIds.push("Group"+tempGroup.id);
        });
        
        return StorageService.store("GroupIDs",groupIds);
      }
  }
}]);