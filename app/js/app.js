'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', ['ui.bootstrap','app.utilityService','app.storageService','app.loginService','app.groupService','app.activityService','app.httpService','app.messageBoardService','app.appService','app.wikiPageService','infinite-scroll','ngCookies','ui.state'])

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
			abstract: true,
			url:'/messageBoard',
			templateUrl: 'partials/messageBoard.html'
		})
		.state('stage.messageBoard.categories',{
			url:'',
			templateUrl: 'partials/MBCategories.html',
			controller: 'MessageBoardCtrl'
		})
		.state('stage.messageBoard.threads',{
			url:'/categories/{categoryId}',
			templateUrl: 'partials/MBThreads.html',
			controller: 'MessageBoardCtrl'
		})
		.state('stage.messageBoard.messages',{
			url:'/categories/{categoryId}/threads/{threadId}',
			templateUrl: 'partials/MBMessages.html',
			controller: 'MessageBoardCtrl'
		})
		.state('stage.documents',{
			url:'/documents',
			templateUrl: 'partials/documents.html',
			controller: 'DocumentsCtrl'
		})
		.state('stage.wiki',{
			abstract: true,
			url:'/wiki',
			templateUrl: 'partials/wiki.html'
		})
		.state('stage.wiki.contentlist',{
			url:'/contentlist',
			templateUrl: 'partials/WKContentList.html',
			controller: 'WikiCtrl'
		})
		.state('stage.wiki.page',{
			url:'node/{nodeId}/page/{title}',
			templateUrl: 'partials/WKPage.html',
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
