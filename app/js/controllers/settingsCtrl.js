'use strict';

app.controller('SettingsCtrl',

	function($scope,AppService,DocumentService){
		$scope.settings = AppService.getSettings();

		$scope.toggleGUI = function(variable){
			$scope[variable] = $scope[variable] ? false : true;
		}
		$scope.toggleSetting = function(setting){
			$scope.settings[setting] = $scope.settings[setting] ? false : true;
		}

		$scope.clearAllFiles = function(){
			DocumentService.deleteAllSavedFiles().then(function(rep){
				console.log(rep);
				navigator.notification.alert(
	                rep,
	                function(){
	                	
	                },
	                'Agora Mobile',
	                'OK'
	            );
			},function(err){
				console.log(err);
				navigator.notification.alert(
	                'Clear All Files Failed',
	                function(){
	                	
	                },
	                'Agora Mobile',
	                'OK'
	            );
			});
		}

		$scope.manageOfflineFiles = function(){
			$scope.savedFilesHolder = DocumentService.getSavedFiles();
			console.log("saved files:" + JSON.stringify($scope.savedFilesHolder));
		}
	}
)