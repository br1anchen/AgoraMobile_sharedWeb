'use strict';
app.controller('MenuCtrl',function($scope,$log,$location,StorageService,GroupService,DocumentService,$rootScope,$cookies,$state,LoginService,$timeout,localize){

  //'User' should be there because login was successfull
  $scope.user = StorageService.get('User');
  if($scope.user.portraitImgUrl.indexOf('http') != -1)
  {//check user protraitimage cached or not
    console.log('cache image');
    cacheImage($scope.user.portraitImgUrl);
  }

  $rootScope.$on("event:auth-loginRequired",function(e){
    console.log("login required!");
    navigator.notification.alert(localize.getLocalizedString('_RequireLoginTitle_'), function(){
      logoutProcess();
    }, "Agora Mobile", "OK");
  })

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

  $('#menu .groups').hammer().on("swipeup", function(event){
    console.log("group scroll touch");
    if(!$scope.hideSomeBtn && $scope.showAllBtn){
      $scope.showAllGroups();
    }
  });

  $scope.switchGroup = function(group){
    $scope.toggleMenu();

    $timeout(function(){
      $rootScope.$broadcast("notification",localize.getLocalizedString('_LoadingText_'));
      $scope.goToGroup(group);
    },120);
  }

  $scope.showAllGroups = function(){
    if(!$scope.hideSomeBtn && $scope.showAllBtn){
      $scope.displayGroups = $scope.groupsHolder.groups;
      $scope.showAllBtn = false;
      $scope.hideSomeBtn = true;
    }
  }

  $scope.hideSomeGroups = function(){
    var ui_list_height = $(window).height() - 70 - 35;//screen size minus two menu header height
    //console.log("list height:" + ui_list_height);
    var li_number = parseInt(Number(ui_list_height)/40);
    //console.log("list element number:" + li_number);
    $scope.displayGroups = $scope.groupsHolder.groups.slice(0,li_number - 1);
    $scope.showAllBtn = $scope.groupsHolder.groups.length > li_number? true : false;
    $scope.hideSomeBtn = false;
  }

  $scope.goToPage = function(state){
    $scope.changePage(state);
    $scope.toggleMenu();
  }

  $scope.logout = function(){

    navigator.notification.confirm(
      localize.getLocalizedString('_logoutMessageText_'),
      onConfirm,
      'Agora Mobile',
      [localize.getLocalizedString('_logoutConfirmYesBtnText_'),localize.getLocalizedString('_logoutConfirmCancelBtnText_')]);

  }

  function onConfirm(buttonIndex){
    if(buttonIndex == 1){
      logoutProcess();
    }
  }

  function logoutProcess(){
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
