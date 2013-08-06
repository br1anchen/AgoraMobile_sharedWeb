'use strict';

describe('WikiPageService',function(){

	var StorageService;
	var $httpBackend,$http;
	var AppService;
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
		AppService = $injector.get('AppService');

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/wikinode/get-node/group-id/10157/name/Main'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			'{"companyId":10132,"createDate":1314001663462,"description":"","groupId":10157,"lastPostDate":1369381022212,"modifiedDate":1314001663462,"name":"Main","nodeId":10758,"userId":10169,"userName":"UniNett Admin","uuid":"a0a8a9be-ca4a-4a46-9516-d5b1bb73f928"}'
        			]
        });

    	$httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/wikipage/get-node-pages/node-id/10758/max/100'
    	,function(headers){
    		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			JSON.stringify(wikipagesRep)
        			]
        });

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/wikipage/get-page/node-id/10758/title/Dokumenter'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			JSON.stringify(
        				{
							companyId: 10132,
							content: "",
							createDate: 1369294770449,
							format: "html",
							groupId: 10157,
							modifiedDate: 1369294770449,
							nodeId: 10758,
							pageId: 241067,
							parentTitle: "",
							redirectTitle: "",
							resourcePrimKey: 205332,
							status: 0,
							statusByUserId: 10000,
							statusByUserName: "",
							statusDate: 1369294770487,
							summary: "",
							title: "Dokumenter",
							userId: 10000,
							userName: "",
							version: 1.1,
        			})
        			]
        });

		StorageService = $injector.get('StorageService');

		//store all usefull info in local storage
    	StorageService.store('User',testUser);

	}));

	afterEach(function() {
	  	$httpBackend.verifyNoOutstandingExpectation();
	  	$httpBackend.verifyNoOutstandingRequest();
	});

	it('Testing fetch wiki pages and generate wiki content tree',inject(function(WikiPageService,StorageService){
		var treeHolder;

		var promise = WikiPageService.getWikiContentTree({id:10157});

		promise.then(function(rep){
			treeHolder = rep;
		});

		$httpBackend.flush();
		expect(treeHolder.contentTree.length).toBe(1);
		expect(treeHolder.contentTree[0].childrenNodes.length).toBe(4);
		expect(treeHolder.contentTree[0].title).toBe("Tavle - Start");
		expect(StorageService.get('Group10157_WikiMainNode').nodeId).toBe(10758);

	}));

	it('Testing fetch single wiki page and store it', inject(function(WikiPageService){
		var pageHolder;

		var promise = WikiPageService.getWikiPage({id:10157},10758,"Dokumenter");

		promise.then(function(rep){
			pageHolder = rep;
		});

		$httpBackend.flush();

		expect(pageHolder.page.version).toBe(1.1);

		var storedPage = StorageService.get("Group10157_WikiPageTitle:Dokumenter");
		expect(storedPage.version).toBe(1.1);

	}));

});