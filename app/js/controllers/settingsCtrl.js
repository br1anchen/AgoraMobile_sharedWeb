'use strict';

app.controller('SettingsCtrl',

	function($scope,AppService,DocumentService){
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
			DocumentService.deleteAllSavedFiles().then(function(rep){
				console.log(rep);
				navigator.notification.alert(
	                rep,
	                function(){
	                	
	                },
	                'Agora Mobile',
	                'OK'
	            );
			},function(err){
				console.log(err);
				navigator.notification.alert(
	                'Clear All Files Failed',
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

			angular.forEach($scope.deleteFiles,function(f,k){
				
				DocumentService.removeFile(f).then(function(rep){
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
			});
		}
	}
)