'use strict';

angular.module('app.loginService',['app.httpService','app.utilityService'])
.factory('LoginService', ['$http','$log','$q','HttpService','UtilityService',function ($http,$log,$q,HttpService,UtilityService) {

	//class entity in LoginService
  	var loginUser = {
      screenName : "",
      userId : "",
      password : ""
    };

  	//return value from LoginService
  	return{

  		//login function
  		login : function(loginUrl,loginUser){
        var authToken = "Basic " + UtilityService.base64.encode(loginUser.screenName + ":" + loginUser.password);
        return HttpService.request(loginUrl,authToken,'GET');
  		},

      //request Storage Service to store screenName and authorization key
      requestStorage : function(screenName,authToken,companyId){
        return "";
      }
  }
}]);