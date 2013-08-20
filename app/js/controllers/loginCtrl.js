'use strict';

app.controller('LoginCtrl',function($scope,$log,LoginService,$state,$timeout,$rootScope){
	$scope.loading = true;

	$scope.loginMsg = { type: 'success', msg: 'Login ...' };

	//get url to change password for feide user in agora
	$scope.feideLoginUrl = LoginService.getFeideLoginUrl().then(function(rep){
		return rep.data + "&RelayState=%2Fgroup%2Fagora%2Fdokumenter%3Fp_p_id%3Dagoramypassword_WAR_agoramypasswordportlet%26p_p_state%3Dpop_up%26p_p_mode%3Dedit%26p_p_lifecycle0%26controlPanelCategory%253portlet_agoramypassword_WAR_agoramypasswordportlet";
	});
	
	$scope.login = function(){

			$scope.loginMsg = { type: 'success', msg: 'Login ...' };
			$("#loginMessage").css("visibility", "visible");

			LoginService.login($scope.username,$scope.password).then(
				function(rep){
					LoginService.getUserInfo($scope.username,rep.data.companyId).then(function(rep){
						$scope.loginMsg.type = 'success';
						$scope.loginMsg.msg = 'Login success!';
						$("#loginMessage").css("visibility", "visible");
						$state.transitionTo('stage.activityFeed');
					},function(reason){
						console.log("no user info:"+JSON.stringify(reason));

						$scope.loginMsg.type = 'error';
						$scope.loginMsg.msg = 'Login failed! Incorrect user info.';
						$("#loginMessage").css("visibility", "visible");
						$state.transitionTo('login');
					});

				},function(reason){
					console.log("Login failed:"+JSON.stringify(reason));

					$scope.loginMsg.type = 'error';
					$scope.loginMsg.msg = 'Login failed! Incorrect user info.';
					$("#loginMessage").css("visibility", "visible");
					$state.transitionTo('login');
				}
			);

	}

})