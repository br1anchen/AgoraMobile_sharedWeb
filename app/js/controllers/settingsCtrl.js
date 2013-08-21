'use strict';

app.controller('SettingsCtrl',

	function($scope,AppService){
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
			//TODO
		}
	}
)