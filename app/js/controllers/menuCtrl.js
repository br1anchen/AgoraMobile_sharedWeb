'use strict';
app.controller('MenuCtrl',function($scope,$log,$location,StorageService,GroupService,DocumentService,$rootScope,$cookies,$state,LoginService,$timeout,localize){

  //'User' should be there because login was successfull
  $scope.user = StorageService.get('User');
  if($scope.user.portraitImgUrl.indexOf('http') != -1)
  {//check user protraitimage cached or not
    console.log('cache image');
    cacheImage($scope.user.portraitImgUrl);
  }

  function cacheImage(url){//cache image at localstorage
      var img = new Image();
      img.src = $scope.user.portraitImgUrl;

      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width =this.width;
        canvas.height =this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        $scope.user.portraitImgUrl = dataURL;
        StorageService.store('User',$scope.user);

      }
  }
    
  $scope.switchGroup = function(group){
    $scope.toggleMenu();
    
    $timeout(function(){
      $rootScope.$broadcast("notification",localize.getLocalizedString('_LoadingText_'));
      $scope.goToGroup(group);
    },120);

  }
  $scope.goToPage = function(state){
    $scope.changePage(state);
    $scope.toggleMenu();
  }

  $scope.logout = function(){
    var tempAffiliation = StorageService.get('lastAffiliation');//not clear last login affiliation for user
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

      StorageService.store('lastAffiliation',tempAffiliation);
      $state.transitionTo('login');
    },function(err){
      console.log(err);
      navigator.notification.alert(localize.getLocalizedString('_LogOutErrorTitle_'), function(){
      }, "Agora Mobile", "OK");
    });

  }
})