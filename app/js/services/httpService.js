'use strict';

angular.module('app.httpService',['app.storageService'])
.factory('HttpService', ['$http','$log','$q','StorageService',function ($http,$log,$q,StorageService) {

	//class entity in HttpService
  	var domainUrl = "https://agora.uninett.no/api/secure/jsonws/";
  	var authorization = "Basic YnIxYW5jaGVuOkFwdHg0ODY5"; //StorageService.get(userAuthorization);

  	//return value from HttpService
  	return{

  		//http request function
  		request : function(requestUrl,customizedAuthorization,requestMethod){
  			var deffered = $q.defer();

        if(customizedAuthorization == "")
        {
          customizedAuthorization = authorization;
        }

  			$http({//http request content
  				url : domainUrl + requestUrl,
  				method : requestMethod,
  				headers : {
  					'Authorization' : customizedAuthorization,
  					'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  				}
  			
  			//success function
  			}).success(function(data, status, headers, config){
  				
  				$log.log("HttpService request success");
  				
  				deffered.resolve({data : data, status : status, headers : headers, config : config});
  			
  			//error function
  			}).error(function(data, status, headers, config){

  				$log.log("HttpService request error");

  				deffered.reject({data : data, status : status, headers : headers, config : config});
  			
  			});
  		
  			return deffered.promise;

  		}
  }
}]);