'use strict';

angular.module('app.httpService',['app.storageService'])
.factory('HttpService', function ($http,$log,$q,StorageService,$timeout,$rootScope) {

	 //class entity in HttpService
  	//var domainUrl = "https://agora.uninett.no/api/secure/jsonws/";

  	//return value from HttpService
  	return{

  		//http request function
  		request : function(requestUrl,customizedAuthorization,requestMethod){
  			var deffered = $q.defer();

        var authorization;

        if(!customizedAuthorization)
        {
          if(StorageService.get('User')){
            authorization = StorageService.get('User').auth;
          }
        }else{
          authorization = customizedAuthorization;
        }
        // var httpRequest = function(){
          $http({//http request content
              url : requestUrl,
              method : requestMethod,
              headers : {
                'Authorization' : authorization,
                'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
              },
              timeout : 5000
            
            //success function
            }).success(function(data, status, headers, config){
              deffered.resolve({data : data, status : status, headers : headers, config : config});
            
            //error function
            }).error(function(data, status, headers, config){
              console.log("HttpService request error");

              deffered.reject({data : data, status : status});
          });
        // }

        // var phase = $rootScope.$$phase;
        // if(phase == '$apply' || phase == '$digest') {
    		  // httpRequest();	
        // }else{
        //   $rootScope.$apply(httpRequest)
        // }
  			return deffered.promise;
  		}
  }
});