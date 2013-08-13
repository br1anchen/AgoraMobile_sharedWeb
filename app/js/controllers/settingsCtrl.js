'use strict';

app.controller('SettingsCtrl',

	function($scope,AppService){
		$scope.settings = AppService.getSettings();

		$scope.toggle = function(variable){
			$scope[variable] = $scope[variable] ? false : true;
		}
	}
)