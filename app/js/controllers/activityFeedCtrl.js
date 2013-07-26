'use strict';

app.controller('ActivityFeedCtrl',['$scope','$log','$timeout','ActivityService','UtilityService','StorageService','$rootScope','AppService','$state',function($scope,$log,$timeout,ActivityService,UtilityService,StorageService,$rootScope,AppService,$state){

	// $state.transitionTo('stage.wiki.page',{nodeId:nId,title:t});
	// $state.transitionTo('stage.messageBoard.messages',{categoryId:thread.categoryId,threadId:thread.threadId});

	function renderActLogs(){
//console.log('render act logs');
		
		var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);
		console.log(connect);

		
		if(connect == 'No network connection'){
			if(StorageService.get("Group" + groupId + "_ActLog0")){
				for(var i= 0;i < 10; i ++){
					$scope.activityHolder.activities.push(StorageService.get("Group" + groupId + "_ActLog" + i ));
				}
			}else{
				console.log("no internetConnection and no stored activities");
			}
		}else{
			ActivityService.getActivities($scope.currentGroup).then(
				function(activities){
					$scope.activityHolder.activities = activities;
				},
				function(error){
					console.log(error);
				}
			);
		}
		
		// $scope.activities = [];
		// for(var i = 0; i <10 ; i++){
		// 	var act = {
		// 	    body : "Stian Borgesen uploaded a new document in group" + $scope.currentGroup.id,
		//         groupId : 250926,
		//         className : "File",
		//         classPK : "File" + i,
		//         timestamp : "09-07-2013",
		//         involved : "Brian Chen",
		//         posterImg : "https://agora.uninett.no/image/user_male_portrait?img_id=254940",
		//         file : "https://agora.uninett.no/c/document_library/get_file?groupId=250926&folderId=0&title=login.sh",
		//         fileName : "login.sh"
		// 	};
		// 	$scope.activities.push(act);
		// }
	}

	if($scope.currentGroup.id != 110 && $state.is('stage.activityFeed')){
		renderActLogs();
	}

	$scope.$on('renderActLogs',function(){
		renderActLogs();
	});

	$scope.$on('scrollableUpdate',function(){
		$scope.loading = true;

		//Real update comes here:
		// ActivityService.updateActivities($scope.currentGroup.id).then(
		// 	function(){

		// 	},
		// 	function(){

		// 	}
		// );

		//Dummy code to make it seam like it'a updating
		$timeout(function(){
			$scope.loading = false;
		},3000);
	});

	var appendcounter = 0;
	$scope.$on('scrollableAppend',function(){

		$timeout(function(){ //Inside $timeout to update childscope

			var act = {
			    body : "Stian Borgesen uploaded a new document(older" + ++appendcounter + ")",
		        groupId : 250926,
		        className : "File",
		        classPK : "File",
		        timestamp : "09-07-2013",
		        involved : "Brian Chen",
		        posterImg : "https://agora.uninett.no/image/user_male_portrait?img_id=254940",
		        file : "https://agora.uninett.no/c/document_library/get_file?groupId=250926&folderId=0&title=login.sh",
		        fileName : "login.sh"
			};
			$scope.activities.push(act);

		});
	});
}])