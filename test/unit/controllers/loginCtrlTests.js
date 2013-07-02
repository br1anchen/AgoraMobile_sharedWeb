//loginController Unit Test
'use strict';

describe('LoginController', function(){
	var scope, mCtrl, ctrl, $httpBackend;

	beforeEach(module('app'));
    beforeEach(module('app.storageService'));

  	beforeEach(inject(function($injector,$rootScope,$controller){
		$httpBackend = $injector.get('$httpBackend');

		//Invalid auth token by test user info
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no'
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
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return [200,
			'{"accountId":10134,"active":true,"companyId":10132,"homeURL":"/group/agora/home","key":null,"logoId":10701,"maxUsers":0,"mx":"uninett.no","system":false,"webId":"liferay.com"}'
			]
		});

        //get feide login url request
        $httpBackend.whenGET('https://agora-test.uninett.no/c/portal/feide/loginurl?redirect=%2Fgroup%2Fagora%2Fdokumenter%3Fp_p_id%3Dagoramypassword_WAR_agoramypasswordportlet%26p_p_state%3Dpop_up%26p_p_mode%3Dedit%26p_p_lifecycle%30%26controlPanelCategory%3portlet_agoramypassword_WAR_agoramypasswordportlet')
        .respond(function(){
            return[200,
            'https://idp-test.feide.no/simplesaml/saml2/idp/SSOService.php?SAMLRequest=fZHLTsMwEEX3fEXkfZzYbQlYTaqiClEJRNUEFmyQSYbWUjIOHqfi88mjSLDpxtLY18czx8vVd1MH%0AJ3BkLKZM8JgFgKWtDB5S9lLchzdslV0tSTe1bNW680fcw1cH5INNvxjUfrx59L4lFUWmakPfH%2FBP%0AMBVwtBGZpq1hAEQjZYhEef6cgzuZEnh7bFmw3aSsM%2FQuZom8TpL5fLG4lf02UQdbJK%2FRp0zGYhbG%0ASRiLQgglEiUXvI%2B9sWDnrLelre8MTp13DpXVZEihboCUL1W%2BfnpUksfqYwqReiiKXbiHyjgoPQte%0Afy3IwULvBUlNc1%2FmtefHWTZpUmPX7i%2FhMkATgRs0sgwt79Ag%2BF6gJq4P1unR5zL6y87O5f8fyX4A'
            ]
        });

		scope = $rootScope.$new();
        mCtrl = $controller('MainCtrl',{$scope: scope});
      	ctrl = $controller('LoginCtrl', {$scope: scope});

	}));


  it('should login with correct username and password', inject(function(StorageService) {

    scope.username = "testUser";
    scope.password = "demo";

    scope.login();

    $httpBackend.flush();

    //delete stored user info
    StorageService.remove('testUser');
    StorageService.remove('UserScreenName');

    expect(scope.validUser).toBe(true);
  }));

  it('should not login with incorrect username and password', inject(function(StorageService) {

    //delete stored user info
    StorageService.remove('testUser');
    StorageService.remove('UserScreenName');

    scope.username = "testUser";
    scope.password = "";

    scope.login();

    $httpBackend.flush();
    expect(scope.validUser).toBe(false);
  }));
});
