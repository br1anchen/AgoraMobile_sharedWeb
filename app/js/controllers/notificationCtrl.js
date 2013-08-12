'use strict';

app.controller('NotificationCtrl',function($scope,$log){
  $scope.notifications = [];

  function addAlert(msg,type) {
    $scope.notifications.push({
    	type:(type == 'serviceMessage') ? 'error' : 'success',
    	msg: msg
    });
  };

  $scope.closeAlert = function(index) {
    $scope.notifications.splice(index, 1);
  };

  // addAlert("Test serviceMessage","serviceMessage");
  // addAlert("Test regular message");
  
})