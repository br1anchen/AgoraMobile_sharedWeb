'use strict';

angular.module('app.loginService',['app.httpService','app.utilityService','app.storageService','app.appService'])
.factory('LoginService', function ($http,$log,$q,HttpService,UtilityService,StorageService,AppService,$state) {

	//class entity in LoginService
  	var user = {
      screenName : "",
      userId : "",
      auth : "",
      fullName : "",
      portraitId : "",
      portraitImgUrl: "",
      emailAddress : "",
      companyId : ""
    };
    var serviceLoginUrl = AppService.getBaseURL() + '/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/' + AppService.getBaseURL().replace(/.*\/\//,"");
    var feideRequestUrl = AppService.getBaseURL() + '/c/portal/feide/loginurl?redirect=%2Fgroup%2Fagora%2Fdokumenter%3Fp_p_id%3Dagoramypassword_WAR_agoramypasswordportlet%26p_p_state%3Dpop_up%26p_p_mode%3Dedit%26p_p_lifecycle%30%26controlPanelCategory%3portlet_agoramypassword_WAR_agoramypasswordportlet';
    // var feideRequestUrl = 'https://agora-test.uninett.no/c/portal/feide/loginurl?redirect=%2Fgroup%2Fagora%2Fdokumenter%3Fp_p_id%3Dagoramypassword_WAR_agoramypasswordportlet%26p_p_state%3Dpop_up%26p_p_mode%3Dedit%26p_p_lifecycle%30%26controlPanelCategory%3portlet_agoramypassword_WAR_agoramypasswordportlet';

  	//return value from LoginService
  	return{

  		//login function
  		login : function(screenName,password){
        user.screenName = screenName;
        var authToken = "Basic " + UtilityService.base64.encode(screenName + ":" + password);
        user.auth = authToken;
        return HttpService.request(serviceLoginUrl,user.auth,'GET');
  		},

      getUserInfo : function(screenName,companyId){
        var deffered = $q.defer();

        var userInfoUrl = AppService.getBaseURL() + '/api/secure/jsonws/user/get-user-by-screen-name/company-id/'+ companyId + '/screen-name/' + screenName;
        var promise = HttpService.request(userInfoUrl,user.auth,"GET");
        promise.then(function(rep){

          if(!rep.data.exception){
            user.screenName = rep.data.screenName;
            user.id = rep.data.userId;
            user.fullName = rep.data.middleName == "" ? rep.data.firstName + " " + rep.data.lastName : rep.data.firstName + " " + rep.data.middleName + " " + rep.data.lastName;
            user.portraitId = rep.data.portraitId;
            user.portraitImgUrl = AppService.getBaseURL() + "/image/user_male_portrait?img_id=" + rep.data.portraitId;
            user.emailAddress = rep.data.emailAddress;
            user.companyId = rep.data.companyId;

            deffered.resolve("user data fetched");

            //store user screen name
            StorageService.store('User',user);

          }else{
            deffered.reject("failed to get user info");
          }
        },function(err){
          deffered.reject("failed to get user info");
        });

        return deffered.promise;
      },

      getFeideLoginUrl : function(){
        return HttpService.request(feideRequestUrl,'','GET');
      },
      logOut : function(){
        console.log("Login out "+user.screenName);
        StorageService.clear();

        cordova.exec(function(rep){
          console.log(rep);
        }, function(error) {
          console.log(error);
          navigator.notification.alert("Log Out Error Occured", function(){
          }, "Sorry", "I understand");
        }, "cookieManager","deleteCookies",[]);

        //deleteAllCookies();  delete cookies by javascript which does not work in phonegap
        $state.transitionTo('login');
      }
  }
});