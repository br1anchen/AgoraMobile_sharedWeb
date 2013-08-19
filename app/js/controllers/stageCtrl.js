'use strict';
app.controller('StageCtrl',function($scope,$log,$location,$timeout,$rootScope,$state,GroupService,StorageService,ActivityService,ContentService,$q){
    $rootScope.isHistory = false;
    $rootScope.stateHistory = [];

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){

        if(!$rootScope.isHistory && fromState.name != ''){
            $rootScope.stateHistory.push({
                fromState : fromState,
                fromParams : fromParams
            });
        }

    })

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
    $scope.changeGroup = function(group){
        var deffer = $q.defer();

        if(!group) group = StorageService.get('TopGroup');

        if(!group) console.error('StageCtrl.goToGroup() Could not find TopGroup');

        if($scope.currentGroup && group.id == $scope.currentGroup.id ){
            console.log("Already in group:" + group.name);
            deffer.resolve();
        }
        else{
            $scope.currentGroup = group;
            //If not group is present we wait for it to load:
            $scope.gettingGroupsPromise.then(function(){
                deffer.resolve();
            })
        }
        ContentService.loadGroupContent($scope.currentGroup);
        return deffer.promise;
    }
    $scope.openGroup = function(group){
        var deffer = $q.defer();

        $scope.changeGroup();
        ContentService.getActivitiesPromise()
        .then(
            function(activitiesHolder){
                $scope.activitiesHolder = activitiesHolder;
                $scope.loading = false;
                if(activitiesHolder.activities.length == 0){
                    $rootScope.$broadcast("notification","No activities");
                }
                deffer.resolve();
            },
            function(err){
                deffer.reject(err);
                console.error("ActivityCtrl:Group not available");
                $rootScope.$broadcast("notification","No groups");
                $scope.loading = false;
            }
        )
        return deffer.promise;
    }

    //Function to change the active group in the application
    $scope.goToGroup = function(group){
        $scope.openGroup(group).then(
            function(){
                $state.transitionTo('stage.activityFeed',{groupId:$scope.currentGroup.id});
            }
        )
    }
    //If some conent controllers need to change this behaviour, overwriting the scope variable showContentHeader should work. 
    //The event listeners should also work, because the scrolling directive broadcast on the root scope.
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        $scope.showConentHeader = true;
    })
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
        if(!$scope.currentGroup)return;

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
            $state.transitionTo('stage.activityFeed',{groupId:$scope.currentGroup.id});
        }
    }

    //Fetches groups when this controller is loaded, and navigates to activities when groups are present
    $scope.loading = true;
    $scope.gettingGroupsPromise = GroupService.getGroups().then(function(groupsHolder){
        $scope.loading = false;
        $scope.groupsHolder = groupsHolder;
        $scope.goToGroup();
    })
})