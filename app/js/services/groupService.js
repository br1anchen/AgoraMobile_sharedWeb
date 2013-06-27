'use strict';

angular.module('app.groupService',['app.storageService','app.httpService'])
.factory('GroupService', ['$http','$log','$q','StorageService','HttpService',function ($http,$log,$q,StorageService,HttpService) {

	//class entity in HttpService
  	var apiUrl = "group/get-user-places/-class-names/max/10";

    var groupsHolder = {//reference obj to be used by controller
      groups : []
    };
    var groups = []; //local virable to store the group objs in array
    var groupIds = []; //groups Ids array to fast index
    
    

    function fetchGroups(){//fetch data function
      var deffered = $q.defer();

      if(!StorageService.get("GroupIDs")){//no local storage then do request
        
        var promise = HttpService.request(apiUrl,'','GET');

        promise.then(function(rep){
          groups = requestStorage(rep.data);
          groupsHolder.groups = groups;
          deffered.resolve("fetched");
        },function(err){
          deffered.reject("error");
        });

      }else{
        //droup all local variable
        groups = [];
        groupIds = [];
        
        angular.forEach(StorageService.get("GroupIDs"),function(gID,k){
          var storedGroup = StorageService.get(gID);
          groups.push(storedGroup);
        });
        groupsHolder.groups = groups;
        deffered.resolve("use stored");
      }
      
      return deffered.promise;
    }

    function requestStorage(data){//store the data of json from http response
      var storedGroups = [];
      var storedGroipIds = [];

      angular.forEach(data, function(g, k){

        if(g.site && g.type == 3){//type 3 as user group

          var userGroup = JSON2Group(g);
          storedGroups.push(userGroup);
          storedGroipIds.push("Group"+userGroup.id);

          StorageService.store("Group"+userGroup.id,userGroup);

        }else if(g.site && g.type == 1){//type 1 as top guest group

          var topGroup = JSON2Group(g);
          StorageService.store("TopGroup",topGroup);
        }

      });
        
      StorageService.store("GroupIDs",storedGroipIds);
      return storedGroups;
    }

    function JSON2Group(json){//parse json to group obj
      return {
        id : json.groupId,
        name : json.name,
        type : json.type,
        site : json.site
      }
    }

  	//return value from GroupService
  	return{

      fetchGroups : function(){//fetch request from controller
        return fetchGroups();
      },

      getGroups : function(){//get groups request 
        return groupsHolder.groups.length > 0 ? groupsHolder.groups : undefined;
      },

      updateGroups : function(){//update groups request
        var deffered = $q.defer();

        var promise = HttpService.request(apiUrl,'','GET');

        promise.then(function(rep){
          
          //drop all old groups data
          groups = [];
          groupIds = [];

          angular.forEach(rep.data, function(g,k){

            if(g.site && g.type == 3){

              var userGroup = JSON2Group(g);
              groups.push(userGroup);
              groupIds.push("Group"+userGroup.id);

              //check if it is new group data and store
              var needUpdate = jQuery.inArray("Group"+g.groupId, StorageService.get("GroupIDs"));
              if(needUpdate == -1){
                StorageService.store("Group"+userGroup.id,userGroup);
              }
            }

          });

          //update whole groups data
          groupsHolder.groups = groups;
          StorageService.store("GroupIDs",groupIds);

          deffered.resolve("updated");

        },function(err){
          deffered.reject("error");
        });

        return deffered.promise;
      }
  }
}]);