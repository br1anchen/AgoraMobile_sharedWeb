'use strict';
//Activity Block Directive

app.directive('activityBlock', function factory($log, AppService, $state, MessageBoardService,$rootScope, $q, StorageService) {
  var directiveObj = {
    priority: 0,
    replace: true,
    transclude: true,
    restrict: 'E',
    controller:function($scope){
      $scope.picURL = AppService.getBaseURL() +'/image' + $scope.activity.pic;
      $scope.open = function(){
        switch($scope.activity.type){
          case "message":
          var messages = 1;

            var openMessage = function(){
              MessageBoardService.getCategories({id:$scope.activity.groupId}).then(function(categoriesHolder){
                angular.forEach(categoriesHolder.categories,function(c,k){

                  MessageBoardService.getThreads({id:$scope.activity.groupId}, c.categoryId).then(function(threadsHolder){
                    angular.forEach(threadsHolder.threads,function(t,k){

                      MessageBoardService.getMessages({id:$scope.activity.groupId}, c.categoryId, t.threadId).then(function(messageHolder){
                        angular.forEach(messageHolder.messages,function(m,k){
                          console.log("message:"+(messages++))
                          if(m.messageId == $scope.activity.messageId){
                            //Navigating to message
                            $state.transitionTo('stage.messageBoard.messages',{categoryId:m.categoryId, threadId:m.threadId});
                          }

                        })
                      })
                    })
                  })
                })
              })
            }

            //Finding message meta
            if($scope.currentGroup.id != $scope.activity.groupId){
              var group;
              angular.forEach(StorageService.get('groups'),function(g,k){
                if(g.id == $scope.activity.groupId){
                  group = g;
                }
              })

              $scope.changeGroup(group).then(
                function(res){
                  openMessage();
                })
            }
            else{
              openMessage();
            }
                            
            
          break;
          case "file":

          break;
          case "wiki":

          break;
          default:
            //No link
          break;
        }
      }
    },
    link: function postLink(scope, iElement, iAttrs) {

    },
    template: 
    '<div class="activityBlock" data-ng-click="open()">'+
        '<div class="peopleImg">'+
        '   <img ng-src="{{picURL}}"></img>' +
        '</div>'+
        '   <span class="content">'+
        '     <span class="action" >{{activity.action}}</span>, <span class="reference">{{activity.reference}}</span>'+
        '   </span>'+
        '<span class="date">{{activity.timestamp | timeago | camelcase}}</span>' +
    '</div>'
  };
  return directiveObj;
});