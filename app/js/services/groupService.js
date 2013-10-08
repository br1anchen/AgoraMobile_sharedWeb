'use strict';

angular.module('app.groupService',['app.storageService','app.httpService','app.appService'])
.factory('GroupService', ['$http','$log','$q','StorageService','HttpService','AppService',function ($http,$log,$q,StorageService,HttpService,AppService) {

	//class entity in GroupService
  	// var apiUrl = "https://agora.uninett.no/api/secure/jsonws/group/get-user-places/-class-names/max/10";
    var apiUrl = AppService.getBaseURL() + "/api/secure/jsonws/group/get-user-places/-class-names/max/100";

    var groupsHolder = {//reference obj to be used by controller
      groups : []
    };
    
    function JSON2Group(json){//parse json to group obj
      return {
        id : json.groupId,
        name : json.name,
        type : json.type,
        site : json.site,
        friendlyURL : json.friendlyURL,
        isTopGroup : 0
      }
    }

    function fetchGroups(){//fetch data function
      
      StorageService.deleteDB("Groups",null);

      var deffered = $q.defer();
      var promise = HttpService.request(apiUrl,'','GET');
      var storePromiseObjs = [];

      promise.then(
        function(rep){

          angular.forEach(rep.data, function(g, k){
            var group = JSON2Group(g);

            if(g.site && g.groupId == 10157){//We treat the top group differently
              group.name = "Agora";
              group.isTopGroup = 1;
              StorageService.store('TopGroup',group);
              var storePromise = StorageService.storeDB("Groups",group);
              storePromiseObjs.push(storePromise);
            }
            else if(g.site){
              var storePromise = StorageService.storeDB("Groups",group);
              storePromiseObjs.push(storePromise);
            }
          });

          $q.all(storePromiseObjs).then(function(){
            StorageService.getDB("Groups","groups",function(groups){
              groupsHolder.groups = groups;
              deffered.resolve(groupsHolder);
            });
          });
          
        },
        function(err){
          deffered.reject("GroupsService:fetchGroups()Could not fetch groups");
          console.error("GroupsService:fetchGroups()Could not fetch groups")
        }
      );
      
      return deffered.promise;
    }

  	//return value from GroupService
  	return{
      getGroups : function(){//
        var deffered = $q.defer();

        //Returns groups from runtime memory if present, and updats groups in bacground
        if(groupsHolder.groups.length > 0){
          deffered.resolve(groupsHolder);
          //Updates in background
          this.updateGroups();
        }
        else{
          StorageService.getDB("Groups","groups",function(localGroups){
            //Returns groups from localStorage if present, and updats groups in bacground
            if(localGroups){
              groupsHolder.groups = localGroups;
              deffered.resolve(groupsHolder);
              //Updating groups in bacground
              fetchGroups();
            }
            else{
              //Tries to fetch groups
              return fetchGroups();
            }
          });
        }
        return deffered.promise;
      },

      updateGroups : function(){//update groups request
        return fetchGroups();
      },
      clear : function(){
        StorageService.deleteDB("Groups",null);
        groupsHolder.groups = [];
      }
  }
}]);