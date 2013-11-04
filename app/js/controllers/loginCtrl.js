'use strict';

app.controller('LoginCtrl',function($scope,$log,LoginService,$state,$timeout,$rootScope,$modal,localize){

	$scope.affiliationText = localize.getLocalizedString('_LoginAffiliationSelectName_');
	$scope.affiliationShowing = "listClose";
	$scope.labelShowing = "labelHide";
	$scope.loading = true;
	$scope.loginURL = LoginService.getFeideLoginUrl().data;

	//get url to change password for feide user in agora
	LoginService.getFeideLoginUrl().then(function(url){
		$scope.feideLoginUrl = url;
	});
	
	LoginService.getAffiliations().then(function(affiliations){
		$scope.affiliations = affiliations
	});

	$scope.showAffiliations = function(){
		if($scope.affiliationShowing == "listClose"){
			$scope.affiliationShowing = "listOpen";
		}else{
			$scope.affiliationShowing = "listClose";
		}
		
	}

	$scope.setAffiliation = function(affiliation){
		$scope.affiliation = affiliation;
		$scope.affiliationText = (typeof $scope.affiliation == 'string') ? localize.getLocalizedString('_LoginNoAffiliationName_') : $scope.affiliation.name;
		$scope.affiliationShowing = "listClose";
		$scope.labelShowing = "labelShow";
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

	    var dialogInstance = $modal.open({
	      templateUrl: 'loginDialog.html',
	      controller: DialogInstanceCtrl,
	      resolve: {
	        dialog: function(){
	        	return{
	        		title : localize.getLocalizedString('_loginStuckTitle_'),
	        		msg : localize.getLocalizedString('_loginStuckMsg_')
	        	}
	        } 
	      }
	    });

	    dialogInstance.result.then(function () {
	    	loginTries = 0;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
  	}
  	var loginError = function(){

	    var dialogInstance = $modal.open({
	      templateUrl: 'loginDialog.html',
	      controller: DialogInstanceCtrl,
	      resolve: {
	        dialog: function(){
	        	return{
	        		title : localize.getLocalizedString('_loginFailedTitle_'),
	        		msg : localize.getLocalizedString('_loginFailedMsg_')
	        	}
	        } 
	      }
	    });

	    dialogInstance.result.then(function () {
	    	
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });

  	}

  	var DialogInstanceCtrl = function ($scope, $modalInstance, dialog) {

	  $scope.dialog = dialog;

	  $scope.ok = function () {
	    $modalInstance.close();
	  };

	};

})