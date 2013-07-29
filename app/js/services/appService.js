angular.module('app.appService',[]).
factory('AppService',['$log','$rootScope',function($log,$rootScope){
		var baseURL = 'https://agora-test.uninett.no';
		// var baseURL = 'http://agora-test.uninett.no:8080';

	return {
		getBaseURL : function(){
			return baseURL;
		},
		userMessage : function(message){
			$rootScope.$broadcast("userMessage",message);
		}
	}
}])