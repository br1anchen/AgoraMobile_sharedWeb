'use strict';

app.controller('LoginCtrl',function($scope,$log,LoginService,StorageService,UtilityService,$state,$timeout,$rootScope,$modal,localize,AppService){

	$scope.affiliationText = (!StorageService.get('lastAffiliation')) ? localize.getLocalizedString('_LoginAffiliationSelectName_') : StorageService.get('lastAffiliation').name;
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
	    	if(typeof $scope.affiliation == 'string'){
	    		StorageService.store('lastAffiliation',{name:localize.getLocalizedString('_LoginNoAffiliationName_')});
	    	}else{
	    		StorageService.store('lastAffiliation',selectedItem);
	    	}

	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	}

	$scope.showFeideLoginMsg = function(){

		var feideLoginInstance = $modal.open({
	      templateUrl: 'feideLoginMsg.html',
	      controller: FeideLoginInstanceCtrl,
	      resolve: {
	        feideLoginMsg: function(){
	        	return{
	        		title : localize.getLocalizedString('_FEIDELoginHeader_'),
	        		msg1 : localize.getLocalizedString('_FEIDELoginContentPart1_'),
	        		msg2 : localize.getLocalizedString('_FEIDELoginContentPart2_'),
	        		msg3 : localize.getLocalizedString('_FEIDELoginContentPart3_')
	        	}
	        }
	      }
	    });

	    feideLoginInstance.result.then(function () {
	    	console.log('open feide login window');
	    	var ref = UtilityService.inAppBrowser.browser($scope.feideLoginUrl,'_blank');
            ref.addEventListener('exit', function(){
                console.log('close feide login window');

                cordova.exec(function(rep){
                  console.log(rep);
                }, function(error) {
                  console.log(error);
                }, "cookieManager","deleteCookies",[]);

            });

	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	}

	$scope.login = function(){

		$scope.affiliation = StorageService.get('lastAffiliation');
		var username = (!$scope.affiliation || typeof $scope.affiliation === 'string' || $scope.affiliation.name === 'No Affiliation' ) ? $scope.username : $scope.username + '__' + $scope.affiliation.domain;
		$scope.loginProgress = 30;
		LoginService.login(username,$scope.password).then(
			function(rep){
				$scope.loginProgress = 70;
				LoginService.getUserInfo(username,rep.data.companyId).then(function(rep){
					$scope.loginProgress = 100;
					console.log('Login success!')
					$state.transitionTo('stage.activityFeed');
					navigator.notification.confirm(
						localize.getLocalizedString('_UpgradingText_'),
						function(buttonIndex){
							switch(buttonIndex){
							case 1:
								break;
							case 2:
								UtilityService.inAppBrowser.browser(AppService.getBaseURL(),'_system');
								break;
							}
						},
						'Agora Mobile',
						['OK',localize.getLocalizedString('_GoToWebsite_')]);
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

	var FeideLoginInstanceCtrl = function($scope, $modalInstance, feideLoginMsg){

		$scope.feideLoginMsg = feideLoginMsg;

		$scope.ok = function(){
			$modalInstance.close();
		}
	}

})
