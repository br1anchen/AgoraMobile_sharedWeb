'use strict';
app.controller('StageCtrl',['$scope','$log','$location','$timeout','$rootScope','$state',function($scope,$log,$location,$timeout,$rootScope,$state){
    $scope.currentGroup =  {
        id : 110,
        name : "Default Group",
        type : 1,
        site : true,
        friendlyURL : ''
    };
    $scope.$on("swipeleft",function(e,data){
        if(data.id == "application" && $scope.menuVar){
            $scope.toggleMenu();
        }
    })

	$scope.toggleMenu = function(){
        if(!$scope.menuVar){
            $scope.menuVar = 'menu';
            $scope.flashVar = undefined;
        }else{
            $scope.menuVar = undefined;
        }
	}

	$scope.path = function(path) {
        console.log(path);
        $state.transitionTo(path); // path not hash
    }
    $scope.stateIs = function(state){
        return $state.is(state);
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