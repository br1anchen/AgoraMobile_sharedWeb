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

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-group-file-entries-count/group-id/250926/user-id/0'
    	,function(headers){
    		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			5
        			]
        });

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-group-file-entries/group-id/250926/user-id/0/root-folder-id/0/start/0/end/5'
    	,function(headers){
    		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			[{"companyId":10132,"createDate":1375089398512,"custom1ImageId":0,"custom2ImageId":0,"description":"","extension":"txt","extraSettings":"","fileEntryId":345052,"fileEntryTypeId":0,"folderId":345001,"groupId":250926,"largeImageId":0,"mimeType":"text/plain","modifiedDate":1375089398512,"name":"14345","readCount":0,"repositoryId":250926,"size":776,"smallImageId":0,"title":"filesApi.txt","userId":250919,"userName":"Xiao Chen","uuid":"3a6986e9-7a09-423d-8e87-78f56ed910f7","version":"1.0","versionUserId":250919,"versionUserName":"Xiao Chen"},{"companyId":10132,"createDate":1374563037440,"custom1ImageId":0,"custom2ImageId":0,"description":"","extension":"png","extraSettings":"","fileEntryId":331446,"fileEntryTypeId":0,"folderId":0,"groupId":250926,"largeImageId":0,"mimeType":"image/png","modifiedDate":1374563037440,"name":"13641","readCount":4,"repositoryId":250926,"size":67041,"smallImageId":0,"title":"Capture.PNG","userId":10909,"userName":"Armaz Mellati","uuid":"f4787321-accb-4d03-9d16-d40f93e476be","version":"1.0","versionUserId":10909,"versionUserName":"Armaz Mellati"},{"companyId":10132,"createDate":1372065165184,"custom1ImageId":0,"custom2ImageId":0,"description":"fetch feide-url with redirect (for agora-test)","extension":"sh","extraSettings":"","fileEntryId":257017,"fileEntryTypeId":0,"folderId":0,"groupId":250926,"largeImageId":0,"mimeType":"application/x-shellscript","modifiedDate":1372065165184,"name":"10109","readCount":9,"repositoryId":250926,"size":1507,"smallImageId":0,"title":"login.sh","userId":61756,"userName":"Bjarne Holen","uuid":"73407358-1089-4363-8134-ad7d59915fb2","version":"1.0","versionUserId":61756,"versionUserName":"Bjarne Holen"},{"companyId":10132,"createDate":1372065112979,"custom1ImageId":0,"custom2ImageId":0,"description":"fetch url to feide with redirect (for agora-test)","extension":"sh","extraSettings":"","fileEntryId":257005,"fileEntryTypeId":0,"folderId":257002,"groupId":250926,"largeImageId":0,"mimeType":"application/x-shellscript","modifiedDate":1372065112979,"name":"10108","readCount":3,"repositoryId":250926,"size":1507,"smallImageId":0,"title":"2013.06.24-09.11.52.889_login.sh","userId":10169,"userName":"UNINETT administrator","uuid":"5bfbae68-5739-4a94-8567-8a9525cd4e01","version":"1.0","versionUserId":10169,"versionUserName":"UNINETT administrator"},{"companyId":10132,"createDate":1371740983532,"custom1ImageId":0,"custom2ImageId":0,"description":"Test file","extension":"jpg","extraSettings":"","fileEntryId":256245,"fileEntryTypeId":0,"folderId":0,"groupId":250926,"largeImageId":0,"mimeType":"image/jpeg","modifiedDate":1371740983532,"name":"10010","readCount":6,"repositoryId":250926,"size":392928,"smallImageId":0,"title":"21_p4.jpg","userId":250919,"userName":"Xiao Chen","uuid":"88582868-1c87-4b71-8d6d-f7257557f53d","version":"1.0","versionUserId":250919,"versionUserName":"Xiao Chen"}]
        			]
        });

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-file-entries/repository-id/250926/folder-id/0'
        ,function(headers){
            return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
            return [200,
                    [{"companyId":10132,"createDate":1371740983532,"custom1ImageId":0,"custom2ImageId":0,"description":"Test file","extension":"jpg","extraSettings":"","fileEntryId":256245,"fileEntryTypeId":0,"folderId":0,"groupId":250926,"largeImageId":0,"mimeType":"image/jpeg","modifiedDate":1371740983532,"name":"10010","readCount":26,"repositoryId":250926,"size":392928,"smallImageId":0,"title":"21_p4.jpg","userId":250919,"userName":"Xiao Chen","uuid":"88582868-1c87-4b71-8d6d-f7257557f53d","version":"1.0","versionUserId":250919,"versionUserName":"Xiao Chen"},{"companyId":10132,"createDate":1372065165184,"custom1ImageId":0,"custom2ImageId":0,"description":"fetch feide-url with redirect (for agora-test)","extension":"sh","extraSettings":"","fileEntryId":257017,"fileEntryTypeId":0,"folderId":0,"groupId":250926,"largeImageId":0,"mimeType":"application/x-shellscript","modifiedDate":1372065165184,"name":"10109","readCount":23,"repositoryId":250926,"size":1507,"smallImageId":0,"title":"login.sh","userId":61756,"userName":"Bjarne Holen","uuid":"73407358-1089-4363-8134-ad7d59915fb2","version":"1.0","versionUserId":61756,"versionUserName":"Bjarne Holen"},{"companyId":10132,"createDate":1374563037440,"custom1ImageId":0,"custom2ImageId":0,"description":"","extension":"png","extraSettings":"","fileEntryId":331446,"fileEntryTypeId":0,"folderId":0,"groupId":250926,"largeImageId":0,"mimeType":"image/png","modifiedDate":1374563037440,"name":"13641","readCount":46,"repositoryId":250926,"size":67041,"smallImageId":0,"title":"Capture.PNG","userId":10909,"userName":"Armaz Mellati","uuid":"f4787321-accb-4d03-9d16-d40f93e476be","version":"1.0","versionUserId":10909,"versionUserName":"Armaz Mellati"}]
                    ]
        });

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-file-entries/repository-id/250926/folder-id/257002'
        ,function(headers){
            return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
            return [200,
                    [{"companyId":10132,"createDate":1372065112979,"custom1ImageId":0,"custom2ImageId":0,"description":"fetch url to feide with redirect (for agora-test)","extension":"sh","extraSettings":"","fileEntryId":257005,"fileEntryTypeId":0,"folderId":257002,"groupId":250926,"largeImageId":0,"mimeType":"application/x-shellscript","modifiedDate":1372065112979,"name":"10108","readCount":5,"repositoryId":250926,"size":1507,"smallImageId":0,"title":"2013.06.24-09.11.52.889_login.sh","userId":10169,"userName":"UNINETT administrator","uuid":"5bfbae68-5739-4a94-8567-8a9525cd4e01","version":"1.0","versionUserId":10169,"versionUserName":"UNINETT administrator"}]
                    ]
        });

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-file-entries/repository-id/250926/folder-id/345064'
        ,function(headers){
            return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
            return [200,
                    []
                    ]
        });

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/dlapp/get-file-entries/repository-id/250926/folder-id/345001'
        ,function(headers){
            return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
            return [200,
                    [{"companyId":10132,"createDate":1375089398512,"custom1ImageId":0,"custom2ImageId":0,"description":"","extension":"txt","extraSettings":"","fileEntryId":345052,"fileEntryTypeId":0,"folderId":345001,"groupId":250926,"largeImageId":0,"mimeType":"text/plain","modifiedDate":1375089398512,"name":"14345","readCount":5,"repositoryId":250926,"size":776,"smallImageId":0,"title":"filesApi.txt","userId":250919,"userName":"Xiao Chen","uuid":"3a6986e9-7a09-423d-8e87-78f56ed910f7","version":"1.0","versionUserId":250919,"versionUserName":"Xiao Chen"}]
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

    it('Testing fetch all files and folders in directory',inject(function(DocumentService){
        var folderHolder;

        DocumentService.getDirectory({id:250926},0).then(function(rep){
            folderHolder = rep;
        });

        $httpBackend.flush();
        expect(folderHolder.folder.files.length).toBe(3);
        expect(folderHolder.folder.subFolders.length).toBe(2);

        var storedFolder = StorageService.get('Group250926_Folder0');
        expect(storedFolder.files.length).toBe(3);
        expect(storedFolder.subFolders.length).toBe(2);

        DocumentService.getDirectory({id:250926},345001).then(function(rep){
            folderHolder = rep;
        });

        $httpBackend.flush();
        expect(folderHolder.folder.files.length).toBe(1);
        expect(folderHolder.folder.subFolders.length).toBe(0);

        var storedFolder = StorageService.get('Group250926_Folder345001');
        expect(storedFolder.files.length).toBe(1);
        expect(storedFolder.subFolders.length).toBe(0);

    }));

    it('Testing ask one single file to fetch whole directory',inject(function(DocumentService){
        var fileHolder;

        DocumentService.getFile({id:250926},0,'21_p4.jpg').then(function(rep){

            fileHolder = rep;
        })

        $httpBackend.flush();
        var storedFolder = StorageService.get('Group250926_Folder0');
        expect(storedFolder.files.length).toBe(3);
        expect(storedFolder.subFolders.length).toBe(2);
        expect(fileHolder.file.title).toBe('21_p4.jpg');


    }));

});