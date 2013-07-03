'use strict';

app.controller('LoginCtrl',['$scope','$log','LoginService','$location',function($scope,$log,LoginService,$location){
	$scope.feideLoginUrl = LoginService.getFeideLoginUrl().then(function(rep){
		return rep.data + "&RelayState=%2Fgroup%2Fagora%2Fdokumenter%3Fp_p_id%3Dagoramypassword_WAR_agoramypasswordportlet%26p_p_state%3Dpop_up%26p_p_mode%3Dedit%26p_p_lifecycle0%26controlPanelCategory%253portlet_agoramypassword_WAR_agoramypasswordportlet";
	});


	$scope.login = function(){

		LoginService.login($scope.username,$scope.password).then(
			function(rep){
				console.log("Login success!:"+JSON.stringify(rep));
				LoginService.getUserInfo($scope.username,rep.data.companyId).then(function(rep){
					LoginService.requestStorage();
					$scope.setValidUser(true);
				});

			},function(reason){
				console.log("Login failed:"+JSON.stringify(reason));

				$scope.setValidUser(false);
			}
		);
	}

}])