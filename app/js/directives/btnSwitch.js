'use strict';

app.directive('btnSwitch', function(){
    
  return {
    restrict : 'A',
    require :  'ngModel',
    template : 
          '<label class="topcoat-switch">' +
            '<input type="checkbox" class="topcoat-switch__input">' +
            '<div class="topcoat-switch__toggle" data-btnOnText="{{ \'_SwitchBtnOnText_\' | i18n}}" data-btnOffText="{{ \'_SwitchBtnOffText_\' | i18n}}"></div>' +
          '</label>',
    replace : true,
    link : function(scope, element, attrs, ngModel){
                   
        // Specify how UI should be updated
        ngModel.$render = function() {
          render();
        };
        
        var render=function(){
          var val = ngModel.$viewValue; 
          
          var checkbox = $(element.children()[0]);
          checkbox.attr("checked",val);
        };
        
        // Listen for the button click event to enable binding
        $(element.children()[0]).change( function() {
          scope.$apply(toggle);             
        });
                   
        // Toggle the model value
        function toggle() {
           var val = ngModel.$viewValue;
           ngModel.$setViewValue(!val); 
           render();          
        } 
        
        if(!ngModel){  
          //TODO: Indicate that something is missing!
          return;          
        }  // do nothing if no ng-model
        
        // Initial render
         render();
    }
  };
});