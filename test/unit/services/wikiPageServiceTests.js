'use strict';

describe('WikiPageService',function(){

	var StorageService;
	var $httpBackend,$http;
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
		$http = $injector.get('$http');

        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/wikinode/get-node/group-id/10157/name/Main'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			'{"companyId":10132,"createDate":1314001663462,"description":"","groupId":10157,"lastPostDate":1369381022212,"modifiedDate":1314001663462,"name":"Main","nodeId":10758,"userId":10169,"userName":"UniNett Admin","uuid":"a0a8a9be-ca4a-4a46-9516-d5b1bb73f928"}'
        			]
        });

    	$httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/wikipage/get-node-pages/node-id/10758/max/100'
    	,function(headers){
    		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			JSON.stringify(wikipagesRep)
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

	it('Testing fetch message board categories first time',inject(function(WikiPageService,StorageService){

		var mainNode;

		var promise = WikiPageService.fetchMainNode(10157);

		promise.then(function(rep){
			mainNode = WikiPageService.getMainNode();
		});

		$httpBackend.flush();
		expect(mainNode.groupId).toBe(10157);
		expect(StorageService.get('Group10157_WikiNode' + mainNode.nodeId)).not.toBe(undefined);
	}));

	it('Testing fetch pages under main node',inject(function(WikiPageService){
		var pages;

		var promise = WikiPageService.fetchMainNode(10157);

		promise.then(function(rep){
			WikiPageService.fetchWikiPages(10758).then(function(rep){
				pages = WikiPageService.getWikiPages();
			});
		});

		$httpBackend.flush();
		expect(pages.length).toBe(17);
	}));

	it('Testing after refactory pages and store them',inject(function(WikiPageService,StorageService){
		var page;

		var promise = WikiPageService.fetchMainNode(10157);

		promise.then(function(rep){
			WikiPageService.fetchWikiPages(10758).then(function(rep){
				page = StorageService.get("Group10157_WikiPageTitle:Tavle - Start");
			});
		});

		$httpBackend.flush();
		expect(page.childrenPagesTitle.length).toBe(4);

		page = StorageService.get("Group10157_WikiPageTitle:Dokumenter");
		expect(page.childrenPagesTitle.length).toBe(3);
	}));

});