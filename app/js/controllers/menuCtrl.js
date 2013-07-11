'use strict';
app.controller('MenuCtrl',['$scope','$log','$location','StorageService','GroupService','$rootScope','$cookies',function($scope,$log,$location,StorageService,GroupService,$rootScope,$cookies){

	if($scope.validUser){
     if(!StorageService.get('TopGroup')){
       GroupService.fetchGroups().then(function(rep){
         console.log(rep);
         $scope.groups = GroupService.getGroups();
         $scope.user = StorageService.get(StorageService.get('UserScreenName'));
         cacheImage($scope.user.portraitImgUrl);
         $scope.setCurrent(StorageService.get('TopGroup'));
         $rootScope.$broadcast("renderActLogs");
       },function(err){
         console.log('fail to fetch groups');
       });
     }else{
       GroupService.updateGroups().then(function(rep){
          console.log(rep);
          $scope.groups = GroupService.getGroups();
          $scope.user = StorageService.get(StorageService.get('UserScreenName'));
          $scope.user.portraitImgUrl = StorageService.get('UserPortraitImage');
          $scope.setCurrent(StorageService.get('TopGroup'));
          $rootScope.$broadcast("renderActLogs");
       },function(err){
               console.log('fail to update groups');
       });
     }
  }else{
          console.log('user has not logined yet');
  }

	 $scope.switchGroup = function(group){
      if(group != 'top'){
        console.log("switch to " + group.name);
        $scope.setCurrent(group);
        $scope.goToGroup(group);
        
      }else{
        console.log('back to top group');
        $scope.setCurrent(StorageService.get('TopGroup'));
        $scope.goToGroup(StorageService.get('TopGroup'));
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
      console.log("log out");
      
      StorageService.remove('TopGroup');
      StorageService.remove($scope.user.screenName);
      StorageService.remove('UserPortraitImage');
      StorageService.remove('UserScreenName');
      StorageService.remove('GroupIDs');

      cordova.exec(function(rep){
        console.log(rep);
      }, function(error) {
        console.log(error);
        navigator.notification.alert("Log Out Error Currently", function(){
          $scope.setValidUser(true);
          $location.path('/activityFeed');
        }, "Sorry", "I understand");
      }, "cookieManager","deleteCookies",[]);

      //deleteAllCookies();  delete cookies by javascript which does not work in phonegap
      $scope.setValidUser(false);
      $location.path('/activityFeed');
   }

   function deleteAllCookies() {
      console.log('delete all cookies');
      var cookies = document.cookie.split(";");
      console.log(cookies);
      console.log('cookies: ' + cookies.length);

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }

    function deleteCookie ( name, path, domain ) {
        console.log('delete cookie');
        document.cookie = name + "=" +
        ( ( path ) ? ";path=" + path : "") +
        ( ( domain ) ? ";domain=" + domain : "" ) +
        ";expires="+(new Date()).toGMTString();
    }

}])