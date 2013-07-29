//loginController Unit Test
'use strict';

describe('LoginController', function(){
    var AppService;

    angular.module('stateMock',[]);
    angular.module('stateMock').service("$state", function(){
        this.expectedTransitions = [];
        this.transitionTo = function(stateName){
            if(this.expectedTransitions.length > 0){
                var expectedState = this.expectedTransitions.shift();
                if(expectedState !== stateName){
                    throw Error("Expected transition to state: " + expectedState + " but transitioned to " + stateName );
                }
            }else{
                throw Error("No more transitions were expected!");
            }
            console.log("Mock transition to: " + stateName);
        }

        this.expectTransitionTo = function(stateName){
            this.expectedTransitions.push(stateName);
        }


        this.ensureAllTransitionsHappened = function(){
            if(this.expectedTransitions.length > 0){
                throw Error("Not all transitions happened!");
            }
        }
    });

	var scope, state, mCtrl, ctrl, $httpBackend;

	beforeEach(module('app'));
    beforeEach(module('app.storageService'));
    beforeEach(module('stateMock'));

  	beforeEach(inject(function($injector,$rootScope,$controller,$state){
        AppService = $injector.get('AppService');
		$httpBackend = $injector.get('$httpBackend');

		//Invalid auth token by test user info
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/' + AppService.getBaseURL().replace(/.*\/\//,"")
        	,function(headers){
        		return headers['Authorization'] != 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [401,
        	'{"exception":"Invalid authentication token"}',
        	{'WWW-Authenticate': 'Basic realm="PortalRealm"'}
        	]
        }); 

		//Valid login for test
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/' + AppService.getBaseURL().replace(/.*\/\//,"")
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return [200,
			'{"accountId":10134,"active":true,"companyId":10132,"homeURL":"/group/agora/home","key":null,"logoId":10701,"maxUsers":0,"mx":"uninett.no","system":false,"webId":"liferay.com"}'
			]
		});
        
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/user/get-user-by-screen-name/company-id/10132/screen-name/testUser'
            ,function(headers){
                return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
            return [200,
            '{"agreedToTermsOfUse":true,"comments":"","companyId":10132,"contactId":254910,"createDate":1371558228299,"defaultUser":false,"emailAddress":"stianbor@hist.no","emailAddressVerified":false,"facebookId":0,"failedLoginAttempts":0,"firstName":"Stian","graceLoginCount":0,"greeting":"Welcome Stian Borgesen!","jobTitle":"1115 Hjelpearbeider","languageId":null,"lastFailedLoginDate":null,"lastLoginDate":1372842501705,"lastLoginIP":"158.38.40.11","lastName":"Borgesen","lockout":false,"lockoutDate":null,"loginDate":1372843329052,"loginIP":"158.38.40.11","middleName":"","modifiedDate":1371558228299,"openId":"","portraitId":254940,"reminderQueryAnswer":"Buster","reminderQueryQuestion":"Hva heter din katt?","screenName":"stianbor__hist.no","status":0,"timeZoneId":null,"userId":254909,"uuid":"776bcdab-6588-4214-aec7-114ec88bcd6d"}'
            ]
        });

        //get feide login url request
        $httpBackend.whenGET(AppService.getBaseURL() + '/c/portal/feide/loginurl?redirect=%2Fgroup%2Fagora%2Fdokumenter%3Fp_p_id%3Dagoramypassword_WAR_agoramypasswordportlet%26p_p_state%3Dpop_up%26p_p_mode%3Dedit%26p_p_lifecycle%30%26controlPanelCategory%3portlet_agoramypassword_WAR_agoramypasswordportlet')
        .respond(function(){
            return[200,
            'https://idp-test.feide.no/simplesaml/saml2/idp/SSOService.php?SAMLRequest=fZHLTsMwEEX3fEXkfZzYbQlYTaqiClEJRNUEFmyQSYbWUjIOHqfi88mjSLDpxtLY18czx8vVd1MH%0AJ3BkLKZM8JgFgKWtDB5S9lLchzdslV0tSTe1bNW680fcw1cH5INNvxjUfrx59L4lFUWmakPfH%2FBP%0AMBVwtBGZpq1hAEQjZYhEef6cgzuZEnh7bFmw3aSsM%2FQuZom8TpL5fLG4lf02UQdbJK%2FRp0zGYhbG%0ASRiLQgglEiUXvI%2B9sWDnrLelre8MTp13DpXVZEihboCUL1W%2BfnpUksfqYwqReiiKXbiHyjgoPQte%0Afy3IwULvBUlNc1%2FmtefHWTZpUmPX7i%2FhMkATgRs0sgwt79Ag%2BF6gJq4P1unR5zL6y87O5f8fyX4A'
            ]
        });

		scope = $rootScope.$new().$new();
        state = $state;

        //mCtrl = $controller('MainCtrl',{$scope: scope});
      	ctrl = $controller('LoginCtrl', {$scope: scope});

	}));


  it('should login with correct username and password', inject(function(StorageService) {

    scope.username = "testUser";
    scope.password = "demo";

    scope.login();

    state.expectTransitionTo("stage.activityFeed");

    $httpBackend.flush();

    //delete stored user info
    StorageService.remove('testUser');
    StorageService.remove('UserScreenName');

    
    state.ensureAllTransitionsHappened();    

  }));

  it('should not login with incorrect username and password', inject(function(StorageService) {

    //delete stored user info
    StorageService.remove('testUser');
    StorageService.remove('UserScreenName');

    scope.username = "testUser";
    scope.password = "";

    scope.login();

    state.expectTransitionTo("login");

    $httpBackend.flush();

    state.ensureAllTransitionsHappened();
    
  }));
});
