'use strict';

/* jasmine specs for services go here */

describe('AgoraService', function() {

	var agoraService;
	var $httpBackend;
	var $q;

	
	beforeEach(module('app.agoraService'));

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
        .respond(200,'{"exception":"Invalid authentication token"}'); 

		// //Valid login for Brian
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/company/get-company-by-virtual-host/virtual-host/agora.uninett.no',function(headers){
        	return headers['Authorization'] == 'Basic YnIxYW5jaGVuOkFwdHg0ODY5' ? true :false
        })
		.respond(function(){return [200,'{"status":0,"id":0,"data":{"accountId":10134,"active":true,"companyId":10132,"homeURL":"/group/agora/home","key":null,"logoId":10701,"maxUsers":0,"mx":"uninett.no","system":false,"webId":"liferay.com"}}']});
	}))

	afterEach(function() {
	  $httpBackend.verifyNoOutstandingExpectation();
	  $httpBackend.verifyNoOutstandingRequest();
	});

	it('should try to login the user, returning a promise object beenin resolved or rejected.',inject(function(AgoraService){
		var promise = AgoraService.login('br1anchen','Aptx4869');
		promise.then(function(){
			// expect(true).toBe(false);
			dump('success');
		},
		function(){
			// expect(true).toBe(false);
			dump('feilet');
		})
		// var promise = AgoraService.login('br1anchen','Apt');
		$httpBackend.flush();
		expect(promise).not.toBe(undefined);

		// promise.then(function(){
			
		// },
		// function(){
		// 	// dump('isEmpty:'+_.isEmpty(promise));
		// })

		

	// 	// promise = AgoraService.login('br1anchen','Aptx48');
	}));

	// it('should try to login the user, returning a promise object beenin resolved or rejected.',inject(function(AgoraService){
	// 	$httpBackend.flush();		
	// }))
	


	// describe('version', function() {
	// 	it('should return current version', inject(function(version) {
	// 	  expect(version).toEqual('0.1');
	// 	}));
	// });
});
