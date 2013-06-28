'use strict';

app.controller('LoginCtrl',['$scope','$log','LoginService','$location',function($scope,$log,LoginService,$location){
	$scope.loginValid = false;

	$scope.login = function(){
		LoginService.login($scope.username,$scope.password).then(
			function(rep){
				console.log("Login success!:"+JSON.stringify(rep));
				LoginService.requestStorage('testUser',rep.data.data.companyId);
				$scope.loginValid = true;
			},function(reason){
				console.log("Login failed:"+JSON.stringify(reason));
				$scope.loginValid = false;
			}
		);
	}
}])