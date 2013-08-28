'use strict';

app.controller('SettingsCtrl',

	function($scope,AppService,DocumentService,$q){
		$scope.settings = AppService.getSettings();
		$scope.savedFilesHolder = DocumentService.getSavedFiles();
		$scope.deleteFiles = [];

		$scope.toggleGUI = function(variable){
			$scope[variable] = $scope[variable] ? false : true;
		}
		$scope.toggleSetting = function(setting){
			$scope.settings[setting] = $scope.settings[setting] ? false : true;
		}

		$scope.clearAllFiles = function(){
			var promiseObjs = [];

			angular.forEach($scope.savedFilesHolder.savedFiles,function(f,k){

				var rmovePromise = DocumentService.removeFile(f).then(function(rep){

					console.log(rep);

				},function(err){
					
					navigator.notification.alert(
		                'File '+ f.title +' failed to delete',
		                function(){
		                	
		                },
		                'Agora Mobile',
		                'OK'
		            );

				});

				promiseObjs.push(rmovePromise);
			});

			$q.all(promiseObjs).then(function(){

				navigator.notification.alert(
	                'Files All deleted',
	                function(){
	                	
	                },
	                'Agora Mobile',
	                'OK'
	            );

			});
		}

		$scope.checkDelete = function($event,file){
			var checkbox = $event.target;
  			if(checkbox.checked){
  				$scope.deleteFiles.push(file);
  			}else{
  				$scope.deleteFiles = jQuery.grep($scope.deleteFiles, function (f) {
				    return f.remoteFileDir != file.remoteFileDir;
				});
  			}
		}

		$scope.deleteChosenFiles = function(){
			console.log(JSON.stringify($scope.deleteFiles));
			var promiseObjs = [];

			angular.forEach($scope.deleteFiles,function(f,k){
				
				var rmovePromise = DocumentService.removeFile(f).then(function(rep){
					$scope.deleteFiles = jQuery.grep($scope.deleteFiles, function (file) {
				    	return file.remoteFileDir != f.remoteFileDir;
					});
				},function(err){

					navigator.notification.alert(
		                'File '+ f.title +' failed to delete',
		                function(){
		                	
		                },
		                'Agora Mobile',
		                'OK'
		            );
				});

				promiseObjs.push(rmovePromise);
			});

			$q.all(promiseObjs).then(function(){

				navigator.notification.alert(
	                'All selected Files deleted',
	                function(){
	                	
	                },
	                'Agora Mobile',
	                'OK'
	            );

			});
		}
	}
)