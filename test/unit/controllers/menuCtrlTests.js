//menuController Unit Test
'use strict';

describe('MenuController', function(){
	var scope, iCtrl, ctrl, $httpBackend,StorageService;

	var testUser = {
      	screenName : "testUser",
      	userId : "",
      	auth : "Basic dGVzdFVzZXI6ZGVtbw==",
      	companyId : ""
   	};

	beforeEach(module('app'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector,$rootScope,$controller,StorageService){
		$httpBackend = $injector.get('$httpBackend');

		// //Invalid auth token by test user info
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/group/get-user-places/-class-names/max/10'
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
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/group/get-user-places/-class-names/max/10'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return [200,
			'[{"active":true,"classNameId":10012,"classPK":250926,"companyId":10132,"creatorUserId":10169,"description":"","friendlyURL":"/agora-app","groupId":250926,"liveGroupId":0,"name":"Agora App","parentGroupId":0,"site":true,"type":3,"typeSettings":""},{"active":true,"classNameId":10024,"classPK":210594,"companyId":10132,"creatorUserId":10135,"description":"","friendlyURL":"/ekstern","groupId":210595,"liveGroupId":0,"name":"Ekstern LFR_ORGANIZATION","parentGroupId":0,"site":false,"type":3,"typeSettings":""},{"active":true,"classNameId":10012,"classPK":10157,"companyId":10132,"creatorUserId":10135,"description":"","friendlyURL":"/agora","groupId":10157,"liveGroupId":0,"name":"Guest","parentGroupId":0,"site":true,"type":1,"typeSettings":""}]'
			]
		});

		scope = $rootScope.$new();

		//store all usefull info in local storage
    	StorageService.store('UserScreenName','testUser');
    	StorageService.store(testUser.screenName,testUser);

    	scope.validUser = true;
		//iCtrl = $controller('IndexCtrl',{$scope: scope});
		//ctrl = $controller('MenuCtrl', {$scope: scope});

	}));

	afterEach(function() {
	  	$httpBackend.verifyNoOutstandingExpectation();
	  	$httpBackend.verifyNoOutstandingRequest();
	});

	it('Testing fetch groups when user is login',inject(function(){

		//expect(scope.groups).not.toBe(undefined);
	}));

});