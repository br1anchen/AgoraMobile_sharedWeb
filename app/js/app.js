'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', ['app.calculatorService','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/testPartial', {templateUrl: 'partials/testPartial.html', controller: 'TestCtrl'});
	$routeProvider.when('/frontPage', {templateUrl: 'partials/frontPage.html', controller: 'FrontPageCtrl'});
	$routeProvider.otherwise({redirectTo: '/frontPage'});
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
