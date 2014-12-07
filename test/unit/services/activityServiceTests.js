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
    var appendIncrement;

    function activityGenereator(number){
        var index = 0;
        var object = {};
        var activity = {"body":"<a class=\"user\" href=\"\">Bernt Skjemstad</a> oppdaterte et dokument, <a href=\"/document_library/get_file?groupId=10157&folderId=0&title=Agora+-+introduksjon.pdf\">Agora - introduksjon.pdf</a>, i <a class=\"group\" href=\"/my_sites/view?groupId=10157&privateLayout=0\">Agora</a>.","DLFileEntry_filelink":"/c/document_library/get_file?groupId=10157&folderId=0&title=Agora+-+introduksjon.pdf","date":"1343029312925","MBMessage_messageId":"","pict":"/user_male_portrait?img_id=10938&t=1375447245509","extraBody":"<a href=\"/document_library/find_file_entry?fileEntryId=12390\">Se dokument</a> <a href=\"/document_library/find_folder?groupId=10157&folderId=0\">Gå til mappe</a>","groupId":"10157","humanTimeStamp":"for 1 år siden","WikiPage_nodeid":"","WikiPage_title":"","user":"Bernt Skjemstad","ClassName":"com.liferay.portlet.documentlibrary.model.DLFileEntry","DLFileEntry_folderlink":"/c/document_library/find_folder?groupId=10157&folderId=0"}
        while(index < number){
            object[index++] = activity;
        }
        return object;
    }

	beforeEach(module('app.activityService'));
	beforeEach(module('app.storageService'));

	beforeEach(inject(function($injector){

		StorageService = $injector.get('StorageService');
    	AppService = $injector.get('AppService');
        $httpBackend = $injector.get('$httpBackend');
		
        var ActivityService = $injector.get('ActivityService');
        appendIncrement = ActivityService.getAppendIncrement();

		//Store all usefull info in local storage
    	StorageService.store('User',testUser);

		//Fetch with group Id and invalid auth token
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/489185/gid/250926/from/0/to/'+appendIncrement
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
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/489185/gid/250926/from/0/to/'+appendIncrement
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
            var data = activityGenereator(appendIncrement);
			return[200,
            data
			]
		});

        //Fetch with group Id and invalid auth token
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/489185/gid/250926/from/0/to/'+appendIncrement*2
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
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/agora-activities-portlet.activities/get-fmt-group-activity2/uid/489185/gid/250926/from/0/to/' +appendIncrement*2
            ,function(headers){
                return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
        .respond(function(){
            var data = activityGenereator(appendIncrement*2);
            return[200,
                data
            ]
        });

		//Fetch without group Id and invalid token
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/489185/from/0/to/'+appendIncrement
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
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/489185/from/0/to/'+appendIncrement
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
            var data = activityGenereator(appendIncrement);
			return[200,
                data
			]
		});

		//Fetch without group Id and invalid token
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/489185/from/0/to/'+appendIncrement*2
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
        $httpBackend.whenGET(AppService.getBaseURL() + '/api/jsonws/agora-activities-portlet.activities/get-fmt-users-group-and-orgs-activity3/uid/489185/from/0/to/20'+appendIncrement*2
        	,function(headers){
        		return headers['Authorization'] == 'Basic dGVzdFVzZXI6ZGVtbw==' ? true :false;
        })
		.respond(function(){
            var data = activityGenereator(appendIncrement);
			return[200,
                data
			]
		});




	}));

	afterEach(function() {
	  	$httpBackend.verifyNoOutstandingExpectation();
	  	$httpBackend.verifyNoOutstandingRequest();

        StorageService.clear();
	});


	it('Testing getActivities',inject(function(ActivityService){

		var activitiesHolder;
		var group = {id: 250926, name: "TestGruppe1", type: 2, site: true};

		ActivityService.getActivities(group).then(function(holder){
			activitiesHolder = holder;
		});

		$httpBackend.flush();
        // dump(activitiesHolder.activities.length)
        expect(activitiesHolder.activities.length).toBe(appendIncrement);
	}));

	it('Testing getMoreActivities',inject(function(ActivityService){

        var activitiesHolder;
        var group = {id: 250926, name: "TestGruppe1", type: 2, site: true};

        ActivityService.getActivities(group).then(function(holder){
            activitiesHolder = holder;
        });

        $httpBackend.flush();
        expect(activitiesHolder.activities.length).toBe( appendIncrement );

        //Calling getMoreActivities to see if object is updated
        ActivityService.getMoreActivities(group);
        $httpBackend.flush();
        expect(activitiesHolder.activities.length).toBe( appendIncrement*2 );
    }));

    it('Testing updateActivities',inject(function(ActivityService){

        var activitiesHolder;
        var group = {id: 250926, name: "TestGruppe1", type: 2, site: true};

        var promise = ActivityService.updateActivities(group);

        promise.then(function(holder){
            activitiesHolder = holder;
        });

        $httpBackend.flush();
        expect(activitiesHolder.activities.length).toBe(appendIncrement);
    }));

    it('Testing getActivities with less then appendIncrement paramter',inject(function(ActivityService){

        var activitiesHolder;
        var group = {id: 250926, name: "TestGruppe1", type: 2, site: true};

        var promise = ActivityService.getActivities(group,5);

        promise.then(function(holder){
            activitiesHolder = holder;
        });

        $httpBackend.flush();
        expect(activitiesHolder.activities.length).toBe(appendIncrement);
    }));

    //For this test to work you need to remove the updateActivities() call in ActicityService executed when activities are fetched from the local storage

    // it('Testing storage',inject(function(ActivityService){

    //     var activitiesHolder;
    //     var group = {id: 250926, name: "TestGruppe1", type: 2, site: true};

    //     var promise = ActivityService.getActivities(group);

    //     promise.then(function(holder){
    //         activitiesHolder = holder;
    //     });
    //     $httpBackend.flush();
    //     expect(activitiesHolder.activities.length).toBe(10);

    //     activitiesHolder.activities = [];
    //     activitiesHolder.groupId = undefined;
    //     var promise = ActivityService.getActivities(group).then(function(){
    //         expect(activitiesHolder.activities.length).toBe(10);
    //     })

    // }));

});