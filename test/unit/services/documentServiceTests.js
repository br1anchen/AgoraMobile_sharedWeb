'use strict';

describe('DocumentService',function(){

	var StorageService,AppService;
	var $httpBackend;
	//test user info
	var testUser = {
      	screenName : "testUser",
      	userId : "",
      	auth : "Basic dGVzdFVzZXI6ZGVtbw==",
      	companyId : "10132"
   	};

	beforeEach(module('app.documentService'));
	beforeEach(module('app.storageService'));
	beforeEach(module('app.appService'));

	beforeEach(inject(function($injector){
		$httpBackend = $injector.get('$httpBackend');
		AppService = $injector.get('AppService');

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-folders/repository-id/250926/parent-folder-id/0'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			[{"companyId":10132,"createDate":1372065112913,"defaultFileEntryTypeId":0,"description":"Papirkurv","folderId":257002,"groupId":250926,"lastPostDate":1375088523781,"modifiedDate":1372065112913,"mountPoint":false,"name":"Papirkurv","overrideFileEntryTypes":false,"parentFolderId":0,"repositoryId":250926,"userId":10169,"userName":"","uuid":"7bc1f5cb-85be-4bca-8dde-278df4ac9937"},{"companyId":10132,"createDate":1375089765078,"defaultFileEntryTypeId":0,"description":"","folderId":345064,"groupId":250926,"lastPostDate":null,"modifiedDate":1375089765078,"mountPoint":false,"name":"Test","overrideFileEntryTypes":false,"parentFolderId":0,"repositoryId":250926,"userId":250919,"userName":"","uuid":"6b4b5d6a-fa99-42fe-9ebe-714247fc38d5"}]
        			]
        });

    	$httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-folders/repository-id/250926/parent-folder-id/257002'
    	,function(headers){
    		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			[{"companyId":10132,"createDate":1375088523781,"defaultFileEntryTypeId":0,"description":"","folderId":345001,"groupId":250926,"lastPostDate":1375089398512,"modifiedDate":1375088523781,"mountPoint":false,"name":"DemoFolder","overrideFileEntryTypes":false,"parentFolderId":257002,"repositoryId":250926,"userId":250919,"userName":"","uuid":"51686674-57c6-4634-93d3-dc6a9975911c"}]
        			]
        });

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-folders/repository-id/250926/parent-folder-id/345064'
    	,function(headers){
    		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			[]
        			]
        });

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-folders/repository-id/250926/parent-folder-id/345001'
    	,function(headers){
    		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			[]
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

	it('Testing fetch folders and refacotry them',inject(function(DocumentService){
		var folderTree;

		DocumentService.fetchFolders(250926);

		$httpBackend.flush();
		folderTree = DocumentService.getFolders();
		dump(folderTree)
		expect(folderTree).not.toBe(undefined);
	}));

});