'use strict';
app.controller('TestCtrl',['$scope','$log','CalculatorService',function($scope,$log,CalculatorService){
	$scope.header = "Test partial header";
	$scope.buttons = ['Stian','Brian','Armaz','Bernt']
	$scope.calculatorMemory = CalculatorService.getMemory();
	$scope.url = "https://agora.uninett.no";
	$scope.lable = "Login";
}])