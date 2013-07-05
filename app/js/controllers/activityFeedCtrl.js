'use strict';

app.controller('ActivityFeedCtrl',['$scope','$log','$timeout',function($scope,$log,$timeout){
	$scope.activities = ["Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed"];

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