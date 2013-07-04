'use strict';
app.controller('MenuCtrl',['$scope','$log','$location','StorageService','GroupService','$rootScope',function($scope,$log,$location,StorageService,GroupService,$rootScope){

	if($scope.validUser){
               GroupService.fetchGroups().then(function(rep){
                       console.log(rep);
                       $scope.groups = GroupService.getGroups();
                       $scope.user = StorageService.get(StorageService.get('UserScreenName'));
                       $scope.setCurrent(StorageService.get('TopGroup'));
               },function(err){
                       console.log('fail to fetch groups');
               });
               if(!StorageService.get('TopGroup')){
                       GroupService.fetchGroups().then(function(rep){
                               console.log(rep);
                               $scope.groups = GroupService.getGroups();
                               $scope.user = StorageService.get(StorageService.get('UserScreenName'));
                               $scope.setCurrent(StorageService.get('TopGroup'));
                       },function(err){
                               console.log('fail to fetch groups');
                       });
               }else{
                       GroupService.updateGroups().then(function(rep){
                console.log(rep);
                               $scope.groups = GroupService.getGroups();
                               $scope.user = StorageService.get(StorageService.get('UserScreenName'));
                               $scope.setCurrent(StorageService.get('TopGroup'));
                       },function(err){
                               console.log('fail to update groups');
                       });
               }
        }else{
                console.log('user has not logined yet');
        }

	 $scope.switchGroup = function(group){
	 	console.log("switch to " + group.name);
	 	$scope.setCurrent(group);
	 	$scope.toggleMenu();
	 	$location.path('/activityFeed');
	 }

}])