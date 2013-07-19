'use strict';

describe('WikiPageService',function(){

	var StorageService;
	var $httpBackend;
	//test user info
	var testUser = {
      	screenName : "testUser",
      	userId : "",
      	auth : "Basic dGVzdFVzZXI6ZGVtbw==",
      	companyId : "10132"
   	};

	beforeEach(module('app.wikiPageService'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector){
		$httpBackend = $injector.get('$httpBackend');

        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/wikinode/get-node/group-id/10157/name/Main'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			'{"companyId":10132,"createDate":1314001663462,"description":"","groupId":10157,"lastPostDate":1369381022212,"modifiedDate":1314001663462,"name":"Main","nodeId":10758,"userId":10169,"userName":"UniNett Admin","uuid":"a0a8a9be-ca4a-4a46-9516-d5b1bb73f928"}'
        			]
        });

		StorageService = $injector.get('StorageService');

		//store all usefull info in local storage
    	StorageService.store('UserScreenName','testUser');
    	StorageService.store(testUser.screenName,testUser);

	}));

	afterEach(function() {
	  	$httpBackend.verifyNoOutstandingExpectation();
	  	$httpBackend.verifyNoOutstandingRequest();
	});

	it('Testing fetch message board categories first time',inject(function(WikiPageService){

		var mainNode;

		var promise = WikiPageService.fetchMainNode(10157);

		promise.then(function(rep){
			mainNode = WikiPageService.getMainNode();
		});

		$httpBackend.flush();
		expect(mainNode.groupId).toBe(10157);
	}));

});