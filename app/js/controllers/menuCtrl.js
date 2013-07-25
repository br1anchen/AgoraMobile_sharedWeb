'use strict';
app.controller('MenuCtrl',['$scope','$log','$location','StorageService','GroupService','$rootScope','$cookies','$state',function($scope,$log,$location,StorageService,GroupService,$rootScope,$cookies,$state){

   if(!StorageService.get('TopGroup')){
     GroupService.fetchGroups().then(
      function(rep){
       console.log(rep);
       $scope.groups = GroupService.getGroups();
       $scope.user = StorageService.get('User');
       cacheImage($scope.user.portraitImgUrl);
       $scope.goToGroup(StorageService.get('TopGroup'));
     },function(err){
       console.log('fail to fetch groups');
     });
   }
   else{
     GroupService.updateGroups().then(function(rep){
        console.log(rep);
        $scope.groups = GroupService.getGroups();
        $scope.user = StorageService.get('User');
        $scope.user.portraitImgUrl = StorageService.get('UserPortraitImage');
        $scope.goToGroup(StorageService.get('TopGroup'));
     },function(err){
             console.log('fail to update groups');
     });
   }

	 $scope.switchGroup = function(group){
      if(group != 'top'){
        console.log("switch to " + group.name);
        $scope.goToGroup(group);        
      }else{
        console.log('back to top group');
        $scope.goToGroup(StorageService.get('TopGroup'));
      }
      $scope.toggleMenu();
	 }

   function g(url){
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
      StorageService.remove('User');
      StorageService.remove('UserPortraitImage');
      StorageService.remove('GroupIDs');

      cordova.exec(function(rep){
        console.log(rep);
      }, function(error) {
        console.log(error);
        navigator.notification.alert("Log Out Error Currently", function(){
          $state.transitionTo('stage.activityFeed');
        }, "Sorry", "I understand");
      }, "cookieManager","deleteCookies",[]);

      //deleteAllCookies();  delete cookies by javascript which does not work in phonegap
      $state.transitionTo('login');
   }

   // function deleteAllCookies() {
   //    console.log('delete all cookies');
   //    var cookies = document.cookie.split(";");
   //    console.log(cookies);
   //    console.log('cookies: ' + cookies.length);

   //    for (var i = 0; i < cookies.length; i++) {
   //      var cookie = cookies[i];
   //      var eqPos = cookie.indexOf("=");
   //      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
   //      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
   //    }
   //  }

   //  function deleteCookie ( name, path, domain ) {
   //      console.log('delete cookie');
   //      document.cookie = name + "=" +
   //      ( ( path ) ? ";path=" + path : "") +
   //      ( ( domain ) ? ";domain=" + domain : "" ) +
   //      ";expires="+(new Date()).toGMTString();
   //  }

}])