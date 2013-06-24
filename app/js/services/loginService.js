'use strict';

angular.module('app.loginService',['app.httpService','app.utilityService','app.storageService'])
.factory('LoginService', ['$http','$log','$q','HttpService','UtilityService','StorageService',function ($http,$log,$q,HttpService,UtilityService,StorageService) {

	//class entity in LoginService
  	var loginUser = {
      screenName : "",
      userId : "",
      password : "",
      companyId : ""
    };

  	//return value from LoginService
  	return{

  		//login function
  		login : function(loginUrl,loginUser){
        var authToken = "Basic " + UtilityService.base64.encode(loginUser.screenName + ":" + loginUser.password);
        return HttpService.request(loginUrl,authToken,'GET');
  		},

      //request Storage Service to store screenName and authorization key
      requestStorage : function(loginUser){
        var authToken = "Basic " + UtilityService.base64.encode(loginUser.screenName + ":" + loginUser.password);
        if(StorageService.get(loginUser.screenName) == undefined){
          return StorageService.store(loginUser.screenName,loginUser);
        }else{
          return undefined;
        }
      }
  }
}]);