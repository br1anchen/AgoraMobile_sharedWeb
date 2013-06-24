'use strict';

angular.module('app.loginService',['app.httpService','app.utilityService','app.storageService'])
.factory('LoginService', ['$http','$log','$q','HttpService','UtilityService','StorageService',function ($http,$log,$q,HttpService,UtilityService,StorageService) {

	//class entity in LoginService
  	var serviceUser = {
      screenName : "",
      userId : "",
      password : "",
      companyId : ""
    };
    var serviceLoginUrl = 'company/get-company-by-virtual-host/virtual-host/agora.uninett.no';

  	//return value from LoginService
  	return{

  		//login function
  		login : function(screenName,password){
        serviceUser.screenName = screenName;
        serviceUser.screenName = password;
        var authToken = "Basic " + UtilityService.base64.encode(screenName + ":" + password);
        return HttpService.request(serviceLoginUrl,authToken,'GET');
  		},

      //request Storage Service to store screenName and authorization key
      requestStorage : function(screenName,companyId){
        var authToken = "Basic " + UtilityService.base64.encode(serviceUser.screenName + ":" + serviceUser.password);
        if(StorageService.get(screenName) == undefined){
          return StorageService.store(serviceUser.screenName,serviceUser);
        }else{
          return undefined;
        }
      }
  }
}]);