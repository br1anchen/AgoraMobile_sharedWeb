angular.module('app.stateService',[]).
//This service adds support for passing objects in the stateParams of the UI routing, when using this service's transition to method
factory('StateService',function($log,$rootScope,$state,$stateParams){

    var stateHistory = [];
    var stateVariables = {};
    var useStaticStateVariables = false;
    
    var back = false;
    var internalTransition = false;

    var getCurrentStateHistory = function(){
    	return stateHistory[stateHistory.length-1];
    }
    var storeHistory = function (toState,toParams){
    	//STORING HISTORY
        if(toState.name != ''){
    		stateHistory.push({
                state : toState,
                params : toParams
            });   
        }
    }

    //CALLED WHENEVER STATE CHANGES
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        
        if(stateHistory.length == 0 && fromState.name == "stage.activityFeed" && !fromParams.groupId){//init when the first time
        	fromParams.groupId = 10157;
        	storeHistory(fromState, fromParams);
        }
        //When navigation was back navigation, skip caching history 
        if(back){
        	//Trash previous state
			stateHistory.pop();

			//Add previous parameteters in case it had objects not passed byt UI router
	    	params = getCurrentStateHistory().params;
	    	for(var key in params){
	    		//If parameter is not set we add it
	    		if(!toParams[key]){
	    			toParams[key] = params[key];
	    		}
	    	}
	    	//Reseting history skip
		    back=false;
	    }
	    //If transition was initiated form this service(internalTransition) parameters should be overwritten to support objects
	    else if(!internalTransition){
    		storeHistory(toState, toParams);
	    }
	    else{
	    	//Injecting initial parameters
	    	toParams=internalTransition;
			storeHistory(toState, toParams);
	        internalTransition = false;	
	    }

        //POTENTIALY ADDIN STATE VARIABLES IF NOT SET
        if(useStaticStateVariables){
	        //Checking if state has state variables
	        for(var key in stateVariables){
	        	if(key === toState.name){
	        		var stateParams = stateVariables[key];

	        		//Iterating state variables
	        		for(var key in stateParams){
	        			//Adding stateVariable if not set
	        			if(!toParams[ key ] ) toParams[key] = stateParams[key];
	        		}
	        	}
	        }
	    }
    })
	//If a state change triggered from this service fails
	//We need to delete stored history before transition
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
		if(internalTransition){
			stateHistory.pop();
		}
	})

	return {
		transitionTo : function(toState,toParams){
			internalTransition = toParams;
			$state.transitionTo(toState,toParams);
		}
		,addStateVariables : function(name, value, states){
			var error = function(){console.error('StateService: addStateVariables : Illegal input. function "addStateVariables(name, value,states)" takes an arbitrary type "value" and "states" as array of "strings" og "string". The "name" must be of type "string")')};
			var add = function(name,value,state){
				if(!stateVariables[state]) stateVariables[state] = {};
				//Adding new or overwriting old value:				
				stateVariables[state][name] = value;
			}

			//name must be string
			if(typeof name !== 'string'){
				error();
				return;
			}

			//Adding value to state if only a single state given
			//State must be of type string
			if(typeof states === 'string') add(name,value,states);

			//If multiple states are given as array:
			else if(Object.prototype.toString.call(states) === "[object Array]"){
				for(var i = 0 ; i < states.length ; i++){
					//State must be of type string
					if(typeof states[i] !== 'string'){
						error();
						return;
					}
					add(name,value,states[i]);
				}
			}
			else{
				error();
				return;
			}
		}
		,removeStateVariable : function(name, states){
			var error = function(){console.error('StateService: removeStateVariable : illegal input. function "removeStateVariable(value,states)" takes an arbitrary type "value" and "states" as array of "strings" og "string")')};
			var remove = function(state, name){
				if(stateVariables.state){
					var index = stateVariables.state.indexOf(name);
					if(index > -1) stateVariables.state.splice(index,1);
				}
			}

			if(typeof states === 'string'){
				remove(states, name);
			}
			else if(Object.prototype.toString.call(states) === "[object Array]"){
				for(var i = 0 ; i < states.length ; i++){
					if(typeof states[i] !== 'string'){
						error();
						return;
					}
					remove(states[i],name);
				}
			}
			else{
				error();
				return;
			}
		}
		,goBack : function(){
			if(stateHistory.length > 0 ){
				var prevState = this.peekPreviousState();

				//Make sure transition is not recorded as history
				back = true;
				$state.transitionTo( prevState.state.name, prevState.params);
				return;
			}

			console.log("StateService: No previous state found");
		}
		,peekPreviousState : function(write){
			var prevState = stateHistory[stateHistory.length -2];
			return write ? prevState : angular.copy(prevState);
		}
		,setCurrentStateParameter : function(name,value){
			stateHistory[stateHistory.length -1].params[name] = value;
		}
		,getCurrentStateParameter : function(name){
			return stateHistory[stateHistory.length -1].params[name];
		}
		,removeCurrentStateVariable : function(name,value){
			if(!stateHistory[stateHistory.length -1].params[name]){
				console.error("StateService: removeCurrentStateVariable() : "+name+" not set");
			}
			stateHistory[stateHistory.length -1].params[name] = value;
		}
		,stateVariablesOn : function(){
			useStaticStateVariables = true;
			console.log("StateService: stateVariables turned on");
		}
		,stateVariablesOff : function(){
			useStaticStateVariables = false;
			console.log("StateService: stateVariables turned off");
		}
		,clearStateVariables : function(){
			stateVariables = [];
		}
	}
})