'use strict';

app.controller('SettingsCtrl',
	function($scope){
		$scope.$watch('lowBandwidth',function(newVal,oldVal){
			//TODO
		})
	}
	$scope.toggle(variable){
		$scope[variable] = $scope[variable] ? false : true;
	}
)