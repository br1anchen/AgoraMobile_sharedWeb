'use strict';
app.controller('LoginCtrl',['$scope','$log','AgoraService','$location',function($scope,$log,AgoraService,$location){
	$scope.login = function(){
		AgoraService.login($scope.username,$scope.password).then(
			function(data){
				alert("Login success!:"+JSON.stringify(data));
			},function(reason){
				alert("Login failed:"+JSON.stringify(reason))
			}
		);
	}
}])