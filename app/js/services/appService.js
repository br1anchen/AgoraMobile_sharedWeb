angular.module('app.appService',[]).
factory('AppService',['$log','$rootScope',function($log,$rootScope){
	var APIURL = 'http://agora-test.uninett.no:8080/api/secure/jsonws/'

	return {
		getAPIURL : function(){
			return APIURL
		},
		userMessage : function(message){
			$rootScope.$broadcast("userMessage",message);
		}
	}
}])