//loginController Unit Test
'use strict';

describe('LoginController', function(){
	var scope, mCtrl, ctrl, $httpBackend;

	beforeEach(module('app'));
    beforeEach(module('app.storageService'));

  	beforeEach(inject(function($injector,$rootScope,$controller){
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

    expect(scope.loginValid).toBe(true);
  }));

  it('should not login with incorrect username and password', inject(function(StorageService) {

    //delete stored user info
    StorageService.remove('testUser');
    StorageService.remove('UserScreenName');

    scope.username = "testUser";
    scope.password = "";

    scope.login();

    $httpBackend.flush();
    expect(scope.loginValid).toBe(false);
  }));
});
