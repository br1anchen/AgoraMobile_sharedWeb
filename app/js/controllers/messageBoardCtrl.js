'use strict';

app.controller('MessageBoardCtrl',['$scope','$log','$timeout',function($scope,$log,$timeout){
	$scope.messages = ["Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread"];

	$scope.onUpdate = function(){
		alert("updating");
	}

	var appendCounter = 0;
	$scope.onAppend = function(){
		$timeout(function(){ //Inside $timeout to update childscope
			$scope.messages.push("Older Messages"+ ++appendCounter);
		})
	}
}])