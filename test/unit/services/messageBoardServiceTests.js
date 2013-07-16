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

        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/mbthread/get-threads/group-id/10157/category-id/11931/status/0/start/0/end/20'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return[200,
					'[{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":174039,"lastPostDate":1371491114962,"messageCount":5,"priority":0.0,"question":false,"rootMessageId":201429,"rootMessageUserId":11076,"status":0,"statusByUserId":11076,"statusByUserName":"Alf Hansen","statusDate":1359628293781,"threadId":201430,"viewCount":51},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10932,"lastPostDate":1371114776753,"messageCount":2,"priority":0.0,"question":false,"rootMessageId":252483,"rootMessageUserId":197854,"status":0,"statusByUserId":197854,"statusByUserName":"Jørn Aslaksen","statusDate":1371114554458,"threadId":252484,"viewCount":5},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10932,"lastPostDate":1355297517420,"messageCount":2,"priority":0.0,"question":true,"rootMessageId":16195,"rootMessageUserId":12687,"status":0,"statusByUserId":12687,"statusByUserName":"Ingrid Melve","statusDate":1318944869414,"threadId":16196,"viewCount":79},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10932,"lastPostDate":1355297338226,"messageCount":4,"priority":0.0,"question":true,"rootMessageId":187600,"rootMessageUserId":12459,"status":0,"statusByUserId":12459,"statusByUserName":"Simon Skrødal","statusDate":1354643750575,"threadId":187601,"viewCount":28},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10932,"lastPostDate":1329904471961,"messageCount":2,"priority":0.0,"question":false,"rootMessageId":27843,"rootMessageUserId":20118,"status":0,"statusByUserId":20118,"statusByUserName":"Rolf Sture Normann","statusDate":1329904250718,"threadId":27844,"viewCount":33},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10932,"lastPostDate":1322467867213,"messageCount":10,"priority":0.0,"question":false,"rootMessageId":12750,"rootMessageUserId":11308,"status":0,"statusByUserId":11308,"statusByUserName":"Bjørn Helge Kopperud","statusDate":1315302329525,"threadId":12751,"viewCount":127},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10932,"lastPostDate":1322467813555,"messageCount":2,"priority":0.0,"question":false,"rootMessageId":17008,"rootMessageUserId":11076,"status":0,"statusByUserId":11076,"statusByUserName":"Alf Hansen","statusDate":1321018893918,"threadId":17009,"viewCount":29},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10932,"lastPostDate":1318424611734,"messageCount":4,"priority":0.0,"question":true,"rootMessageId":15370,"rootMessageUserId":12687,"status":0,"statusByUserId":12687,"statusByUserName":"Ingrid Melve","statusDate":1318317616421,"threadId":15371,"viewCount":61},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10932,"lastPostDate":1318415367365,"messageCount":2,"priority":0.0,"question":true,"rootMessageId":15380,"rootMessageUserId":12687,"status":0,"statusByUserId":12687,"statusByUserName":"Ingrid Melve","statusDate":1318317774560,"threadId":15381,"viewCount":45},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10909,"lastPostDate":1316546120712,"messageCount":3,"priority":0.0,"question":false,"rootMessageId":13666,"rootMessageUserId":11308,"status":0,"statusByUserId":11308,"statusByUserName":"Bjørn Helge Kopperud","statusDate":1315942525972,"threadId":13667,"viewCount":33},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":11308,"lastPostDate":1315942631762,"messageCount":4,"priority":0.0,"question":true,"rootMessageId":12779,"rootMessageUserId":12687,"status":0,"statusByUserId":12687,"statusByUserName":"Ingrid Melve","statusDate":1315315495971,"threadId":12780,"viewCount":47},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":11308,"lastPostDate":1315942440734,"messageCount":3,"priority":0.0,"question":false,"rootMessageId":13594,"rootMessageUserId":11308,"status":0,"statusByUserId":11308,"statusByUserName":"Bjørn Helge Kopperud","statusDate":1315902124808,"threadId":13595,"viewCount":35},{"categoryId":11931,"companyId":10132,"groupId":10157,"lastPostByUserId":10909,"lastPostDate":1315248672670,"messageCount":2,"priority":0.0,"question":false,"rootMessageId":12454,"rootMessageUserId":11308,"status":0,"statusByUserId":11308,"statusByUserName":"Bjørn Helge Kopperud","statusDate":1315223268211,"threadId":12455,"viewCount":40}]'
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

	it('Testing fetch threads by category ID',inject(function(MessageBoardService){

		var threads;

		var promise = MessageBoardService.fetchCategories(10157);

		promise.then(function(rep){
			MessageBoardService.fetchThreads(10157,11931).then(function(rep){
				threads = MessageBoardService.getThreadsByCat(11931);
			});
		});

		$httpBackend.flush();
		expect(threads.length).toBe(13);
	}));

});