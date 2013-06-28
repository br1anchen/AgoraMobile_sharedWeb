'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', ['ui.bootstrap','app.utilityService','app.storageService','app.loginService','app.activityService','app.httpService','link','infinite-scroll'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
	$routeProvider.when('/messageBoard', {templateUrl: 'partials/messageBoard.html', controller: 'MessageBoardCtrl'});
	$routeProvider.when('/documents', {templateUrl: 'partials/documents.html', controller: 'DocumentsCtrl'});
	$routeProvider.when('/wiki', {templateUrl: 'partials/wiki.html', controller: 'WikiCtrl'});
	$routeProvider.when('/activityFeed', {templateUrl: 'partials/activityFeed.html', controller: 'ActivityFeedCtrl'});
	$routeProvider.otherwise({redirectTo: '/activityFeed'});
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
