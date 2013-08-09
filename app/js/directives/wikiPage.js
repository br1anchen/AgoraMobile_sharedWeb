'use strict';

app.directive('wikiPage', function factory($log,AppService) {
  var directiveObj = {
    priority: 0,
    replace: true,
    transclude: true,
    restrict: 'E',
    scope: {
      node:"="
    },
    controller:function($scope){
        $scope.unfold = function(){
            $scope.unfold = $scope.expand ? true : false;
        }
    },
    link: function postLink(scope, iElement, iAttrs) {

    },
    template: 
    '<div'+
    '    class="leafTitle"'+
    '    data-ng-class="{folder:node.childrenNodes.length > 0}"'+
    '>'+
    '    <span data-ng-click="showWiki(wikiTreeHolder.mainNode.nodeId,node.title)">'+
    '        <div class="iconHolder">'+
    '             <i'+
    '                id="icon_{{node.title}}"'+
    '                data-ng-class="{\'icon-folder-open-alt\' : node.title==\'Tavle - Start\', \'icon-folder-close-alt\':node.title!=\'Tavle - Start\'}"'+
    '                ng-show="node.childrenNodes.length > 0">'+
    '            </i>'+
    '            <i class="icon-book" ng-show="node.childrenNodes.length == 0"></i>'+
    '        </div>'+
    '        <div class="text" data-ng-bind="node.title"></div>'+
    '    </span>'+
    '    <div'+
    '        class="unfold"'+
    '        data-ng-show="node.childrenNodes.length > 0"'+
    '        data-ng-click="openChildren(node)"'+
    '    >'+
    '        <i class="icon-level-down" class="detailBtn" ></i>'+
    '    </div>'+
    '    <div class="unfoldTransition" ng-show="node.childrenNodes.length > 0" >'+
    '    </div>'+
    '</div>'+
    '<ul'+
    '    id="cUl_{{node.title}}"'+
    '    class="closeList leaf"'+
    '    ng-class="{firstWikiNode : node.title==\'Tavle - Start\'}"'+
    '>'+
    '    <li'+
    '        data-ng-class="{folder:node.childrenNodes.length > 0}"'+
    '        ng-repeat="node in node.childrenNodes"'+
    '        ng-include="\'nestList\'"'+
    '        id="node_{{node.title}}">'+
    '    </li>'+
    '</ul>'
  };
  return directiveObj;
});