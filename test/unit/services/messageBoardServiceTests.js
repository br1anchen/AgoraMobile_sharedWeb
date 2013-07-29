'use strict';

describe('MessageBoardService',function(){

	var StorageService;
	var $httpBackend;
	var AppService;
	//test user info
	var testUser = {
      	screenName : "testUser",
      	userId : "",
      	auth : "Basic dGVzdFVzZXI6ZGVtbw==",
      	companyId : "10132"
   	};

   	var rootMsgIds = [177520,42659,27783,19299];
   	var rootMsgs = ['{"allowPingbacks":true,"anonymous":false,"answer":false,"attachments":false,"body":"Dette skyldes en bug i IE8 og tidligere versjoner ved nedlasting av filer over HTTPS.\n[url=http://support.microsoft.com/kb/323308]http://support.microsoft.com/kb/323308[/url]\n\nDer finner man blant annet følgende : \n[quote][left][size=4][color=#333333]Internet Explorer 7 and Internet Explorer 8[/color][/size][/left][left][color=#333333][size=3]To resolve this issue in Internet Explorer 7 and in Internet Explorer 8, follow these steps:[/size][/color][/left][list=1][left][color=#333333][font=\'Segoe UI\',Arial,Verdana,Tahoma,sans-serif][size=3]\n[/size][/color][/left]\n[*]Start Registry Editor.\n[*]For a per-user setting, locate the following registry key:HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet SettingsFor a per-computer setting, locate the following registry key:HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\n[*]On the [b]Edit[/b] menu, click [b]Add Value[/b].\n[*]To override the directive for HTTPS connections, add the following registry value:\"BypassSSLNoCacheCheck\"=Dword:00000001To override the directive for HTTP connections, add the following registry value:\"BypassHTTPNoCacheCheck\"=Dword:00000001\n[*]Quit Registry Editor.\n[/list][/quote]\nDette er derimot ikke noe man bør prøve på selv, men lokal IT burde gjøre dette.\n\nVi skal gjøre et forsøk for å se om vi kan \"tilpasse\" Agora rundt denne svakheten i IE8. \n\nMen egentlig, det beste ville har vært å bruke en nyere web-leser enn IE8\n og denne anbefalingen gjelder ikke bare for Agora ;)","categoryId":19297,"classNameId":0,"classPK":0,"companyId":10132,"createDate":1351636352241,"format":"bbcode","groupId":10157,"messageId":177520,"modifiedDate":1351636418027,"parentMessageId":0,"priority":0.0,"rootMessageId":177520,"status":0,"statusByUserId":10909,"statusByUserName":"Armaz Mellati","statusDate":1351636418041,"subject":"Problem med nedlasting av filer fra IE8 ?","threadId":177521,"userId":10909,"userName":"Armaz Mellati","uuid":"fa0bf72c-71b2-4dd5-be9e-4cbbfd9e5ff9"}',
   					'{"allowPingbacks":false,"anonymous":false,"answer":false,"attachments":false,"body":"Er det noen muligheter for å slette \"Talve - Start\"? Evt å gi den et nytt navn? Jeg har opprettet flere tavle-sider og ønsker at en av de andre skal komme opp som standard når man går til \"Tavle\".\n\n- Tom J.","categoryId":19297,"classNameId":0,"classPK":0,"companyId":10132,"createDate":1337588936967,"format":"bbcode","groupId":10157,"messageId":42659,"modifiedDate":1337588958721,"parentMessageId":0,"priority":0.0,"rootMessageId":42659,"status":0,"statusByUserId":19673,"statusByUserName":"Tom Josefsen","statusDate":1337588958780,"subject":"Tavle - Start","threadId":42660,"userId":19673,"userName":"Tom Josefsen","uuid":"453b41fe-614b-418c-839e-a5fbd22ca7bc"}',
   					'{"allowPingbacks":true,"anonymous":false,"answer":false,"attachments":false,"body":"Er det begrensninger på hvor mange dokumenter og mapper en kan lagre for en gruppe? Er det noen typer dokumenter (.pdf, .doc, .odt etc.) som systemet ikke takler?\n\n- Ragnar","categoryId":19297,"classNameId":0,"classPK":0,"companyId":10132,"createDate":1329827829938,"format":"bbcode","groupId":10157,"messageId":27783,"modifiedDate":1329827893061,"parentMessageId":0,"priority":0.0,"rootMessageId":27783,"status":0,"statusByUserId":27229,"statusByUserName":"Ragnar Pedersen","statusDate":1329827893077,"subject":"Dokumenter","threadId":27784,"userId":27229,"userName":"Ragnar Pedersen","uuid":"18d8dad8-6308-415c-bdf8-ef51e47a1afa"}',
   					'{"allowPingbacks":true,"anonymous":false,"answer":false,"attachments":false,"body":"[b]Hvordan kan jeg redigere profilen min i Agora (f.eks. bilde)?[/b]\n\n[indent][i]Agora henter all sin informasjon om brukere fra Feide. Med andre ord må du høre med lokal IT ved din institusjon dersom du ønsker å gjøre endringer på dette, inkl. bilde - som også hentes fra Feide.[/i][/indent]","categoryId":19297,"classNameId":0,"classPK":0,"companyId":10132,"createDate":1322661806172,"format":"bbcode","groupId":10157,"messageId":19299,"modifiedDate":1322661831953,"parentMessageId":0,"priority":0.0,"rootMessageId":19299,"status":0,"statusByUserId":10932,"statusByUserName":"Bernt Skjemstad","statusDate":1322661831969,"subject":"Redigere egen profil","threadId":19300,"userId":10932,"userName":"Bernt Skjemstad","uuid":"431d104a-050e-4004-80e3-0e09d3299d34"}'];

	beforeEach(module('app.messageBoardService'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector){
		AppService = $injector.get('AppService');
		$httpBackend = $injector.get('$httpBackend');

		//Invalid auth token by test user info
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/mbcategory/get-categories/group-id/10157'
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
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/mbcategory/get-categories/group-id/10157'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return[200,
					'[{"categoryId":11931,"companyId":10132,"createDate":1314792066451,"description":"Her kan brukerne skrive inn forbedringsforslag og endringsønsker til Agora.","displayStyle":"default","groupId":10157,"lastPostDate":1371491114962,"messageCount":45,"modifiedDate":1314792066451,"name":"Endringsønsker","parentCategoryId":0,"threadCount":13,"userId":10169,"userName":"UniNett Admin","uuid":"321bf0e1-7bc3-4164-ac22-7e13fec1f946"},{"categoryId":19297,"companyId":10132,"createDate":1322661740355,"description":"","displayStyle":"default","groupId":10157,"lastPostDate":1351889594877,"messageCount":8,"modifiedDate":1322661740355,"name":"FAQ - spørsmål og svar","parentCategoryId":0,"threadCount":4,"userId":10932,"userName":"Bernt Skjemstad","uuid":"e4925384-4b08-4fed-8a94-7bd457e20865"},{"categoryId":194306,"companyId":10132,"createDate":1355906188633,"description":"Nyheter fra og på Agora.","displayStyle":"default","groupId":10157,"lastPostDate":1365769551184,"messageCount":5,"modifiedDate":1355906188633,"name":"Nyheter","parentCategoryId":0,"threadCount":5,"userId":10932,"userName":"Bernt Skjemstad","uuid":"0d51b124-5db6-455e-a6d9-35456706c741"}]'
				]
		});

        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/mbthread/get-threads/group-id/10157/category-id/19297/status/0/start/0/end/20'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return[200,
					'[{"categoryId":19297,"companyId":10132,"groupId":10157,"lastPostByUserId":10909,"lastPostDate":1351889594877,"messageCount":2,"priority":0.0,"question":false,"rootMessageId":177520,"rootMessageUserId":10909,"status":0,"statusByUserId":10909,"statusByUserName":"Armaz Mellati","statusDate":1351636418041,"threadId":177521,"viewCount":23},{"categoryId":19297,"companyId":10132,"groupId":10157,"lastPostByUserId":10169,"lastPostDate":1337591935229,"messageCount":2,"priority":0.0,"question":true,"rootMessageId":42659,"rootMessageUserId":19673,"status":0,"statusByUserId":19673,"statusByUserName":"Tom Josefsen","statusDate":1337588958780,"threadId":42660,"viewCount":38},{"categoryId":19297,"companyId":10132,"groupId":10157,"lastPostByUserId":27229,"lastPostDate":1331892311218,"messageCount":3,"priority":0.0,"question":false,"rootMessageId":27783,"rootMessageUserId":27229,"status":0,"statusByUserId":27229,"statusByUserName":"Ragnar Pedersen","statusDate":1329827893077,"threadId":27784,"viewCount":76},{"categoryId":19297,"companyId":10132,"groupId":10157,"lastPostByUserId":10932,"lastPostDate":1322661831969,"messageCount":1,"priority":0.0,"question":false,"rootMessageId":19299,"rootMessageUserId":10932,"status":0,"statusByUserId":10932,"statusByUserName":"Bernt Skjemstad","statusDate":1322661831969,"threadId":19300,"viewCount":49}]'
				]
		});
		
		for(var index = 0; index < 4; index ++){
			var ct = index;
			$httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/mbmessage/get-message/message-id/'+rootMsgIds[index]
	        	,function(headers){
	        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
	        })
			.respond(function(){
				return[200,
						rootMsgs[ct].replace(/\n/g, "\\\\n")
					]
			});
		}

		$httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/mbmessage/get-thread-messages/group-id/10157/category-id/19297/thread-id/19300/status/0/start/0/end/20'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [200,
        			'[{"allowPingbacks":true,"anonymous":false,"answer":false,"attachments":false,"body":"[b]Hvordan kan jeg redigere profilen min i Agora (f.eks. bilde)?[/b]<br /><br />[indent][i]Agora henter all sin informasjon om brukere fra Feide. Med andre ord må du høre med lokal IT ved din institusjon dersom du ønsker å gjøre endringer på dette, inkl. bilde - som også hentes fra Feide.[/i][/indent]","categoryId":19297,"classNameId":0,"classPK":0,"companyId":10132,"createDate":1322661806172,"format":"bbcode","groupId":10157,"messageId":19299,"modifiedDate":1322661831953,"parentMessageId":0,"priority":0.0,"rootMessageId":19299,"status":0,"statusByUserId":10932,"statusByUserName":"Bernt Skjemstad","statusDate":1322661831969,"subject":"Redigere egen profil","threadId":19300,"userId":10932,"userName":"Bernt Skjemstad","uuid":"431d104a-050e-4004-80e3-0e09d3299d34"}]'
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
			MessageBoardService.fetchThreads(10157,19297).then(function(rep){
				threads = MessageBoardService.getThreads();
			});
		});

		$httpBackend.flush();
		expect(threads.length).toBe(4);
	}));

	it('Testing after fetched threads by category ID and store them',inject(function(MessageBoardService,StorageService){

		var threadIds;

		var promise = MessageBoardService.fetchCategories(10157);

		promise.then(function(rep){
			MessageBoardService.fetchThreads(10157,19297).then(function(rep){
				threadIds = StorageService.get("Category19297_ThreadIDs");
			});
		});

		$httpBackend.flush();
		expect(threadIds.length).toBe(4);

		var category = StorageService.get("Category19297");
		expect(category.threadIds.length).toBe(4);
	}));

	it('Testing fetch messages by threadId&categoryId&groupId',inject(function(MessageBoardService){

		var messages;

		var promise = MessageBoardService.fetchMessages(10157,19297,19300).then(function(rep){
			messages = MessageBoardService.getMessages();
		});
		
		$httpBackend.flush();
		expect(messages.length).toBe(1);
	}));

	it('Testing fetch messages then store them',inject(function(MessageBoardService,StorageService){

		var messageIds;

		var promise = MessageBoardService.fetchMessages(10157,19297,19300).then(function(rep){
			messageIds = StorageService.get("Thread19300_MessageIDs");
		});
		
		$httpBackend.flush();
		expect(messageIds.length).toBe(1);
	}));

});