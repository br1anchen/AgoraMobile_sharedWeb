angular.module('app.calculatorService',[]).
factory('CalculatorService',['$log','$q','$timeout',function($log,$q,$timeout){
	var memory = {
		M1:undefined,
		M2:undefined,
		M3:undefined
	};

	return {
		//Tries to calculate the sum of all numbers in an array
		sumArray:function(numbers){
			if(_.isArray(numbers)){
				var sum = 0;
				for(var i = 0 ; i < numbers.length ; i++){
					sum += parseInt(numbers[i]);
				}	
				return sum;
			}else{
				return null;
			}
		},
		pushMemoryM1:function(val){
			memory.M1 = val;
		},
		pushMemoryM2:function(val){
			memory.M2 = val;
		},
		pushMemoryM3:function(val){
			memory.M3 = val;
		},
		getMemory:function(){
			return memory;
		}
	}
}])