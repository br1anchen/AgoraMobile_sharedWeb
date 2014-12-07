'use strict';

describe('GroupService',function(){

	var StorageService;
	var $httpBackend;
	var AppService;
	//test user info
	var testUser = {
      	screenName : "testUser",
      	userId : "",
      	auth : "Basic dGVzdFVzZXI6ZGVtbw==",
      	companyId : ""
   	};

	beforeEach(module('app.groupService'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector){
		AppService = $injector.get('AppService');
		$httpBackend = $injector.get('$httpBackend');

		//Invalid auth token by test user info
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/group/get-user-places/-class-names/max/10'
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
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/group/get-user-places/-class-names/max/10'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return [200,
			'[{"active":true,"classNameId":10012,"classPK":250926,"companyId":10132,"creatorUserId":10169,"description":"","friendlyURL":"/agora-app","groupId":250926,"liveGroupId":0,"name":"Agora App","parentGroupId":0,"site":true,"type":3,"typeSettings":""},{"active":true,"classNameId":10024,"classPK":210594,"companyId":10132,"creatorUserId":10135,"description":"","friendlyURL":"/ekstern","groupId":210595,"liveGroupId":0,"name":"Ekstern LFR_ORGANIZATION","parentGroupId":0,"site":false,"type":3,"typeSettings":""},{"active":true,"classNameId":10012,"classPK":10157,"companyId":10132,"creatorUserId":10135,"description":"","friendlyURL":"/agora","groupId":10157,"liveGroupId":0,"name":"Guest","parentGroupId":0,"site":true,"type":1,"typeSettings":""}]'
			]
		});

		StorageService = $injector.get('StorageService');

    	//store all usefull info in local storage
    	StorageService.store('User',testUser);

	}));

	afterEach(function() {
	  	$httpBackend.verifyNoOutstandingExpectation();
	  	$httpBackend.verifyNoOutstandingRequest();

	  	StorageService.clear();
	});

	it('Testing getGroups with first time correct authentication',inject(function(GroupService){	

		//fetch groups
		var groupsHolder;
		var promise = GroupService.getGroups();
		promise.then(function(rep){
			groupsHolder = rep;
		});

		$httpBackend.flush();
		expect(groupsHolder.groups).not.toBe(undefined);

	}));

	it('Tesing store groups to local storage',inject(function(GroupService,StorageService){

    	//get groups
    	var topGroup;
		var promise = GroupService.getGroups();
		promise.then(function(rep){
			topGroup = StorageService.get('TopGroup');
		});

		$httpBackend.flush();
		expect(topGroup).not.toBe(undefined);
	}));


	it('Testing updateGroups',inject(function(GroupService,StorageService){
		GroupService.getGroups().then(function(groupsHolder){
			var initialNumberOfGroups = groupsHolder.groups.length;
			groupsHolder.groups.pop();
			expect(groupsHolder.groups.length).toBe(initialNumberOfGroups-1);
			
			StorageService.store('groups',groupsHolder.groups)

			GroupService.updateGroups().then(function(){
				expect(groupsHolder.groups.length).toBe(initialNumberOfGroups);
			})
		})
		$httpBackend.flush();
	}));


});