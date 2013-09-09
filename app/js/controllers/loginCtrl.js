'use strict';

app.controller('LoginCtrl',function($scope,$log,LoginService,$state,$timeout,$rootScope,$dialog,localize){

	var loginFailedMsg = localize.getLocalizedString('_loginFailedMsg_');
	var loginStuckMsg = localize.getLocalizedString('_loginStuckMsg_');

	$scope.affiliationOpen = false;
	$scope.loading = true;
	$scope.loginURL = LoginService.getFeideLoginUrl().data;

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
	    var title = localize.getLocalizedString('_loginStuckTitle_');
	    var msg = loginStuckMsg;
	    var btns = [{result:'ok', label: 'OK', cssClass: 'btn'}];

	    $dialog.messageBox(title, msg, btns)
	      .open()
	      .then(function(result){
	        loginTries = 0;
	    });
  	}
  	var loginError = function(){
	    var title = localize.getLocalizedString('_loginFailedTitle_');
	    var msg = loginFailedMsg;
		var btns = [{result:'ok', label: 'OK', cssClass: 'btn'}];

	    $dialog.messageBox(title, msg, btns)
	      .open()
	      .then(function(result){
	    });

  	}

})