'use strict';
app.controller('MenuCtrl',['$scope','$log','$location','StorageService','GroupService','$rootScope','$cookies','$state','LoginService',function($scope,$log,$location,StorageService,GroupService,$rootScope,$cookies,$state,LoginService){

  //'User' should be there because login was successfull
   $scope.user = StorageService.get('User');
   cacheImage($scope.user.portraitImgUrl);

	 $scope.switchGroup = function(group){
      if(!group){
        $scope.goToGroup();
      }else{
        $scope.goToGroup(group);        
      }
      $scope.toggleMenu();
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

  $scope.logout = function(){
    LoginService.logOut();
  }
}])