'use strict';
app.controller('LoginCtrl',['$scope','$log','LoginService','$location',function($scope,$log,LoginService,$location){
	
	$scope.login = function(){
		LoginService.login($scope.username,$scope.password).then(
			function(data){
				alert("Login success!:"+JSON.stringify(data));
			},function(reason){
				alert("Login failed:"+JSON.stringify(reason));
			}
		);
	}
}])