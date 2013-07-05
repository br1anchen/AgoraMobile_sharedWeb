'use strict';

app.controller('MessageBoardCtrl',['$scope','$log','$timeout','$q',function($scope,$log,$timeout,$q){
	console.log('MessageBoardCtrl');
	$scope.messages = ["Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread","Message board thread"];

	$scope.$on('scrollableUpdate',function(){
		
		//Dummy code to make it seam like it'a updating
		$timeout(function(){
			$scope.$emit("scrollableUpdated");
		},3000);
	})

	var appendcounter = 0;
	$scope.$on('scrollableAppend',function(){

		$timeout(function(){ //Inside $timeout to update childscope
			$scope.messages.push("Appended message number "+ ++appendcounter);
		})
	})
}])