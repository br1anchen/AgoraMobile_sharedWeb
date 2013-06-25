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
    };

    function checkStorage(){
      if(!StorageService.get("GroupIDs")){
        return false;
      }
      return true;
    };

  	//return value from GroupService
  	return{

  		//fetch function
      fetchGroups : function(customizedAuth){
        var deffered = $q.defer();

        //check if stored groupIds
        var stored = checkStorage();

        if(!stored){
          return  HttpService.request(apiUrl,customizedAuth,'GET');
        }

        deffered.reject("not fetch");
        return deffered.promise;
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