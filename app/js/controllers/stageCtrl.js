'use strict';
app.controller('StageCtrl',function($scope,$log,$location,$timeout,$rootScope,$state,GroupService,StorageService,ActivityService,ContentService,$q,StateService,localize){
    
    StateService.stateVariablesOn();

    $scope.showConentHeader = true;

    //Fetches groups when this controller is loaded, and navigates to activities when groups are present
    $scope.loading = true;
    $scope.gettingGroupsPromise = GroupService.getGroups().then(function(groupsHolder){
        $scope.loading = false;
        $scope.groupsHolder = groupsHolder;
        $scope.goToGroup();
    })

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
            $rootScope.$broadcast("removeNotification",localize.getLocalizedString('_LoadingText_'));
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
        if(data.id == "application" && $scope.menuVar == 'menu'){
            $scope.toggleMenu();
        }else if(data.id == "application" && !$scope.menuVar){
            $scope.toggleSearch();
        }
    });

    $scope.$on("swiperight",function(e,data){
        if(data.id == "application" && !$scope.menuVar){
            $scope.toggleMenu();
        }
    });

	$scope.toggleMenu = function(){
        if(!$scope.menuVar){
            $scope.menuVar = 'menu';
        }else{
            $scope.menuVar = undefined;
        }
	}

    $scope.toggleSearch = function(){
        if(!$scope.menuVar){
            $scope.menuVar = 'search';
        }else{
            $scope.menuVar = undefined;
        }
    }

    //If some conent controllers need to change this behaviour, overwriting the scope variable showContentHeader should work. 
    //The event listeners should also work, because the scrolling directive broadcast on the root scope.
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        $scope.showConentHeader = true;
    })

    $scope.$on("scrollingUp",function(){
        $timeout(function(){
            $scope.showConentHeader = true;
        })
    })

    $scope.$on("scrollingDown",function(){
        $timeout(function(){
            //$scope.showConentHeader = false;
        })
    })

    //Function to change page view
	$scope.changePage = function(page) {
        console.log(page);
        $state.transitionTo(page);
    }
    //Function to check if state equals give state
    $scope.stateIs = function(state){
        return $state.is(state);
    }

    //Function to change the active group in the application
    $scope.goToGroup = function(group){
        
        $scope.showGroup(group).then(
            function(){
                $state.transitionTo('stage.activityFeed',{groupId:$scope.currentGroup.id});
            }
        ,function(err){
            if(err == 'same group'){
                $rootScope.$broadcast("removeNotification",localize.getLocalizedString('_LoadingText_'));
                $state.transitionTo('stage.activityFeed',{groupId:$scope.currentGroup.id});
            }else{
                $rootScope.$broadcast("removeNotification",localize.getLocalizedString('_LoadingText_'));
                $rootScope.$broadcast("notification",localize.getLocalizedString('_LoadingErrorText_'));
            }
        })
    }

    //function to call load group function after promise resolved then get activities
    $scope.showGroup = function(group){
        var deffer = $q.defer();

        $scope.loadGroup(group).then(function(rep){
            ContentService.getActivitiesPromise()
            .then(
                function(activitiesHolder){
                    $scope.activities = activitiesHolder.activities;
                    $scope.loading = false;
                    if(activitiesHolder.activities.length == 0){
                        $rootScope.$broadcast("notification","No activities");
                    }
                    $rootScope.$broadcast("removeNotification",localize.getLocalizedString('_LoadingText_'));
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
                    $rootScope.$broadcast("notification",localize.getLocalizedString('_NoActsText_'));
                    $scope.loading = false;
                }
            );
        },function(err){
            $rootScope.$broadcast("removeNotification",localize.getLocalizedString('_LoadingText_'));
            deffer.reject(err);
        });
        return deffer.promise;
    }

    //function to load group content then return a promise obj
    $scope.loadGroup = function(group){
        var deffer = $q.defer();

        if(!group) group = StorageService.get('TopGroup');

        if(!group) console.error('StageCtrl.goToGroup() Could not find TopGroup');

        if($scope.currentGroup && group.id == $scope.currentGroup.id ){
            console.log("Already in group:" + group.name);
            deffer.reject('same group');
        }
        else{
            $scope.currentGroup = group;
           
            ContentService.loadGroupContent(group).then(function(){
                deffer.resolve();
            });
        }
        
        return deffer.promise;
    }
    
    $scope.goToActivityFeed = function(){
        if(!$scope.currentGroup)return;

        var activityFeedState = 'stage.activityFeed';

        if($state.is(activityFeedState)){
            $rootScope.$broadcast("notification",
                localize.getLocalizedString('_AlreadyShowingText_')
            );
            $rootScope.$broadcast("notification",
                localize.getLocalizedString('_ChangeGroupInfoText_')
            );
        }
        else{
            $state.transitionTo('stage.activityFeed',{groupId:$scope.currentGroup.id});
        }
    }

    $scope.getGroup = function(groupId){
        var topGroup = StorageService.get('TopGroup');
        if(topGroup.id == groupId) return topGroup;

        angular.forEach($scope.groupsHolder.groups,function(group,k){
            if(groupId == group.id) return group;
        })
        return undefined;
    }
})