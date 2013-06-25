"use strict"

/* jasmine specs for services go here */

describe('Testing ActivityService', function() {

	var $httpBackend;
	
	beforeEach(module('app.activityService'));
	beforeEach(module('app.loginService'));
	beforeEach(module('app.HTTPService'));

	beforeEach(inject(function($injector){
		$httpBackend = $injector.get('$httpBackend');
		//No Authorization header
		$httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no',function(headers){
        	return headers['Authorization'] == undefined ? true :false
        })
        .respond(
        	401,
        	'<html><head><title>Apache Tomcat/7.0.27 - Error report</title><style><!--H1 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:22px;} H2 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:16px;} H3 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:14px;} BODY {font-family:Tahoma,Arial,sans-serif;color:black;background-color:white;} B {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;} P {font-family:Tahoma,Arial,sans-serif;background:white;color:black;font-size:12px;}A {color : black;}A.name {color : black;}HR {color : #525D76;}--></style> </head><body><h1>HTTP Status 401 - </h1><HR size="1" noshade="noshade"><p><b>type</b> Status report</p><p><b>message</b> <u></u></p><p><b>description</b> <u>This request requires HTTP authentication ().</u></p><HR size="1" noshade="noshade"><h3>Apache Tomcat/7.0.27</h3></body></html>',
        	{'WWW-Authenticate': 'Basic realm="PortalRealm"'}
    	);

		// //Invalid auth token
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no',function(headers){
        	return headers['Authorization'] != 'Basic YnIxYW5jaGVuOkFwdHg0ODY5' ? true :false
        })
        .respond(401,'{"exception":"Invalid authentication token"}',{'WWW-Authenticate': 'Basic realm="PortalRealm"'}); 

		// //Valid login for Brian
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no',function(headers){
        	return headers['Authorization'] == 'Basic YnIxYW5jaGVuOkFwdHg0ODY5' ? true :false
        })
		.respond(function(){return [200,'{"status":0,"id":0,"data":{"accountId":10134,"active":true,"companyId":10132,"homeURL":"/group/agora/home","key":null,"logoId":10701,"maxUsers":0,"mx":"uninett.no","system":false,"webId":"liferay.com"}}']});

		//TODO: Define backend for requests done implicitly by ActivityService
	}))

	beforeEach(inject(function($injector){
		LoginService = $injector.get('LoginService');
		//Making sure the user is logged in
		LoginService.login('br1anchen','Aptx4869');
		$httpBackend.flush();
	}))


	afterEach(function() {
	  $httpBackend.verifyNoOutstandingExpectation();
	  $httpBackend.verifyNoOutstandingRequest();
	});

	it('Should test if the HTTPService.request is called',inject(function(HTTPService,ActivityService){
		//TODO spy on HTTPService
	}));

	it('Should test if the GET request is done',function(ActivityService){
		//$httpBackend.expectGET...
	})

	it('Should test if the ActivityService.getActivities() returns a promise',function(){

	})

	it('Shold test if the promise returns a valid data structure when resolved',function(ActivityService){
		/*TODO
			var groupNr = hardcoded to valid GroupID for that user in the Agora service
			var promise = ActivityService.getActivities(groupNr);
			promise.then(function(data){
				//Testing the data returned
				expect(data.name).not.toBe(undefined);
				expect(data.name).not.toBe("");

				expect(data.groupId).not.toBe(undefined);
				expect(data.groupId).not.toBe("");
				
				expect(data.className).not.toBe(undefined);
				expect(data.className).not.toBe("");
				
				expect(data.classPK).not.toBe(undefined);
				expect(data.classPK).not.toBe("");
				
				expect(data.timestamp).not.toBe(undefined);
				expect(data.timestamp).not.toBe("");

				expect(data.involved).not.toBe(undefined);
				expect(data.involved).not.toBe("");

				expect(data.pictureURL).not.toBe(undefined);
				expect(data.pictureURL).not.toBe("");
			},
			function(reason){
				//Something whent wrong if the promise is rejected... Triggering test failure
				dump(JSON.stringify(reason))
				expect(true).toBe(false);
			})
		*/
	})
});
