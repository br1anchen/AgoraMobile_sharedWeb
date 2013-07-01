'use strict';

app.controller('LoginCtrl',['$scope','$log','LoginService','$location',function($scope,$log,LoginService,$location){
	$scope.feideLoginUrl = LoginService.getFeideLoginUrl().then(function(rep){
		return rep.data;
	});


	$scope.login = function(){

		LoginService.login($scope.username,$scope.password).then(
			function(rep){
				console.log("Login success!:"+JSON.stringify(rep));
				LoginService.requestStorage($scope.username,rep.data.companyId);

				$scope.setValidUser(true);
			},function(reason){
				console.log("Login failed:"+JSON.stringify(reason));

				$scope.setValidUser(false);
			}
		);
	}

}])