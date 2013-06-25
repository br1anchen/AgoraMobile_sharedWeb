'use strict';
app.controller('IndexCtrl',['$scope','$log',function($scope,$log){
	// var menu = $.jPanelMenu();
	// menu.on();
	$scope.toggleMenu = function(){
		$scope.menuVar = $scope.menuVar == undefined ? 'menu' : undefined;
	}
}])