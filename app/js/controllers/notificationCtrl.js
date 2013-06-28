'use strict';

app.controller('NotificationCtrl',['$scope','$log',function($scope,$log){
  $scope.notifications = [];

  function addAlert(msg,type) {
    $scope.notifications.push({
    	type:(type == 'serviceMessage') ? 'error' : 'success',
    	msg: msg
    });
  };
  addAlert("Test serviceMessage","serviceMessage");
  addAlert("Test regular message");

  $scope.closeAlert = function(index) {
    $scope.notifications.splice(index, 1);
  };

}])