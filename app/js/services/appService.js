angular.module('app.appService',[]).
factory('AppService',function($log,$rootScope){
		// var baseURL = 'https://agora-test.uninett.no';
		var baseURL = 'https://agora.uninett.no';
		
	return {
		getBaseURL : function(){
			return baseURL;
		},
		userMessage : function(message){
			$rootScope.$broadcast("userMessage",message);
		}
	}
})