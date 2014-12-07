angular.module('app.filters.camelcase',[]).

filter('camelcase', function() {
	return function(input) {
		return input.substring(0,1).toUpperCase() + input.substring(1);
	}
});
