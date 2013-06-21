'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', ['ui.bootstrap','app.utilityService','app.agoraService','app.storageService'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
	$routeProvider.otherwise({redirectTo: '/login'});
}])

.run(function($log,$rootScope,$location){
	$log.log('App initiated')
	// Configuring routs allowed based on app state
	$rootScope.$watch(function() {return $location.path();}, function(newValue, oldValue){
		//Here you can check if the navigation is allowed based on whatever
	    if(false){
	        $location.path('/testPartial');
	    }
	})
});
