'use strict';

app.controller('ActivityFeedCtrl',['$scope','$log','$timeout',function($scope,$log,$timeout){
	$scope.activities = ["Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed","Activity feed"];

	$scope.onUpdate = function(){
		alert("updating");
	}

	var appendcounter = 0;
	$scope.onAppend = function(){

		$timeout(function(){ //Inside $timeout to update childscope
			$scope.activities.push("Appended activity feed number "+ ++appendcounter);
		})
	}
}])