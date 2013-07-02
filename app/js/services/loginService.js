'use strict';

angular.module('app.loginService',['app.httpService','app.utilityService','app.storageService'])
.factory('LoginService', ['$http','$log','$q','HttpService','UtilityService','StorageService',function ($http,$log,$q,HttpService,UtilityService,StorageService) {

	//class entity in LoginService
  	var serviceUser = {
      screenName : "",
      userId : "",
      auth : "",
      companyId : ""
    };
    var serviceLoginUrl = 'https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no';
    var feideRequestUrl = 'https://agora-test.uninett.no/c/portal/feide/loginurl?redirect=%2Fgroup%2Fagora%2Fdokumenter%3Fp_p_id%3Dagoramypassword_WAR_agoramypasswordportlet%26p_p_state%3Dpop_up%26p_p_mode%3Dedit%26p_p_lifecycle%30%26controlPanelCategory%3portlet_agoramypassword_WAR_agoramypasswordportlet';

  	//return value from LoginService
  	return{

  		//login function
  		login : function(screenName,password){
        serviceUser.screenName = screenName;
        var authToken = "Basic " + UtilityService.base64.encode(screenName + ":" + password);
        serviceUser.auth = authToken;
        return HttpService.request(serviceLoginUrl,serviceUser.auth,'GET');
  		},

      //request Storage Service to store screenName and authorization key
      requestStorage : function(screenName,companyId){

        //store user screen name
        StorageService.store('UserScreenName',screenName);

        //set comapyId in userObj
        serviceUser.companyId = companyId;

        //store user obj with screen name as index key
        return StorageService.store(serviceUser.screenName,serviceUser);
      },

      getFeideLoginUrl : function(){
        return HttpService.request(feideRequestUrl,'','GET');
      }
  }
}]);