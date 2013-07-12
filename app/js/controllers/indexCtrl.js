'use strict';
app.controller('IndexCtrl',['$scope','$log','$location','$timeout','$rootScope','$state',function($scope,$log,$location,$timeout,$rootScope,$state){
    $scope.currentGroup =  {
        id : 110,
        name : "Default Group",
        type : 1,
        site : true
    };

    $scope.flashVar ='flash';

	$scope.toggleMenu = function(){
        if(!$scope.menuVar){
            $scope.menuVar = 'menu';
            $scope.flashVar = undefined;
        }else{
            $scope.menuVar = undefined;
        }
	}

	$scope.path = function(path) {
        $state.transitionTo(path); // path not hash
    }

    $scope.setCurrent = function(group){
        $scope.currentGroup = group;
    }

    $scope.goToGroup = function(group){
        console.log($location.path());
    	//Hardcoded nav:
        if($location.path() != '/stage/activityFeed'){
            $state.transitionTo('stage.activityFeed');
        }else{
            $rootScope.$broadcast("renderActLogs");
        }
        
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