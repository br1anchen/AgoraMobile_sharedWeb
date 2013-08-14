'use strict';
//Activity Block Directive

app.directive('activityBlock', function factory($log, AppService, $state, MessageBoardService,$rootScope, $q, StorageService, ContentService) {
  var directiveObj = {
    priority: 0,
    replace: true,
    transclude: true,
    restrict: 'E',
    controller:function($scope){
      $scope.picURL = AppService.getBaseURL() +'/image' + $scope.activity.pic;
      $scope.open = function(){

        //Custom function to open activity, set below depending on activity type
        var open;

        //User error message
        var failed = function(){
          $rootScope.$brodcast("notification","Open faild");
        }

        //Setting the correct function for opening the activity
        switch($scope.activity.type){
          case "message":
            open = function(){
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
          break;
          case "file":
            open = function(){
              $state.transitionTo('stage.documents.file',{folderId:$scope.activity.folderId,fileTitle:$scope.activity.fileTitle});
            }          
          break;
          case "wiki":

          break;
          default:
            //No link
          break;
        }

        //Making sure the correct groups for this activity is loaded
        if($scope.currentGroup.id != $scope.activity.groupId){
          //Finding correct groups
          var group = StorageService.get('TopGroup');
          var groups = StorageService.get('groups')
          var i=0;
          while(group.id != $scope.activity.groupId){
            group = groups[i++];
          }
          if(!group){
            console.error("activityBlock: Could not find group")
            failed();
          }
          
          //Changing to correct group
          $scope.changeGroup(group);
          //Making sure group content is loaded
          ContentService.getGroupPromise()
          .then(
            function(res){
              open();
            },function(err){
              failed();
            })
        }
        else{
          ContentService.getGroupPromise().then(
            function(){
              open();
            },
            function(err){
              failed();
            }
          )
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