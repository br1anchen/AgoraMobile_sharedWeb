'use strict';
app.controller('StageCtrl',function($scope,$log,$location,$timeout,$rootScope,$state,GroupService,StorageService,ActivityService,ContentService,$q,StateService){
    
    StateService.stateVariablesOn();

    //state List for customized backbutton function and remove notification
    var stateList = ['stage.messageBoard.threads','stage.messageBoard.messages','stage.documents.folder','stage.documents.file','stage.wiki.page'];

    //Adding stateParameters for given states
    var rootStates = ['stage.documents.root','stage.wiki.contentlist','stage.messageBoard.categories'];
    StateService.addStateVariables("root",true,rootStates);
    //Go back to previous state
    $scope.back = function(){
        StateService.goBack();
    }

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        //notification for waiting for loading group content at before state
        var ifState = jQuery.grep(stateList,function(s,k){
            return (s == toState.name);
        });

        if(ifState.length != 0){
            $rootScope.$broadcast("removeNotification","Loading...");
        }
    })

    //Modify Andorid back button function
    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {

        var ifState = jQuery.grep(stateList,function(s,k){
            return (s == $state.current.name);
        });

        if(ifState.length != 0){
            $timeout(function(){
                $scope.back();
            });
        }
    }

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
    //Function to change page view
	$scope.changePage = function(page) {
        console.log(page);
        $state.transitionTo(page);
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
            deffer.reject();
        }
        else{
            $scope.currentGroup = group;
           
            ContentService.loadGroupContent(group).then(function(){
                deffer.resolve();
            });
        }
        
        return deffer.promise;
    }
    $scope.openGroup = function(group){
        var deffer = $q.defer();

        $scope.changeGroup(group).then(function(rep){
            ContentService.getActivitiesPromise()
            .then(
                function(activitiesHolder){
                    $scope.activities = activitiesHolder.activities;
                    $scope.loading = false;
                    if(activitiesHolder.activities.length == 0){
                        $rootScope.$broadcast("notification","No activities");
                    }
                    deffer.resolve();

                    //Making sure activities are updated if array has a promise object(Custom array behaviour defined in ActivityService)
                    if(activitiesHolder.promise){
                        activitiesHolder.promise.then(function(updatedActivitiesHolder){
                            $scope.activities = updatedActivitiesHolder.activities;
                        })
                    }
                },
                function(err){
                    deffer.reject(err);
                    console.error("StageCtrl: Could not get activities");
                    $rootScope.$broadcast("notification","No activities");
                    $scope.loading = false;
                }
            );
        });
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
    $scope.getGroup = function(groupId){
        var topGroup = StorageService.get('TopGroup');
        if(topGroup.id == groupId) return topGroup;

        angular.forEach($scope.groupsHolder.groups,function(group,k){
            if(groupId == group.id) return group;
        })
        return undefined;
    }
})