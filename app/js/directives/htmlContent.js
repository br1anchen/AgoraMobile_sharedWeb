'use strict';

app.directive('htmlContent', function factory($compile,StorageService,UtilityService,$state) {
	function linkify(content,groupId){
		var e = $(document.createElement('div'));
		e.append(content);
		//Searching for anchor elements in elements DOM
		var anchors = e.find('a');
		angular.forEach(anchors,function(a,k){
			a = $(a);
			var href = a.attr('href');
			var parts = href.split('/');
			var lastString = parts[parts.length-1];
			var wikiName = lastString.replace(/\+/g,' ');
			var page = StorageService.get('Group' + groupId + '_WikiPageTitle:' + wikiName);

			if(page){
				a.removeAttr('href');
				a.attr('data-ng-click','showWiki('+page.nodeId+',\''+page.title+'\')');
			}
			else{
				switch(lastString){
					case "forum":
						a.removeAttr('href');
						a.attr('data-ng-click',"path('stage.messageBoard.categories')");
					break;
					case "dokumenter":
						a.removeAttr('href');
						a.attr('data-ng-click',"path('stage.documents.root')");
					break;
					case "tavle":
						a.removeAttr('href');
						a.attr('data-ng-click',"path('stage.wiki.contentlist')");
					break;
					default:
			            //If the link is not understood, and related to Agora, we remove the achor
			           	if(href.indexOf('agora') > 0){
			              	a.replaceWith('<span>'+a.html()+'</span>');
			            }else{
			            	a.removeAttr('href');
			            	a.attr('data-ng-click',"load(\'" + href + "\')");
			            }
		            break;
				}
			}
		})
		return e.html();
	}

	return{
		replace: false,
		restrict: 'A',
		scope:{
			content: '=',
			group: '='
		},
		controller: function($scope){
			$scope.load = function(url){
				UtilityService.inAppBrowser.browser(url);
			}

			$scope.path = function(path) {
		        $state.transitionTo(path);
		    }

		    $scope.showWiki = function (nId,t){
				$state.transitionTo('stage.wiki.page',{nodeId:nId,title:t});
			}
		},
		link: function postLink(scope,element) {
			scope.$watch('scope.content',function(newVal,oldVal){
			
				var replacedContent = linkify(scope.content,scope.group.id);

				var template = replacedContent;

				if(replacedContent != scope.content){
					var template = angular.element(template);

					var linkFn = $compile(template);

					linkFn(scope);
				}
				element.append(template);
			})
		}
	};
});