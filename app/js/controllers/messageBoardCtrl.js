'use strict';

app.controller('MessageBoardCtrl',['$scope','$log','$timeout','$q',function($scope,$log,$timeout,$q){
	$scope.messages = ["Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread"];

	$scope.onUpdate = function(){
		$timeout(function(){
			$scope.$emit("scrollableUpdated");
		},3000);
	}

	var appendCounter = 0;
	$scope.onAppend = function(){
		$timeout(function(){ //Inside $timeout to update childscope
			$scope.messages.push("Older Messages"+ ++appendCounter);
		})
	}
}])