angular.module('app.storageService',[]).
factory('StorageService',['$log','$window',function($log,$window){
	var invalidKey = function(key){
    	$log('StorageService:store():Invalid key(should be a string):'+JSON.stringify(key));
    }

	return {
		store: function(key, object) {
	        if (object && _.isString(key) && key.length > 0) {
	            $window.localStorage.setItem(key, JSON.stringify(object));
	        }else{
	        	invalidKey(key);
	        }
	    },
	    remove: function(key) {
	        if (_.isString(key)) {
	            $window.localStorage.removeItem(key);
	        }
	        else{
	        	invalidKey(key);
	        }
	    },
	    get: function(key) {
	        if (_.isString(key)) {
	            var value = $window.localStorage.getItem(key);
	            return value ? JSON.parse(value) : undefined;
	        } else {
	        	invalidKey(key);
	            return undefined;
	        }
	    }
	}
}])