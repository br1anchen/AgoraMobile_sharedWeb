'use strict';

app.directive('wikiPageContent', function factory($compile,StorageService) {
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
		link: function postLink(scope,element) {
			scope.$watch('wikiPageHolder.page.content',function(newVal,oldVal){
			
				var replacedContent = linkify( scope.wikiPageHolder.page.content , scope.currentGroup.id);

				var template = angular.element(replacedContent);

				var linkFn = $compile(template);

				linkFn(scope);

				element.append(template);
			})
		}
	};
});