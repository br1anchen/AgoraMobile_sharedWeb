'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', ['ui.bootstrap','app.utilityService','app.storageService','app.loginService','app.groupService','app.activityService','app.httpService','app.messageBoardService','link','infinite-scroll','ngCookies','ui.state'])

.config(['$stateProvider','$routeProvider', function($stateProvider,$routeProvider) {
	$routeProvider.otherwise('/login');

	$stateProvider
		.state('login', {
			url:'/login',
  			templateUrl: 'login.html',
  			controller: 'LoginCtrl'
		})
		.state('stage',{
			url:'/stage',
			templateUrl: 'stage.html',
			controller: 'IndexCtrl'
		})
		.state('stage.messageBoard',{
			url:'/messageBoard',
			templateUrl: 'partials/messageBoard.html',
			controller: 'MessageBoardCtrl'
		})
		.state('stage.documents',{
			url:'/documents',
			templateUrl: 'partials/documents.html',
			controller: 'DocumentsCtrl'
		})
		.state('stage.wiki',{
			url:'/wiki',
			templateUrl: 'partials/wiki.html',
			controller: 'WikiCtrl'
		})
		.state('stage.activityFeed',{
			url:'/activityFeed',
			templateUrl: 'partials/activityFeed.html',
			controller: 'ActivityFeedCtrl'
		})
}])

.run(function($log,$rootScope,$location){
	$log.log('App initiated');
});
