'use strict';
app.controller('FrontPageCtrl',['$scope','$log','CalculatorService',function($scope,$log,CalculatorService){
	$scope.welcomeMsg = "Welcome to the front page";
	$scope.numbers = "23,567,234,5,234";
	$scope.calculatorMemory = CalculatorService.getMemory();;

	$scope.sumClicked = function(){
		$scope.memory = CalculatorService.sumArray($scope.numbers.split(","));
	}

	$scope.storeNumber = function(){
		CalculatorService.pushMemoryM1($scope.memory);
	}
}])