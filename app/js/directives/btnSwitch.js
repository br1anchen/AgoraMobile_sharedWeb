'use strict';

app.directive('btnSwitch', function(){
    
  return {
    restrict : 'A',
    require :  'ngModel',
    template : 
        '<span class="btn btnSwitch">'+
          '<span class="btnSwitchOn btn-primary">ON</span>'+
          '<span class="btnSwitchOff btn-default">OFF</span>'+ 
        '</span>',
    replace : true,
    link : function(scope, element, attrs, ngModel){
                   
        // Specify how UI should be updated
        ngModel.$render = function() {
          render();
        };
        
        var render=function(){
          var val = ngModel.$viewValue; 
          
          var open=angular.element(element.children()[0]);
          open.removeClass(val ? 'btnSwitchHide' : 'btnSwitchShow');
          open.addClass(val ? 'btnSwitchShow' : 'btnSwitchHide');
            
          var closed=angular.element(element.children()[1]);
          closed.removeClass(val ? 'btnSwitchShow' : 'btnSwitchHide');
          closed.addClass(val ? 'btnSwitchHide' : 'btnSwitchShow');
        };
        
        // Listen for the button click event to enable binding
        element.bind('click', function() {
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