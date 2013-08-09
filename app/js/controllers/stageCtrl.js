'use strict';
app.controller('StageCtrl',function($scope,$log,$location,$timeout,$rootScope,$state,GroupService,StorageService){
    
    //Hide menu on swype gesture
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
    //Function to change app path
	$scope.path = function(path) {
        console.log(path);
        $state.transitionTo(path); // path not hash
    }
    //Function to check if state equals give state
    $scope.stateIs = function(state){
        return $state.is(state);
    }

    //Function to change the active group in the application
    $scope.goToGroup = function(group){
        if(!group) group = StorageService.get('TopGroup');

        if(!group) console.error('StageCtrl.goToGroup() Could not find TopGroup');

        $scope.currentGroup = group;

       $scope.goToActivityFeed();
        
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
    $scope.goToActivityFeed = function(){
        var activityFeedState = 'stage.activityFeed';
        if($state.is(activityFeedState)){
            $rootScope.$broadcast("notification",
                "Already showing activityFeed"
            );
            $rootScope.$broadcast("notification",
                "Click on <i class='icon-align-justify'></i> to change group"
            );
        }
        else{
            $state.transitionTo(activityFeedState);
        }
    }

    //Fetches groups when this controller is loaded, and navigates to activities when groups are present
    $scope.loadingGroups = true;
    $scope.gettingGroupsPromise = GroupService.getGroups().then(function(groupsHolder){
        $scope.loadingGroups = false;
        $scope.groupsHolder = groupsHolder;
        $scope.goToGroup();
    })
})