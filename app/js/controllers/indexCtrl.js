'use strict';
app.controller('IndexCtrl',['$scope','$log','$location','$timeout','$rootScope','$state',function($scope,$log,$location,$timeout,$rootScope,$state){

    $scope.$on("notify",function(notification){
        alert("event in indexCtrl");
    })

    $scope.notify = function(msg){
        $rootScope.$broadcast("notify");
        $rootScope.notify = msg;
    }

    $scope.currentGroup =  {
        id : 110,
        name : "Default Group",
        type : 1,
        site : true
    };

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

    $scope.goToGroup = function(group){
        $scope.currentGroup = group;

        if($location.path() != '/stage/activityFeed'){
            $state.transitionTo('stage.activityFeed');
        }else{
            $rootScope.$broadcast("renderActLogs");
        }
        
    }
    //If some conent controllers need to change this behaviour, overwriting the scope variable showContentHeader should work. 
    //The event listeners should also work, because the scrolling directive broadcast on the root scope.
    $scope.showConentHeader = true;

    $scope.$on("scrollingUp",function(){
        $timeout(function(){
            $scope.showConentHeader = true;
        })
    })

    $scope.$on("scrollingDown",function(){
        $timeout(function(){
            $scope.showConentHeader = false;
        })
    })
}])