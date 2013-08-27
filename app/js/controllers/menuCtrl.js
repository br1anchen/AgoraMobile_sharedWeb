'use strict';
app.controller('MenuCtrl',function($scope,$log,$location,StorageService,GroupService,DocumentService,$rootScope,$cookies,$state,LoginService){

  //'User' should be there because login was successfull
   $scope.user = StorageService.get('User');
   cacheImage($scope.user.portraitImgUrl);

	 $scope.switchGroup = function(group){
      if(!group){
        $scope.goToGroup(group);
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
   $scope.goTo = function(state){
    $scope.path(state);
    $scope.toggleMenu();
   }

  $scope.logout = function(){
    LoginService.logOut().then(function(rep){
      console.log(rep);
      GroupService.clear();//Clears webstorage and runtime memory;
      StorageService.clear();
      //Delete all saved files
      DocumentService.deleteAllSavedFiles().then(function(rep){
        console.log(rep);
      },function(err){
        console.log(err);
      });

      $state.transitionTo('login');
    },function(err){
      console.log(err);
      navigator.notification.alert("Log Out Error Occured", function(){
      }, "Sorry", "I understand");
    });

  }
})