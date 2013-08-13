'use strict';

app.directive('messageBodyContent', function factory($compile,UtilityService) {

	return{
		replace: false,
		restrict: 'A',
		scope:{
			content:'='
		},
		controller: function($scope){
			$scope.load = function(url){
				UtilityService.inAppBrowser.browser(url);
			}
		},
		link: function postLink(scope,element) {

			scope.$watch('scope.content',function(newVal,oldVal){
				var e = $(document.createElement());
				e.append(scope.content);
				//Searching for anchor elements in elements DOM
				var anchors = e.find('a');

				angular.forEach(anchors,function(a,k){
					a = $(a);
					var href = a.attr('href');

			        //If the link is not understood, and related to Agora, we remove the achor
			       	if(href.indexOf('agora') > 0){
			          	a.replaceWith('<span>'+a.html()+'</span>');
			        }else{
			        	a.removeAttr('href');
			        	a.attr('data-ng-click',"load(\'" + href + "\')");
			        }
			            
				});

				var template = e.html();

				if(anchors.length != 0){
					template = angular.element(template);

					var linkFn = $compile(template);

					linkFn(scope);
				}

				element.append(template);

			});
			
		}
	};
});