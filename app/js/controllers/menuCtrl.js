'use strict';
app.controller('MenuCtrl',['$scope','$log','$location','StorageService','GroupService','$rootScope',function($scope,$log,$location,StorageService,GroupService,$rootScope){

	if($scope.validUser){
     if(!StorageService.get('TopGroup')){
       GroupService.fetchGroups().then(function(rep){
         console.log(rep);
         $scope.groups = GroupService.getGroups();
         $scope.user = StorageService.get(StorageService.get('UserScreenName'));
         cacheImage($scope.user.portraitImgUrl);
         $scope.setCurrent(StorageService.get('TopGroup'));
       },function(err){
         console.log('fail to fetch groups');
       });
     }else{
       GroupService.updateGroups().then(function(rep){
          console.log(rep);
          $scope.groups = GroupService.getGroups();
          $scope.user = StorageService.get(StorageService.get('UserScreenName'));
          $scope.user.portraitImgUrl = StorageService.get('UserPortraitImage');
          console.log($scope.user.portraitImgUrl);
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

   function cacheImage(url){
        var img = new Image();
        img.src = $scope.user.portraitImgUrl;

        img.onload = function () {
          var canvas = document.createElement("canvas");
          canvas.width =this.width;
          canvas.height =this.height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0);

          var dataURL = canvas.toDataURL("image/png");

          StorageService.store('UserPortraitImage',dataURL);

          $scope.user.portraitImgUrl = dataURL;

        }
   }  

}])