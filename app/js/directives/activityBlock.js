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
          $rootScope.$broadcast("notification","Open faild");
        }

        //Setting the correct function for opening the activity
        switch($scope.activity.type){
          case "message":
            open = function(){
              var messageFound = false;

              MessageBoardService.getCategories({id:$scope.activity.groupId}).then(function(categoriesHolder){
                var cPromises = [];
                angular.forEach(categoriesHolder.root.children,function(c,k){
                  var tDeffer= $q.defer();
                  MessageBoardService.getThreads({id:$scope.activity.groupId}, c.categoryId).then(function(threadsHolder){
                    var mPromises = [];
                    angular.forEach(threadsHolder.threads,function(t,k){
                      mPromises.push(MessageBoardService.getMessages({id:$scope.activity.groupId}, c.categoryId, t.threadId).then(function(messageHolder){
                        angular.forEach(messageHolder.messages,function(m,k){
                          if(m.messageId == $scope.activity.messageId){
                            messageFound = true;
                            //Navigating to message
                            $state.transitionTo('stage.messageBoard.messages',{categoryId:m.categoryId, threadId:m.threadId});
                          }
                        })
                      }))

                    })
                    $q.all(mPromises).then(function(res){tDeffer.resolve(res)},function(err){tDeffer.reject(err)});
                  })
                  cPromises.push(tDeffer.promise)
                })
                $q.all(cPromises).then(function(res){
                  //All request went well, and are finished
                  //We should have found the message now
                  if(!messageFound){
                    $rootScope.$broadcast("notification","No Message found");
                  }
                })
              })
            }
          break;
          case "file":
            open = function(){
              //Fix to detect activities with multiple files. If the file name is actually multiple files, we will not find the file in local storage.
              //Then we open the folder
              if(! StorageService.get('Group' + $scope.currentGroup.id + '_Folder' + $scope.activity.folderId + '_FileTitle:' + $scope.activity.fileName) ){
                $state.transitionTo('stage.documents.folder',{folderId:$scope.activity.folderId});  
              }
              else{
                $state.transitionTo('stage.documents.file',{folderId:$scope.activity.folderId,fileTitle:$scope.activity.fileName});
              }
            }          
          break;
          case "wiki":
            open = function(){
              $state.transitionTo('stage.wiki.page',{nodeId:$scope.activity.node,title:$scope.activity.title});
            }
          break;
          default:
            open = failed;
            console.error("activityBlock: Could not find activity type")
          break;
        }

        //Making sure the correct groups for this activity is loaded
        if($scope.currentGroup.id != $scope.activity.groupId){
          //Finding correct groups
          var group = StorageService.get('TopGroup');
          var groups = StorageService.get('groups')
          
          if(!group  || group.id != $scope.activity.groupId){
            if(groups){
              for(var i = 0 ; i < groups.length ; i++){
                if(groups[i].id == $scope.activity.groupId){
                  group = groups[i];
                  break;
                }
              }
            }
          }

          if(!group){
            console.error("activityBlock: Could not find group")
            failed();
          }

          //Changing to correct group
          $scope.changeGroup(group);
          ContentService.getGroupPromise()
          .then(
            function(res){
              open();
            },function(err){
              failed();
            }
          );
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
        '   <div class="content">'+
        '     <div class="activity">'+
        '       <span class="action" >{{activity.action}}</span>, <span class="reference">{{activity.reference}}</span>'+
        '     </div>'+
        '   </div>'+
        '<span class="date">{{activity.timestamp | timeago | camelcase}}</span>' +
    '</div>'
  };
  return directiveObj;
});