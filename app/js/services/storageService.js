angular.module('app.storageService',[]).
factory('StorageService',['$log','$window',function($log,$window){
	var invalidKey = function(key){
    	$log('StorageService:store():Invalid key(should be a string):'+JSON.stringify(key));
    }

	return {
		store: function(key, object) {
	        if (object && _.isString(key) && key.length > 0) {
	            $window.localStorage.setItem(key, JSON.stringify(object));
	            return 'stored';
	        }else{
	        	invalidKey(key);
	        	return 'failed';
	        }
	    },
	    remove: function(key) {
	        if (_.isString(key)) {
	            $window.localStorage.removeItem(key);
	            return 'removed';
	        }
	        else{
	        	invalidKey(key);
	        	return 'failed';
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
	    },
	    clear: function(){
	    	$window.localStorage.clear()
	    }
	}
}])