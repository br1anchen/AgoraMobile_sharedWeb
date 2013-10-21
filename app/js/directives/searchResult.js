'use strict';
//Search Result Directive

app.directive('searchResult', function factory($log, AppService, $state, MessageBoardService,$rootScope, $q, StorageService, ContentService) {
  var directiveObj = {
    priority: 0,
    replace: true,
    transclude: true,
    restrict: 'E',
    controller:function($scope){
      
      $scope.open = function(){
        $rootScope.$broadcast("notification","Loading...");
        
        var initialGroup = $scope.currentGroup;
        //Custom function to open search result, set below depending on result type
        var open;

        //User error message
        var failed = function(){
          $rootScope.$broadcast("notification","Open faild");
          $scope.openGroup(initialGroup);
        }

        //Setting the correct function for opening the result
        switch($scope.result.type){
          case "Message":
            open = function(){
              //Making sure messageBoard is loaded
              ContentService.getMBTPromise().then(function(){
                var thread = MessageBoardService.getThread($scope.result.groupId,$scope.result.threadId);
                if(thread){
                   $state.transitionTo('stage.messageBoard.messages',{categoryId:thread.categoryId, threadId:thread.threadId}); 
                }
                else{
                  failed();
                }
              })
            };
          break;
          case "File":
            open = function(){
              ContentService.getDocumentsPromise().then(
                function(){

                  $state.transitionTo('stage.documents.file',{folderId:$scope.result.folderId,fileTitle:$scope.result.fileName});

                },function(){
                  failed();
                }
              )
            }          
          break;
          case "Wiki":
            open = function(){
              ContentService.getWikiPromise().then(
                function(){
                  $state.transitionTo('stage.wiki.page',{nodeId:$scope.result.nodeId,title:$scope.result.title});
                },function(){
                  failed();
                }
              )
            }
          break;
          default:
            open = failed;
            console.error("searchResult: Could not find result type")
          break;
        }

        //Making sure the correct groups for this result is loaded
        if($scope.currentGroup.id != $scope.result.groupId){
          //Finding correct groups
          var group = StorageService.get('TopGroup');
          var groups = StorageService.get('groups')

          if(!group  || group.id != $scope.result.groupId){
            if(groups){
              for(var i = 0 ; i < groups.length ; i++){
                if(groups[i].id == $scope.result.groupId){
                  group = groups[i];
                  break;
                }
              }
            }
          }

          if(!group){
            console.error("searchResult: Could not find group related to result")
            failed();
          }

          //Changing to correct group
          $scope.loadGroup(group);
          open();
        }
        else{
          open();
        }

        $scope.toggleSearch();
      }
    },
    link: function postLink(scope, iElement, iAttrs) {

    },
    template: 
    '<div class="searchResult" data-ng-click="open()">'+
        '<div class="result">'+
        '   <span class="resultType">{{result.type}}</span>'+
        '   <span class="resultTitle"><{{result.shownText}}><br />in </span>'+
        '   <span class="reference">{{result.gName}}<br /></span>'+
        '   <span class="snippet" >"{{result.snippet}}"</span>'+
        '</div>'+
        '<div class="date">{{result.modifiedDate}}</div>' +
    '</div>'
  };
  return directiveObj;
});