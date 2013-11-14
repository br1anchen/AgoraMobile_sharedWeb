'use strict';

app.controller('LoginCtrl',function($scope,$log,LoginService,$state,$timeout,$rootScope,$modal,localize){

	$scope.affiliationText = localize.getLocalizedString('_LoginAffiliationSelectName_');
	$scope.loading = true;
	$scope.loginURL = LoginService.getFeideLoginUrl().data;
	$scope.loginProgress = 0;

	//get url to change password for feide user in agora
	LoginService.getFeideLoginUrl().then(function(url){
		$scope.feideLoginUrl = url;
	});
	
	LoginService.getAffiliations().then(function(affiliations){
		$scope.affiliations = affiliations
	});

	$scope.showAffiliations = function(){

		var selectInstance = $modal.open({
	      templateUrl: 'selectDialog.html',
	      controller: SelectInstanceCtrl,
	      resolve: {
	        options: function(){
	        	return $scope.affiliations;
	        } 
	      }
	    });

	    selectInstance.result.then(function (selectedItem) {
	    	$scope.affiliation = selectedItem;
	    	$scope.affiliationText = (typeof $scope.affiliation == 'string') ? localize.getLocalizedString('_LoginNoAffiliationName_') : $scope.affiliation.name;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	}

	$scope.login = function(){

		var username = (!$scope.affiliation || typeof $scope.affiliation == 'string' ) ? $scope.username : $scope.username + '__' + $scope.affiliation.domain;
		$scope.loginProgress = 30;
		LoginService.login(username,$scope.password).then(
			function(rep){
				$scope.loginProgress = 70;
				LoginService.getUserInfo(username,rep.data.companyId).then(function(rep){
					$scope.loginProgress = 100;
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
					$scope.loginProgress = 0;
				});

			},function(reason){
				console.log("Login failed:"+JSON.stringify(reason));
				if(++loginTries >3){
					loginStuck();
				}else{
					loginError();
				}
				$state.transitionTo('login');
				$scope.loginProgress = 0;
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

	var SelectInstanceCtrl = function ($scope, $modalInstance, options) {

		$scope.options = options;

		$scope.select = function (option) {
			$modalInstance.close(option);
		}
	}

})