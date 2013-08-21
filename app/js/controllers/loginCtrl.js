'use strict';

app.controller('LoginCtrl',function($scope,$log,LoginService,$state,$timeout,$rootScope,$dialog){

	var loginFailedMsg = 'Username and password required. Remember to select your affiliation';
	var loginStuckMsg = "If you forgot you Agora password, you can reset it by logging in trough Feide below. If you don't have an Agora user, you can create one by signing in trough Feide";

	$scope.affiliationOpen = false;
	$scope.loading = true;
	$scope.loginURL = LoginService.getFeideLoginUrl().data;

	$scope.loginMsg = { type: 'success', msg: 'Login ...' };

	//get url to change password for feide user in agora
	LoginService.getFeideLoginUrl().then(function(url){
		$scope.feideLoginUrl = url;
	});
	
	LoginService.getAffiliations().then(function(affiliations){
		$scope.affiliations = affiliations
	});

	$scope.setAffiliation = function(affiliation){
		$scope.affiliation = affiliation;
		$scope.affiliationName = (typeof $scope.affiliation == 'string') ? undefined : $scope.affiliation.name;
		$scope.affiliationOpen = false;
	}

	$scope.login = function(){

			$scope.loginMsg = { type: 'success', msg: 'Login ...' };
			$("#loginMessage").css("visibility", "visible");


			var username = (!$scope.affiliation || typeof $scope.affiliation == 'string' ) ? $scope.username : $scope.username + '__' + $scope.affiliation.domain;

			LoginService.login(username,$scope.password).then(
				function(rep){
					LoginService.getUserInfo(username,rep.data.companyId).then(function(rep){
						console.log('Login success!')
						$state.transitionTo('stage.activityFeed');
					},function(reason){
						console.error("Login failed:"+JSON.stringify(reason));
						$state.transitionTo('login');
						if(++loginTries >3){
							loginStuck();
						}else{
							loginError();
						}
					});

				},function(reason){
					console.log("Login failed:"+JSON.stringify(reason));
					if(++loginTries >3){
						loginStuck();
					}else{
						loginError();
					}
					$state.transitionTo('login');
				}
			);
	}
	var loginTries = 0;
	var loginStuck = function(){
	    var title = 'Login problems?';
	    var msg = loginStuckMsg;
	    var btns = [{result:'ok', label: 'OK', cssClass: 'btn'}];

	    $dialog.messageBox(title, msg, btns)
	      .open()
	      .then(function(result){
	        loginTries = 0;
	    });
  	}
  	var loginError = function(){
	    var title = 'Login failed';
	    var msg = loginFailedMsg;
		var btns = [{result:'ok', label: 'OK', cssClass: 'btn'}];

	    $dialog.messageBox(title, msg, btns)
	      .open()
	      .then(function(result){
	    });

  	}

})