'use strict';

angular.module('app.loginService',['app.httpService','app.utilityService','app.storageService'])
.factory('LoginService', ['$http','$log','$q','HttpService','UtilityService','StorageService',function ($http,$log,$q,HttpService,UtilityService,StorageService) {

	//class entity in LoginService
  	var serviceUser = {
      screenName : "",
      userId : "",
      auth : "",
      fullName : "",
      portraitId : "",
      portraitImgUrl: "",
      emailAddress : "",
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

      getUserInfo : function(screenName,companyId){
        var deffered = $q.defer();

        var userInfoUrl = 'https://agora.uninett.no/api/secure/jsonws/user/get-user-by-screen-name/company-id/'+ companyId + '/screen-name/' + screenName;
        var promise = HttpService.request(userInfoUrl,serviceUser.auth,"GET");
        promise.then(function(rep){
          console.log(JSON.stringify(rep));
          if(!rep.data.exception){
            serviceUser.screenName = rep.data.screenName;
            serviceUser.userId = rep.data.userId;
            serviceUser.fullName = rep.data.middleName == "" ? rep.data.firstName + " " + rep.data.lastName : rep.data.firstName + " " + rep.data.middleName + " " + rep.data.lastName;
            serviceUser.portraitId = rep.data.portraitId;
            serviceUser.portraitImgUrl = "https://agora.uninett.no/image/user_male_portrait?img_id=" + rep.data.portraitId;
            serviceUser.emailAddress = rep.data.emailAddress;
            serviceUser.companyId = rep.data.companyId;

            deffered.resolve("user data fetched");
          }else{
            deffered.reject("failed to get user info");
          }
        },function(err){
          deffered.reject("failed to get user info");
        });

        return deffered.promise;
      },

      //request Storage Service to store user info
      requestStorage : function(){
        console.log("screenName :" + serviceUser.screenName);
        //store user screen name
        StorageService.store('UserScreenName',serviceUser.screenName);

        //store user obj with screen name as index key
        return StorageService.store(serviceUser.screenName,serviceUser);
      },

      getFeideLoginUrl : function(){
        return HttpService.request(feideRequestUrl,'','GET');
      }
  }
}]);