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
            $timeout(function(){
                $scope.flashVar ='flash';
            },205)
        }
	}

	$scope.path = function(path) {
        $state.transitionTo(path); // path not hash
    }

    $scope.goToGroup = function(group){
        $scope.currentGroup = group;

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