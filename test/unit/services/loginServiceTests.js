'use strict';

describe('LoginService',function(){

	var loginService;
	var $httpBackend;
	var $q;
	var testUser = {//testUser
		screenName : "",
    	userId : "",
      	password : ""
	};

	beforeEach(module('app.loginService'));

	beforeEach(inject(function($injector){
		$httpBackend = $injector.get('$httpBackend');

		// //Invalid auth token by Brian user info
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no'
        	,function(headers){
        		return headers['Authorization'] != 'Basic YnIxYW5jaGVuOkFwdHg0ODY5' ? true :false;
        })
        .respond(function(){
        	return [401,
        	'{"exception":"Invalid authentication token"}',
        	{'WWW-Authenticate': 'Basic realm="PortalRealm"'}
        	]
        }); 

		// //Valid login for Brian
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no'
        	,function(headers){
        		return headers['Authorization'] == 'Basic YnIxYW5jaGVuOkFwdHg0ODY5' ? true :false;
        })
		.respond(function(){
			return [200,
			'{"status":0,"id":0,"data":{"accountId":10134,"active":true,"companyId":10132,"homeURL":"/group/agora/home","key":null,"logoId":10701,"maxUsers":0,"mx":"uninett.no","system":false,"webId":"liferay.com"}}'
			]
		});

	}));

	afterEach(function() {
	  	$httpBackend.verifyNoOutstandingExpectation();
	  	$httpBackend.verifyNoOutstandingRequest();
	});

	it('Testing login with correct screen name and password',inject(function(LoginService){
		
		//testUser as brian correct user info
		testUser.screenName = "br1anchen";
		testUser.password = "Aptx4869";

		var promise = LoginService.login('company/get-company-by-virtual-host/virtual-host/agora.uninett.no',testUser);

		var validUser;
		promise.then(function(){
			validUser = true;
		});

		$httpBackend.flush();
		expect(validUser).toBe(true);

	}));

	it('Testing login with incorrect screen name and password',inject(function(LoginService){
		
		//testUser as brian correct user info
		testUser.screenName = "br1anchen";
		testUser.password = "";

		var promise = LoginService.login('company/get-company-by-virtual-host/virtual-host/agora.uninett.no',testUser);

		var invalidUser;
		promise.then(function(){
			invalidUser = false;
		});

		$httpBackend.flush();
		expect(invalidUser).toBe(undefined);

	}));
});