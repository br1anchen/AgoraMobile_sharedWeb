angular.module('app.appService',[]).
factory('AppService',['$log','$rootScope',function($log,$rootScope){
		var baseURL = 'http://agora-test.uninett.no';

	return {
		getBaseURL : function(){
			return baseURL;
		},
		userMessage : function(message){
			$rootScope.$broadcast("userMessage",message);
		}
	}
}])