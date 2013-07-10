'use strict';

app.controller('ActivityFeedCtrl',['$scope','$log','$timeout','ActivityService','UtilityService','StorageService',function($scope,$log,$timeout,ActivityService,UtilityService,StorageService){
	$scope.activities = [];

	var groupId = $scope.currentGroup.id;
	console.log('groupID:' + groupId);

	
	//var connect = UtilityService.internetConnection.checkConnection(navigator.connection.type);
	//console.log(connect);

	/*
	if(connect == 'No network connection'){
		if(StorageService.get("Group" + groupId + "_ActLog0")){
			for(var i= 0;i < 10: i ++){
				$scope.activities.push(StorageService.get("Group" + groupId + "_ActLog" + i ));
			}
		}else{
			console.log("no internetConnection and no stored activities");
		}
	}else{
		ActivityService.fetchActivityLogs(groupId).then(function(rep){
			$scope.activities = ActivityService.getActivityLogs();
		},function(error){
			console.log(error);
		});
	}
	*/

	for(var i = 0; i <10 ; i++){
		var act = {
		    body : "Stian Borgesen uploaded a new document",
	        groupId : 250926,
	        className : "File",
	        classPK : "File" + i,
	        timestamp : "09-07-2013",
	        involved : "Brian Chen",
	        posterImg : "https://agora.uninett.no/image/user_male_portrait?img_id=254940",
	        file : "https://agora.uninett.no/c/document_library/get_file?groupId=250926&folderId=0&title=login.sh",
	        fileName : "login.sh"
		};
		$scope.activities.push(act);
	}

	$scope.$on('scrollableUpdate',function(){
		
		//Dummy code to make it seam like it'a updating
		$timeout(function(){
			$scope.$emit("scrollableUpdated");
		},3000);
	})

	var appendcounter = 0;
	$scope.$on('scrollableAppend',function(){

		$timeout(function(){ //Inside $timeout to update childscope
			$scope.activities.push("Appended activity feed number "+ ++appendcounter);
		})
	})
}])