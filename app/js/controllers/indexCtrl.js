'use strict';
app.controller('IndexCtrl',['$scope','$log','$location','$timeout',function($scope,$log,$location,$timeout){
    $scope.currentGroup = 'Default Group';

	$scope.toggleMenu = function(){
        if(!$scope.menuVar){
            $scope.menuVar = 'menu';
            $scope.flashVar = undefined;
        }else{
            $scope.menuVar = undefined;
        }
	}

	$scope.path = function(path) {
        $location.path(path); // path not hash
    }

    $scope.setCurrent = function(group){
        $scope.currentGroup = group;
    }

    $scope.goToGroup = function(group){
    	//Hardcoded nav:
    	$location.path('/activityFeed');
    }
    $scope.showGroup = true;
    
    $scope.$on("scrollableUpdate",function(){
        $scope.loading = true;
    })
    
    $scope.$on("scrollableUpdated",function(){
        $scope.loading = false;
    })

    $scope.$on("scrollingUp",function(){
        $timeout(function(){
            $scope.flashVar ='flash';
        })
    })

    $scope.$on("scrollingDown",function(){
        $timeout(function(){
            $scope.flashVar = undefined;
        })
    })
}])