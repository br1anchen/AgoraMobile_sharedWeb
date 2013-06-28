'use strict';
app.controller('IndexCtrl',['$scope','$log','$location',function($scope,$log,$location){
	$scope.toggleMenu = function(){
		$scope.menuVar = $scope.menuVar == undefined ? 'menu' : undefined;
	}

	$scope.path = function(path) {
        $location.path(path); // path not hash
    }

    $scope.groups = {
    	current:"Hardcoded activeGroup",
    	list:[]
    };
    $scope.goToGroup = function(group){
    	//Hardcoded nav:
    	$location.path('/activityFeed');
    }
    $scope.showGroup = true;

    $scope.$on('updateScrollable', function() {

    })
}])