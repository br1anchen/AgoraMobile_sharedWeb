'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', ['ui.bootstrap','app.utilityService','app.storageService','app.loginService','app.groupService','app.activityService','app.httpService','app.messageBoardService','app.appService','app.wikiPageService','app.documentService','infinite-scroll','ngCookies','ui.state','app.filters.timeago','app.filters.camelcase'])

.config(['$stateProvider','$routeProvider','$httpProvider', function($stateProvider,$routeProvider,$httpProvider) {
	$routeProvider.otherwise('/login');
	// $httpProvider.defaults.useXDomain = true;
	// delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$stateProvider
		.state('login', {
			url:'/login',
  			templateUrl: 'login.html',
  			controller: 'LoginCtrl'
		})
		.state('stage',{
			url:'/stage',
			templateUrl: 'stage.html',
			controller: 'StageCtrl'
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
			abstract: true,
			url:'/documents',
			templateUrl: 'partials/documents.html',
		})
		.state('stage.documents.root',{
			url:'',
			templateUrl: 'partials/DCFolder.html',
			controller: 'DocumentsCtrl'
		})
		.state('stage.documents.folder',{
			url:'/folder/{folderId}',
			templateUrl: 'partials/DCFolder.html',
			controller: 'DocumentsCtrl'
		})
		.state('stage.documents.file',{
			url:'/folder/{folderId}/file/{fileTitle}',
			templateUrl: 'partials/DCFileDetail.html',
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
