'use strict';

describe('GroupService',function(){

	var groupService;
	var $httpBackend;
	var auth = "Basic dGVzdFVzZXI6ZGVtbw==";

	beforeEach(module('app.groupService'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector){
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

	}));

	afterEach(function() {
	  	$httpBackend.verifyNoOutstandingExpectation();
	  	$httpBackend.verifyNoOutstandingRequest();
	});

	it('Testing fetch groups request with first time correct authentication',inject(function(GroupService,StorageService){
		
		//delete all the groups data
		StorageService.remove("GroupIDs");

		//fetch request
		var promise = GroupService.fetchGroups(auth);

		var validUser;
		promise.then(function(){
			validUser = true;
		});

		$httpBackend.flush();
		expect(validUser).toBe(true);

	}));

	it('Tesing fetch groups and store groups to local storage',inject(function(GroupService,StorageService){
		
		//delete all the groups data
		StorageService.remove("GroupIDs");

		//fetch request
		var promise = GroupService.fetchGroups(auth);
		var store;

		promise.then(function(rep){
			store = GroupService.requestStorage(rep);
		});

		$httpBackend.flush();
		expect(store).toBe('stored');
	}));

	it('Tesing not fetch groups because groups is stored',inject(function(GroupService,StorageService){

		//delete all the groups data
		StorageService.remove("GroupIDs");

		//fetch request
		var promise = GroupService.fetchGroups(auth);
		var store;

		promise.then(function(rep){
			store = GroupService.requestStorage(rep);
		});

		$httpBackend.flush();

		//fetch request again
		var fetchAgain = GroupService.fetchGroups(auth);

		var fetched;
		fetchAgain.then(function(){
			fetched = true;
		});

		expect(fetched).toBe(undefined);

	}));
});