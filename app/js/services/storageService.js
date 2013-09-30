angular.module('app.storageService',[]).
factory('StorageService',['$log','$window',function($log,$window){
	var invalidKey = function(key){
    	$log('StorageService:store():Invalid key(should be a string):'+JSON.stringify(key));
    }

    var storageDB;

	return {
		store: function(key, object) {
	        if (object && _.isString(key) && key.length > 0) {
	            $window.localStorage.setItem(key, JSON.stringify(object));
	            return 'stored';
	        }else{
	        	invalidKey(key);
	        	return 'failed';
	        }
	    },
	    remove: function(key) {
	        if (_.isString(key)) {
	            $window.localStorage.removeItem(key);
	            return 'removed';
	        }
	        else{
	        	invalidKey(key);
	        	return 'failed';
	        }
	    },
	    get: function(key) {
	        if (_.isString(key)) {
	            var value = $window.localStorage.getItem(key);
	            return value ? JSON.parse(value) : undefined;
	        } else {
	        	invalidKey(key);
	            return undefined;
	        }
	    },
	    clear: function(){
	    	$window.localStorage.clear()
	    },
	    initDB: function(dbName){
	    	console.log("Init Database");

	    	storageDB = window.sqlitePlugin.openDatabase({name: dbName, bgType: 0});

		    storageDB.transaction(function(tx) {

		        tx.executeSql('CREATE TABLE IF NOT EXISTS Groups (kid integer primary key,'
		                                                            + 'id integer,'
		                                                            + 'type integer,'
		                                                            + 'site integer,'
		                                                            + 'friendlyURL text,'
		                                                            + 'isTopGroup integer'
		                                                            + ')',[],function(){
		            console.log("SUCCESS: Create Table Groups");
		        }, function(e) {
		            console.log("ERROR: " + JSON.stringify(e));
		        });
		        tx.executeSql('CREATE TABLE IF NOT EXISTS DCFolders (kid integer primary key,'
		                                                            + 'companyId integer,'
		                                                            + 'createDate text,'
		                                                            + 'description text,'
		                                                            + 'folderId integer,'
		                                                            + 'groupId integer,'
		                                                            + 'modifiedDate text,'
		                                                            + 'name text,'
		                                                            + 'parentFolderId integer,'
		                                                            + 'repositoryId integer,'
		                                                            + 'userId integer,'
		                                                            + 'userName text'
		                                                            + ')',[],function(){
		            console.log("SUCCESS: Create Table DCFolders");
		        }, function(e) {
		            console.log("ERROR: " + JSON.stringify(e));
		        });
		        tx.executeSql('CREATE TABLE IF NOT EXISTS DCFiles (kid integer primary key,'
		                                                            + 'companyId integer,'
		                                                            + 'createDate text,'
		                                                            + 'description text,'
		                                                            + 'extension text,'
		                                                            + 'fileEntryId integer,'
		                                                            + 'folderId integer,'
		                                                            + 'folderName text,'
		                                                            + 'groupId integer,'
		                                                            + 'mimeType text,'
		                                                            + 'modifiedDate text,'
		                                                            + 'name text,'
		                                                            + 'readCount integer,'
		                                                            + 'repositoryId integer,'
		                                                            + 'title text,'
		                                                            + 'userId integer,'
		                                                            + 'userName text,'
		                                                            + 'version real,'
		                                                            + 'versionUserId integer,'
		                                                            + 'versionUserName text,'
		                                                            + 'localFileDir text,'
		                                                            + 'remoteFileDir text,'
		                                                            + 'offline integer,'
		                                                            + 'ifSupport integer,'
		                                                            + 'uti text'
		                                                            + ')',[],function(){
		            console.log("SUCCESS: Create Table DCFiles");
		        }, function(e) {
		            console.log("ERROR: " + JSON.stringify(e));
		        });
		        tx.executeSql('CREATE TABLE IF NOT EXISTS Activities (kid integer primary key,'
		                                                            + 'timestamp text,'
		                                                            + 'pic text,'
		                                                            + 'user text,'
		                                                            + 'groupId integer,'
		                                                            + 'action text,'
		                                                            + 'reference text,'
		                                                            + 'type text,'
		                                                            + 'node integer,'
		                                                            + 'title text,'
		                                                            + 'messageId integer,'
		                                                            + 'folderId integer,'
		                                                            + 'fileName text'
		                                                            + ')',[],function(){
		            console.log("SUCCESS: Create Table Activities");
		        }, function(e) {
		            console.log("ERROR: " + JSON.stringify(e));
		        });
		        tx.executeSql('CREATE TABLE IF NOT EXISTS Wikipages (kid integer primary key,'
		                                                            + 'companyId integer,'
		                                                            + 'content text,'
		                                                            + 'createDate text,'
		                                                            + 'format text,'
		                                                            + 'groupId integer,'
		                                                            + 'modifiedDate text,'
		                                                            + 'nodeId integer,'
		                                                            + 'pageId integer,'
		                                                            + 'parentTitle text,'
		                                                            + 'statusDate text,'
		                                                            + 'title text,'
		                                                            + 'userId integer,'
		                                                            + 'userName text,'
		                                                            + 'version real'
		                                                            + ')',[],function(){
		            console.log("SUCCESS: Create Table Wikipages");
		        }, function(e) {
		            console.log("ERROR: " + JSON.stringify(e));
		        });
		        tx.executeSql('CREATE TABLE IF NOT EXISTS Wikinodes (kid integer primary key,'
		                                                            + 'companyId integer,'
		                                                            + 'createDate text,'
		                                                            + 'groupId integer,'
		                                                            + 'name text,'
		                                                            + 'nodeId integer,'
		                                                            + 'userId integer,'
		                                                            + 'userName text'
		                                                            + ')',[],function(){
		            console.log("SUCCESS: Create Table Wikinodes");
		        }, function(e) {
		            console.log("ERROR: " + JSON.stringify(e));
		        });
		        tx.executeSql('CREATE TABLE IF NOT EXISTS MBCategories (kid integer primary key,'
		                                                            + 'categoryId integer,'
		                                                            + 'companyId integer,'
		                                                            + 'description text,'
		                                                            + 'groupId integer,'
		                                                            + 'messageCount integer,'
		                                                            + 'name text,'
		                                                            + 'parentCategoryId integer,'
		                                                            + 'threadCount integer,'
		                                                            + 'lastPostDate text,'
		                                                            + 'userId integer,'
		                                                            + 'userName text'
		                                                            + ')',[],function(){
		            console.log("SUCCESS: Create Table MBCategories");
		        }, function(e) {
		            console.log("ERROR: " + JSON.stringify(e));
		        });
		        tx.executeSql('CREATE TABLE IF NOT EXISTS MBThreads (kid integer primary key,'
		                                                            + 'categoryId integer,'
		                                                            + 'companyId integer,'
		                                                            + 'groupId integer,'
		                                                            + 'lastPosterId integer,'
		                                                            + 'lastPostDate integer,'
		                                                            + 'messageCount integer,'
		                                                            + 'rootMessageId integer,'
		                                                            + 'rootMessageUserId integer,'
		                                                            + 'statusByUserId integer,'
		                                                            + 'statusByUserName text,'
		                                                            + 'statusDate text,'
		                                                            + 'threadId integer,'
		                                                            + 'viewCount integer,'
		                                                            + 'title text'
		                                                            + ')',[],function(){
		            console.log("SUCCESS: Create Table MBThreads");
		        }, function(e) {
		            console.log("ERROR: " + JSON.stringify(e));
		        });
		        tx.executeSql('CREATE TABLE IF NOT EXISTS MBMessages (kid integer primary key,'
		                                                            + 'anonymous text,'
		                                                            + 'attachments text,'
		                                                            + 'body text,'
		                                                            + 'categoryId integer,'
		                                                            + 'companyId integer,'
		                                                            + 'createDate text,'
		                                                            + 'format text,'
		                                                            + 'groupId integer,'
		                                                            + 'messageId integer,'
		                                                            + 'modifiedDate text,'
		                                                            + 'parentMessageId integer,'
		                                                            + 'rootMessageId integer,'
		                                                            + 'statusByUserId integer,'
		                                                            + 'statusByUserName text,'
		                                                            + 'statusDate text,'
		                                                            + 'subject text,'
		                                                            + 'threadId integer,'
		                                                            + 'userId integer,'
		                                                            + 'userName text'
		                                                            + ')',[],function(){
		            console.log("SUCCESS: Create Table MBMessages");
		        }, function(e) {
		            console.log("ERROR: " + JSON.stringify(e));
		        });
		    });
	    },
	    storeDB: function(table,object) {
	    	//var storageDB = window.sqlitePlugin.openDatabase({name: "AgoraMobileDB"});
	    	
	    	storageDB.transaction(function(tx) {

	    		switch(table){
		    		case 'Groups':
		    			tx.executeSql("INSERT INTO Groups (id,type,site,friendlyURL,isTopGroup) VALUES (?,?,?,?,?)", [object.id, object.type,object.site,object.friendlyURL,object.isTopGroup], function(tx, res) {
          					console.log("insertId: " + res.insertId);
          					console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
          				}, function(e) {
				          console.log("ERROR: failed to insert group to Groups table, " + JSON.stringify(e));
				        });
		    			break;
		    		case 'DCFolders':
		    			break;
		    		case 'DCFiles':
		    			break;
		    		case 'Activities':
		    			break;
		    		case 'Wikipages':
		    			break;
		    		case 'Wikinodes':
		    			break;
		    		case 'MBCategories':
		    			break;
		    		case 'MBThreads':
		    			break;
		    		case 'MBMessages':
		    			break;
		    	}
	    	});
	    	
	    },
	    clearDB: function(){
	    	//var storageDB = window.sqlitePlugin.openDatabase({name: "AgoraMobileDB"});

	    	storageDB.transaction(function(tx) {
	    		tx.executeSql('DROP TABLE IF EXISTS Groups');
	    		tx.executeSql('DROP TABLE IF EXISTS DCFolders');
	    		tx.executeSql('DROP TABLE IF EXISTS DCFiles');
	    		tx.executeSql('DROP TABLE IF EXISTS Activities');
	    		tx.executeSql('DROP TABLE IF EXISTS Wikipages');
	    		tx.executeSql('DROP TABLE IF EXISTS Wikinodes');
	    		tx.executeSql('DROP TABLE IF EXISTS MBCategories');
	    		tx.executeSql('DROP TABLE IF EXISTS MBThreads');
	    		tx.executeSql('DROP TABLE IF EXISTS MBMessages');
	    	});
	    }
	}
}])