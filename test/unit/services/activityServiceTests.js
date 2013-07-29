'use strict';

describe('ActivityService',function(){

	var StorageService;
	var AppService;
	var $httpBackend;
	//test user info
	var testUser = {
      	screenName : "testUser",
      	id : "489185",
      	auth : "Basic dGVzdFVzZXI6ZGVtbw==",
      	companyId : "10132"
   	};

	beforeEach(module('app.activityService'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector){

		StorageService = $injector.get('StorageService');
    	AppService = $injector.get('AppService');
		$httpBackend = $injector.get('$httpBackend');

		//Store all usefull info in local storage
    	StorageService.store('User',testUser);

		//Fetch with group Id and invalid auth token
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/489185/gid/10157/from/0/to/10'
        	,function(headers){
        		return headers['Authorization'] != 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [401,
        	'{"exception":"Invalid authentication token"}',
        	{'WWW-Authenticate': 'Basic realm="PortalRealm"'}
        	]
        }); 

		//Fetch with group Id
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/489185/gid/10157/from/0/to/10'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return[200,
				{"13201":{"body":"<a class=\"user\" href=\"\">Armaz Mellati</a> skrev en ny diskusjonspost, <a href=\"/message_boards/find_message?messageId=495605\">Problemer med foten (TEST)</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1371815329382","MBMessage_messageId":"495605","pict":"/user_male_portrait?img_id=10915&t=1375086094281","extraBody":"","groupId":"10157","humanTimeStamp":"for 1 måned siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Armaz Mellati","ClassName":"com.liferay.portlet.messageboards.model.MBMessage","DLFileEntry_folderlink":""},"13202":{"body":"<a class=\"user\" href=\"\">Bernt Skjemstad</a> svarte på <a class=\"user\" href=\"\">Armaz Mellati</a>s diskusjonspost, <a href=\"/message_boards/find_message?messageId=495637\">RE: Problemer med foten (TEST)</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1371816160534","MBMessage_messageId":"495637","pict":"/user_male_portrait?img_id=10938&t=1375086094259","extraBody":"","groupId":"10157","humanTimeStamp":"for 1 måned siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Bernt Skjemstad","ClassName":"com.liferay.portlet.messageboards.model.MBMessage","DLFileEntry_folderlink":""}}
			]
		});

		

		//Fetch without group Id and invalid token
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/489185/from/0/to/10'
        	,function(headers){
        		return headers['Authorization'] != 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [401,
        	'{"exception":"Invalid authentication token"}',
        	{'WWW-Authenticate': 'Basic realm="PortalRealm"'}
        	]
        }); 

		//Fetch without group Id
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/489185/from/0/to/10'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return[200,
				{"13201":{"body":"<a class=\"user\" href=\"\">Armaz Mellati</a> skrev en ny diskusjonspost, <a href=\"/message_boards/find_message?messageId=495605\">Problemer med foten (TEST)</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1371815329382","MBMessage_messageId":"495605","pict":"/user_male_portrait?img_id=10915&t=1375086094281","extraBody":"","groupId":"10157","humanTimeStamp":"for 1 måned siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Armaz Mellati","ClassName":"com.liferay.portlet.messageboards.model.MBMessage","DLFileEntry_folderlink":""},"13202":{"body":"<a class=\"user\" href=\"\">Bernt Skjemstad</a> svarte på <a class=\"user\" href=\"\">Armaz Mellati</a>s diskusjonspost, <a href=\"/message_boards/find_message?messageId=495637\">RE: Problemer med foten (TEST)</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1371816160534","MBMessage_messageId":"495637","pict":"/user_male_portrait?img_id=10938&t=1375086094259","extraBody":"","groupId":"10157","humanTimeStamp":"for 1 måned siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Bernt Skjemstad","ClassName":"com.liferay.portlet.messageboards.model.MBMessage","DLFileEntry_folderlink":""}}
			]
		});









		//Fetch with group Id and invalid auth token
        $httpBackend.whenGET(AppService.getBaseURL() + 'api/secure/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/489185/gid/10157/from/0/to/20'
        	,function(headers){
        		return headers['Authorization'] != 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [401,
        	'{"exception":"Invalid authentication token"}',
        	{'WWW-Authenticate': 'Basic realm="PortalRealm"'}
        	]
        }); 

		//Fetch with group Id
        $httpBackend.whenGET(AppService.getBaseURL() + 'api/secure/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/489185/gid/10157/from/0/to/20'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return[200,
				{"9601":{"body":"<a class=\"user\" href=\"\">UNINETT administrator</a> oppdaterte et dokument, <a href=\"/document_library/get_file?groupId=10157&folderId=0&title=Agora+-+gruppeeier\">Agora - gruppeeier</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"/c/document_library/get_file?groupId=10157&folderId=0&title=Agora+-+gruppeeier","date":"1355323376023","MBMessage_messageId":"","pict":"/user_male_portrait?img_id=15649&t=1375088402417","extraBody":"<a href=\"/document_library/find_file_entry?fileEntryId=18910\">Se dokument</a> <a href=\"/document_library/find_folder?groupId=10157&folderId=0\">Gå til mappe</a>","groupId":"10157","humanTimeStamp":"for 7 måneder siden","WikiPage_nodeid":"","WikiPage_title":"","user":"UNINETT administrator","ClassName":"com.liferay.portlet.documentlibrary.model.DLFileEntry","DLFileEntry_folderlink":"/c/document_library/find_folder?groupId=10157&folderId=0"},"12507":{"body":"<a class=\"user\" href=\"\">Armaz Mellati</a> skrev en ny wikiside, <a href=\"/wiki/find_page?pageResourcePrimKey=396846\">Invitere medlemmer</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1368272861317","MBMessage_messageId":"","pict":"/user_male_portrait?img_id=10915&t=1375088402088","extraBody":"","groupId":"10157","humanTimeStamp":"for 2 måneder siden","WikiPage_nodeid":"10758","WikiPage_title":"Invitere medlemmer","user":"Armaz Mellati","ClassName":"com.liferay.portlet.wiki.model.WikiPage","DLFileEntry_folderlink":""},"12506":{"body":"<a class=\"user\" href=\"\">Armaz Mellati</a> skrev en ny wikiside, <a href=\"/wiki/find_page?pageResourcePrimKey=396837\">Veiledning</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1368272819406","MBMessage_messageId":"","pict":"/user_male_portrait?img_id=10915&t=1375088402088","extraBody":"","groupId":"10157","humanTimeStamp":"for 2 måneder siden","WikiPage_nodeid":"10758","WikiPage_title":"Veiledning","user":"Armaz Mellati","ClassName":"com.liferay.portlet.wiki.model.WikiPage","DLFileEntry_folderlink":""},"11902":{"body":"<a class=\"user\" href=\"\">Bjarne Holen</a> lastet opp et nytt dokument, <a href=\"/document_library/get_file?groupId=10157&folderId=0&title=imap.rb\">imap.rb</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"/c/document_library/get_file?groupId=10157&folderId=0&title=imap.rb","date":"1363787890701","MBMessage_messageId":"","pict":"/user_male_portrait?img_id=0&t=1375088402288","extraBody":"<a href=\"/document_library/find_file_entry?fileEntryId=277660\">Se dokument</a> <a href=\"/document_library/find_folder?groupId=10157&folderId=0\">Gå til mappe</a>","groupId":"10157","humanTimeStamp":"for 4 måneder siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Bjarne Holen","ClassName":"com.liferay.portlet.documentlibrary.model.DLFileEntry","DLFileEntry_folderlink":"/c/document_library/find_folder?groupId=10157&folderId=0"},"13201":{"body":"<a class=\"user\" href=\"\">Armaz Mellati</a> skrev en ny diskusjonspost, <a href=\"/message_boards/find_message?messageId=495605\">Problemer med foten (TEST)</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1371815329382","MBMessage_messageId":"495605","pict":"/user_male_portrait?img_id=10915&t=1375088402088","extraBody":"","groupId":"10157","humanTimeStamp":"for 1 måned siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Armaz Mellati","ClassName":"com.liferay.portlet.messageboards.model.MBMessage","DLFileEntry_folderlink":""},"13202":{"body":"<a class=\"user\" href=\"\">Bernt Skjemstad</a> svarte på <a class=\"user\" href=\"\">Armaz Mellati</a>s diskusjonspost, <a href=\"/message_boards/find_message?messageId=495637\">RE: Problemer med foten (TEST)</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1371816160534","MBMessage_messageId":"495637","pict":"/user_male_portrait?img_id=10938&t=1375088402067","extraBody":"","groupId":"10157","humanTimeStamp":"for 1 måned siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Bernt Skjemstad","ClassName":"com.liferay.portlet.messageboards.model.MBMessage","DLFileEntry_folderlink":""}}
			]
		});

		//Fetch without group Id and invalid token
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/489185/from/0/to/20'
        	,function(headers){
        		return headers['Authorization'] != 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
        	return [401,
        	'{"exception":"Invalid authentication token"}',
        	{'WWW-Authenticate': 'Basic realm="PortalRealm"'}
        	]
        }); 

		//Fetch without group Id
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/secure/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/489185/from/0/to/20'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			return[200,
				{"9601":{"body":"<a class=\"user\" href=\"\">UNINETT administrator</a> oppdaterte et dokument, <a href=\"/document_library/get_file?groupId=10157&folderId=0&title=Agora+-+gruppeeier\">Agora - gruppeeier</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"/c/document_library/get_file?groupId=10157&folderId=0&title=Agora+-+gruppeeier","date":"1355323376023","MBMessage_messageId":"","pict":"/user_male_portrait?img_id=15649&t=1375088402417","extraBody":"<a href=\"/document_library/find_file_entry?fileEntryId=18910\">Se dokument</a> <a href=\"/document_library/find_folder?groupId=10157&folderId=0\">Gå til mappe</a>","groupId":"10157","humanTimeStamp":"for 7 måneder siden","WikiPage_nodeid":"","WikiPage_title":"","user":"UNINETT administrator","ClassName":"com.liferay.portlet.documentlibrary.model.DLFileEntry","DLFileEntry_folderlink":"/c/document_library/find_folder?groupId=10157&folderId=0"},"12507":{"body":"<a class=\"user\" href=\"\">Armaz Mellati</a> skrev en ny wikiside, <a href=\"/wiki/find_page?pageResourcePrimKey=396846\">Invitere medlemmer</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1368272861317","MBMessage_messageId":"","pict":"/user_male_portrait?img_id=10915&t=1375088402088","extraBody":"","groupId":"10157","humanTimeStamp":"for 2 måneder siden","WikiPage_nodeid":"10758","WikiPage_title":"Invitere medlemmer","user":"Armaz Mellati","ClassName":"com.liferay.portlet.wiki.model.WikiPage","DLFileEntry_folderlink":""},"12506":{"body":"<a class=\"user\" href=\"\">Armaz Mellati</a> skrev en ny wikiside, <a href=\"/wiki/find_page?pageResourcePrimKey=396837\">Veiledning</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1368272819406","MBMessage_messageId":"","pict":"/user_male_portrait?img_id=10915&t=1375088402088","extraBody":"","groupId":"10157","humanTimeStamp":"for 2 måneder siden","WikiPage_nodeid":"10758","WikiPage_title":"Veiledning","user":"Armaz Mellati","ClassName":"com.liferay.portlet.wiki.model.WikiPage","DLFileEntry_folderlink":""},"11902":{"body":"<a class=\"user\" href=\"\">Bjarne Holen</a> lastet opp et nytt dokument, <a href=\"/document_library/get_file?groupId=10157&folderId=0&title=imap.rb\">imap.rb</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"/c/document_library/get_file?groupId=10157&folderId=0&title=imap.rb","date":"1363787890701","MBMessage_messageId":"","pict":"/user_male_portrait?img_id=0&t=1375088402288","extraBody":"<a href=\"/document_library/find_file_entry?fileEntryId=277660\">Se dokument</a> <a href=\"/document_library/find_folder?groupId=10157&folderId=0\">Gå til mappe</a>","groupId":"10157","humanTimeStamp":"for 4 måneder siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Bjarne Holen","ClassName":"com.liferay.portlet.documentlibrary.model.DLFileEntry","DLFileEntry_folderlink":"/c/document_library/find_folder?groupId=10157&folderId=0"},"13201":{"body":"<a class=\"user\" href=\"\">Armaz Mellati</a> skrev en ny diskusjonspost, <a href=\"/message_boards/find_message?messageId=495605\">Problemer med foten (TEST)</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1371815329382","MBMessage_messageId":"495605","pict":"/user_male_portrait?img_id=10915&t=1375088402088","extraBody":"","groupId":"10157","humanTimeStamp":"for 1 måned siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Armaz Mellati","ClassName":"com.liferay.portlet.messageboards.model.MBMessage","DLFileEntry_folderlink":""},"13202":{"body":"<a class=\"user\" href=\"\">Bernt Skjemstad</a> svarte på <a class=\"user\" href=\"\">Armaz Mellati</a>s diskusjonspost, <a href=\"/message_boards/find_message?messageId=495637\">RE: Problemer med foten (TEST)</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"","date":"1371816160534","MBMessage_messageId":"495637","pict":"/user_male_portrait?img_id=10938&t=1375088402067","extraBody":"","groupId":"10157","humanTimeStamp":"for 1 måned siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Bernt Skjemstad","ClassName":"com.liferay.portlet.messageboards.model.MBMessage","DLFileEntry_folderlink":""}}
			]
		});




	}));

	afterEach(function() {
	  	$httpBackend.verifyNoOutstandingExpectation();
	  	$httpBackend.verifyNoOutstandingRequest();
	});

	it('Testing fetch activity logs first time',inject(function(ActivityService){

		var activitiesHolder;
		var group = {id: 10157, name: "TestGruppe1", type: 2, site: true};

		var promise = ActivityService.getActivities(group);

		promise.then(function(holder){
			activitiesHolder = holder;
		});

		$httpBackend.flush();
		// expect(activities.length).toBe(10);
	}));

	it('Testing after fetch activity logs stored first 10',inject(function(ActivityService,StorageService){

		/*var activity;

		var promise = ActivityService.fetchActivityLogs(250926);

		promise.then(function(rep){
			activity = StorageService.get("Group250926_ActLog10");
		});

		$httpBackend.flush();
		expect(activity).not.toBe(undefined);*/
	}));

	it('Testing fetch 10 more activity logs',inject(function(ActivityService){
		/*var activities;

		var promise = ActivityService.fetchActivityLogs(250926);

		promise.then(function(rep){
			ActivityService.fetchMoreLogs(250926).then(function(rep){
				activities = ActivityService.getActivityLogs();
			});
		});

		$httpBackend.flush();
		expect(activities.length).toBe(20);*/
	}));

});