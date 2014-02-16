'use strict';

app.directive("tree", function($compile) {
    return {
        restrict: "E",
        scope: {
            root: '=',
            parentFunc:'&click',
            open:'@'
        },
        controller : function($scope){
            if($scope.root.childrenNodes && $scope.root.childrenNodes.length > 0){
                $scope.parent = true;
            }
            $scope.toggleChildren = function(){
                $scope.open = $scope.open ? false : true;
            }
        },
        template:
            '   <div class="leaf" data-ng-class="{\'parent\' : parent,\'notParent\' : !parent}" >'+
            '       <div>'+
            '           <span class="iconHolder" data-ng-show="parent" data-ng-click="toggleChildren(root.title)" >'+
            // '           <span class="iconHolder">'+
            // '               <i class="fa fa-file-text-alt"></i>'+
            '              <i class="detailBtn fa fa-caret-down" ></i>'+
            '              <i class="detailBtn fa fa-caret-up" data-ng-show="open"></i>'+
            '           </span>'+
            '           <div class="titleHolder" data-ng-click="click(root.title)">'+
            '               <span class="title" data-ng-bind="root.title"></span>'+
            '               <div class="titleTransition"></div>'+
            '           </div>'+
            '       </div>'+
            // '       <span class="unfold iconHolder" data-ng-show="parent" data-ng-click="toggleChildren(root.title)">'+
            // '           <i class="detailBtn fa fa-carret-down" data-ng-hide="open"></i>'+
            // '           <i class="detailBtn fa fa-carret-up" data-ng-show="open"></i>'+
            // '       </span>'+
            '   </div>'+
            '   <ul data-ng-show="open">' + 
            '       <li ng-repeat="child in root.childrenNodes">' + 
            '           <tree root="child" click="click(title)"></tree>' +
            '       </li>' +
            '   </ul>'
        ,
        compile: function(tElement, tAttr) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function(scope, iElement, iAttr) {
                if(!compiledContents) {
                    compiledContents = $compile(contents);
                }
                compiledContents(scope, function(clone, scope) {
                        iElement.append(clone); 
                        iElement = $(iElement);
                        iElement.find('ul').css({
                            'margin-left':'1em',
                            'display':'block'
                        })

                        scope.click = function(t){
                            scope.parentFunc({title:t})
                        };
                });
            };
        }
    };
});