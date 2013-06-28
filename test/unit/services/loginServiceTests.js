'use strict';

describe('LoginService',function(){

	var loginService;
	var $httpBackend;

	beforeEach(module('app.loginService'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector){
		$httpBackend = $injector.get('$httpBackend');

		// //Invalid auth token by test user info
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

		// //Valid login for test
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return [200,
			'{"accountId":10134,"active":true,"companyId":10132,"homeURL":"/group/agora/home","key":null,"logoId":10701,"maxUsers":0,"mx":"uninett.no","system":false,"webId":"liferay.com"}'
			]
		});

	}));

	afterEach(function() {
	  	$httpBackend.verifyNoOutstandingExpectation();
	  	$httpBackend.verifyNoOutstandingRequest();
	});

	it('Testing login with correct screen name and password',inject(function(LoginService){
		
		//testUser correct user info
		var promise = LoginService.login('testUser','demo');

		var validUser;
		promise.then(function(){
			validUser = true;
		});

		$httpBackend.flush();
		expect(validUser).toBe(true);

	}));

	it('Testing login with incorrect screen name and password',inject(function(LoginService){
		
		//testUser incorrect user info
		var promise = LoginService.login('testUser','1234');

		var invalidUser;
		promise.then(function(){
			invalidUser = false;
		});

		$httpBackend.flush();
		expect(invalidUser).toBe(undefined);

	}));

	it('Testing after login store user screen name and auth',inject(function(LoginService,StorageService){



		//delete stored user info
		StorageService.remove('testUser');
		StorageService.remove('UserScreenName');

		//login with correct user info first
		var promise = LoginService.login('testUser','demo');
		var store;

		promise.then(function(rep){
			store = LoginService.requestStorage('testUser',rep.data.companyId);
		});

		$httpBackend.flush();
		expect(store).toBe('stored');

	}));
});