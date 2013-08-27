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
			//TODO
		}

		$scope.manageOfflineFiles = function(){
			$scope.savedFilesHolder = DocumentService.getSavedFiles();
			console.log("saved files:" + JSON.stringify($scope.savedFilesHolder));
		}
	}
)