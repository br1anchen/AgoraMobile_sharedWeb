'use strict';

describe('ActivityService',function(){

	var StorageService;
	var $httpBackend;
	//test user info
	var testUser = {
      	screenName : "testUser",
      	userId : "",
      	auth : "Basic dGVzdFVzZXI6ZGVtbw==",
      	companyId : "10132"
   	};

	beforeEach(module('app.activityService'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector){
		$httpBackend = $injector.get('$httpBackend');

		//Invalid auth token by test user info
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/activity/get-group-activitylogs/groupId/250926/number/10'
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
        $httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/activity/get-group-activitylogs/groupId/250926/number/10'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			var testActLogs = [];
			for(var i = 0; i <10 ; i++){
				var act = {
				    body : "Bernt Skjemstad uploaded a new document",
			        groupId : 250926,
			        className : "File",
			        classPK : "File" + i,
			        timestamp : "09-07-2013",
			        involved : "Brian Chen",
			        posterImg : "https://agora.uninett.no/image/user_male_portrait?img_id=254940",
			        documentUrl : "https://agora.uninett.no/c/document_library/get_file?groupId=250926&folderId=0&title=login.sh",
			        documentTitle : "login.sh"
				};
				testActLogs.push(act);
			}
			return[200,JSON.stringify(testActLogs)]
		});

		$httpBackend.whenGET('https://agora.uninett.no/api/secure/jsonws/activity/get-group-activitylogs/groupId/250926/number/20'
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
			var testActLogs = [];
			for(var i = 0; i <20 ; i++){
				var act = {
				    body : "Bernt Skjemstad uploaded a new document",
			        groupId : 250926,
			        className : "File",
			        classPK : "File" + i,
			        timestamp : "09-07-2013",
			        involved : "Brian Chen",
			        posterImg : "https://agora.uninett.no/image/user_male_portrait?img_id=254940",
			        documentUrl : "https://agora.uninett.no/c/document_library/get_file?groupId=250926&folderId=0&title=login.sh",
			        documentTitle : "login.sh"
				};
				testActLogs.push(act);
			}
			return[200,JSON.stringify(testActLogs)]
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

	it('Testing fetch activity logs first time',inject(function(ActivityService){

		var activities;

		var promise = ActivityService.fetchActivityLogs(250926);

		promise.then(function(rep){
			activities = ActivityService.getActivityLogs();
		});

		$httpBackend.flush();
		expect(activities.length).toBe(10);
	}));

	it('Testing after fetch activity logs stored first 10',inject(function(ActivityService,StorageService){

		var activity;

		var promise = ActivityService.fetchActivityLogs(250926);

		promise.then(function(rep){
			activity = StorageService.get("Group250926_ActLog10");
		});

		$httpBackend.flush();
		expect(activity).not.toBe(undefined);
	}));

	it('Testing fetch 10 more activity logs',inject(function(ActivityService){
		var activities;

		var promise = ActivityService.fetchActivityLogs(250926);

		promise.then(function(rep){
			ActivityService.fetchMoreLogs(250926).then(function(rep){
				activities = ActivityService.getActivityLogs();
			});
		});

		$httpBackend.flush();
		expect(activities.length).toBe(20);
	}));

});