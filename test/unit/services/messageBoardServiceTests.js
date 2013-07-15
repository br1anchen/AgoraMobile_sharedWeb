'use strict';

describe('MessageBoardService',function(){

	var StorageService;
	var $httpBackend;
	//test user info
	var testUser = {
      	screenName : "testUser",
      	userId : "",
      	auth : "Basic dGVzdFVzZXI6ZGVtbw==",
      	companyId : "10132"
   	};

	beforeEach(module('app.messageBoardService'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector){
		$httpBackend = $injector.get('$httpBackend');

		//Invalid auth token by test user info
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/mbcategory/get-categories/group-id/10157'
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
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/mbcategory/get-categories/group-id/10157'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return[200,
					'[{"categoryId":11931,"companyId":10132,"createDate":1314792066451,"description":"Her kan brukerne skrive inn forbedringsforslag og endringsønsker til Agora.","displayStyle":"default","groupId":10157,"lastPostDate":1371491114962,"messageCount":45,"modifiedDate":1314792066451,"name":"Endringsønsker","parentCategoryId":0,"threadCount":13,"userId":10169,"userName":"UniNett Admin","uuid":"321bf0e1-7bc3-4164-ac22-7e13fec1f946"},{"categoryId":19297,"companyId":10132,"createDate":1322661740355,"description":"","displayStyle":"default","groupId":10157,"lastPostDate":1351889594877,"messageCount":8,"modifiedDate":1322661740355,"name":"FAQ - spørsmål og svar","parentCategoryId":0,"threadCount":4,"userId":10932,"userName":"Bernt Skjemstad","uuid":"e4925384-4b08-4fed-8a94-7bd457e20865"},{"categoryId":194306,"companyId":10132,"createDate":1355906188633,"description":"Nyheter fra og på Agora.","displayStyle":"default","groupId":10157,"lastPostDate":1365769551184,"messageCount":5,"modifiedDate":1355906188633,"name":"Nyheter","parentCategoryId":0,"threadCount":5,"userId":10932,"userName":"Bernt Skjemstad","uuid":"0d51b124-5db6-455e-a6d9-35456706c741"}]'
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

	it('Testing fetch message board categories first time',inject(function(MessageBoardService){

		var categories;

		var promise = MessageBoardService.fetchCategories(10157);

		promise.then(function(rep){
			categories = MessageBoardService.getCategories();
		});

		$httpBackend.flush();
		expect(categories.length).toBe(3);
	}));

	it('Testing after fetch message board categories and store them',inject(function(MessageBoardService,StorageService){

		var categoryIds;

		var promise = MessageBoardService.fetchCategories(10157);

		promise.then(function(rep){
			categoryIds = StorageService.get("Group10157_CategoryIDs");
		});

		$httpBackend.flush();
		expect(categoryIds.length).toBe(3);
	}));

});