'use strict';

angular.module('app.utilityService',[]).
factory('UtilityService',['$log','$q','$timeout',function($log,$q,$timeout){

	var utiList = [
		{
			tag: 'txt',
			uti: 'public.plain-text'
		},
		{
			tag: 'rtf',
			uti: 'public.rtf'
		},
		{
			tag: 'html',
			uti: 'public.html'
		},
		{
			tag: 'htm',
			uti: 'public.html'
		},
		{
			tag: 'xml',
			uti: 'public.xml'
		},
		{
			tag: 'c',
			uti: 'public.c-source'
		},
		{
			tag: 'm',
			uti: 'public.objective-c-source'
		},
		{
			tag: 'cp',
			uti: 'public.c-plus-plus-source'
		},
		{
			tag: 'cpp',
			uti: 'public.c-plus-plus-source'
		},
		{
			tag: 'c++',
			uti: 'public.c-plus-plus-source'
		},
		{
			tag: 'cc',
			uti: 'public.c-plus-plus-source'
		},
		{
			tag: 'cxx',
			uti: 'public.c-plus-plus-source'
		},
		{
			tag: 'mm',
			uti: 'public.objective-c-plus-​plus-source'
		},
		{
			tag: 'h',
			uti: 'public.c-header'
		},
		{
			tag: 'js',
			uti: 'com.netscape.javascript-​source'
		},
		{
			tag: 'sh',
			uti: 'public.shell-script'
		},
		{
			tag: 'php',
			uti: 'public.php-script'
		},
		{
			tag: 'class',
			uti: 'com.sun.java-class'
		},
		{
			tag: 'jar',
			uti: 'com.sun.java-archive'
		},
		{
			tag: 'qtz',
			uti: 'com.apple.quartz-​composer-composition'
		},
		{
			tag: 'gtar',
			uti: 'org.gnu.gnu-tar-archive'
		},
		{
			tag: 'tar',
			uti: 'public.tar-archive'
		},
		{
			tag: 'gz',
			uti: 'org.gnu.gnu-zip-archive'
		},
		{
			tag: 'tgz',
			uti: 'org.gnu.gnu-zip-tar-archive'
		},
		{
			tag: 'vcf',
			uti: 'public.vcard'
		},
		{
			tag: 'jpg',
			uti: 'public.jpeg'
		},
		{
			tag: 'jpeg',
			uti: 'public.jpeg'
		},
		{
			tag: 'jp2',
			uti: 'public.jpeg-2000'
		},
		{
			tag: 'tif',
			uti: 'public.tiff'
		},
		{
			tag: 'tiff',
			uti: 'public.tiff'
		},
		{
			tag: 'pic',
			uti: 'com.apple.pict'
		},
		{
			tag: 'pct',
			uti: 'com.apple.pict'
		},
		{
			tag: 'pict',
			uti: 'com.apple.pict'
		},
		{
			tag: 'pntg',
			uti: 'com.apple.macpaint-image'
		},
		{
			tag: 'png',
			uti: 'public.png'
		},
		{
			tag: 'xbm',
			uti: 'public.xbitmap-image'
		},
		{
			tag: 'qif',
			uti: 'com.apple.quicktime-image'
		},
		{
			tag: 'qtif',
			uti: 'com.apple.quicktime-image'
		},
		{
			tag: 'icns',
			uti: 'com.apple.icns'
		},
		{
			tag: 'mov',
			uti: 'com.apple.quicktime-movie'
		},
		{
			tag: 'qt',
			uti: 'com.apple.quicktime-movie'
		},
		{
			tag: 'avi',
			uti: 'public.avi'
		},
		{
			tag: 'vfw',
			uti: 'public.avi'
		},
		{
			tag: 'mpg',
			uti: 'public.mpeg'
		},
		{
			tag: 'mpeg',
			uti: 'public.mpeg'
		},
		{
			tag: 'mp4',
			uti: 'public.mpeg-4'
		},
		{
			tag: 'mp3',
			uti: 'public.mp3'
		},
		{
			tag: 'm4a',
			uti: 'public.mpeg-4-audio'
		},
		{
			tag: 'caf',
			uti: 'com.apple.coreaudio-​format'
		},
		{
			tag: 'zip',
			uti: 'com.pkware.zip-archive'
		},
		{
			tag: 'pdf',
			uti: 'com.adobe.pdf'
		},
		{
			tag: 'ps',
			uti: 'com.adobe.postscript'
		},
		{
			tag: 'eps',
			uti: 'com.adobe.encapsulated-​postscript'
		},
		{
			tag: 'psd',
			uti: 'com.adobe.photoshop-​image'
		},
		{
			tag: 'ai',
			uti: 'com.adobe.illustrator.ai-​image'
		},
		{
			tag: 'gif',
			uti: 'com.compuserve.gif'
		},
		{
			tag: 'bmp',
			uti: 'com.microsoft.bmp'
		},
		{
			tag: 'ico',
			uti: 'com.microsoft.ico'
		},
		{
			tag: 'doc',
			uti: 'com.microsoft.word.doc'
		},
		{
			tag: 'docx',
			uti: 'org.openxmlformats.wordprocessingml.document'
		},
		{
			tag: 'xls',
			uti: 'com.microsoft.excel.xls'
		},
		{
			tag: 'xlsx',
			uti: 'org.openxmlformats.spreadsheetml.sheet'
		},
		{
			tag: 'ppt',
			uti: 'com.microsoft.powerpoint.​ppt'
		},
		{
			tag : 'pptx',
			uti: 'org.openxmlformats.presentationml.presentation'
		},
		{
			tag: 'wav',
			uti: 'com.microsoft.waveform-​audio'
		},
		{
			tag: 'asf',
			uti: 'com.microsoft.advanced-​systems-format'
		},
		{
			tag: 'wmv',
			uti: 'com.microsoft.windows-​media-wmv'
		},
		{
			tag: 'wma',
			uti: 'com.microsoft.windows-​media-wma'
		},
		{
			tag: 'key',
			uti: 'com.apple.keynote.key'
		},
		{
			tag: 'kth',
			uti: 'com.apple.keynote.kth'
		},
		{
			tag: 'rm',
			uti: 'com.real.realmedia'
		},
		{
			tag: 'csv',
			uti: 'public.comma-separated-values-text'
		}
	];

	return {
		base64:{
			// private property
			_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		 
			// public method for encoding
			encode : function (input) {
				var output = "";
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;
		 
				input = this._utf8_encode(input);
				while (i < input.length) {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
		 
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
		 
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					output = output +
					this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
					this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
				}
				return output;
			},
			// public method for decoding
			decode : function (input) {
				var output = "";
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;
		 
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				while (i < input.length) {
					enc1 = this._keyStr.indexOf(input.charAt(i++));
					enc2 = this._keyStr.indexOf(input.charAt(i++));
					enc3 = this._keyStr.indexOf(input.charAt(i++));
					enc4 = this._keyStr.indexOf(input.charAt(i++));
		 
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
		 
					output = output + String.fromCharCode(chr1);

					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}
				}
				output = this._utf8_decode(output);
				return output;
			},
 
			// private method for UTF-8 encoding
			_utf8_encode : function (string) {
				string = string.replace(/\r\n/g,"\n");
				var utftext = "";
				for (var n = 0; n < string.length; n++) {
					var c = string.charCodeAt(n);
					if (c < 128) {
						utftext += String.fromCharCode(c);
					}
					else if((c > 127) && (c < 2048)) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					}
					else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}
				}
				return utftext;
			},
 
			// private method for UTF-8 decoding
			_utf8_decode : function (utftext) {
				var string = "";
				var i = 0;
				var c = c1 = c2 = 0;
				while ( i < utftext.length ) {
					c = utftext.charCodeAt(i);
		 
					if (c < 128) {
						string += String.fromCharCode(c);
						i++;
					}
					else if((c > 191) && (c < 224)) {
						c2 = utftext.charCodeAt(i+1);
						string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
						i += 2;
					}
					else {
						c2 = utftext.charCodeAt(i+1);
						c3 = utftext.charCodeAt(i+2);
						string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
						i += 3;
					}
				}
				return string;
			}
		},

		base64Img:{
			encodeImg:function(img){
				// Create an empty canvas element
    			var canvas = document.createElement("canvas");
    			canvas.width = img.width;
    			canvas.height = img.height;

				// Copy the image contents to the canvas
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);

				// Get the data-URL formatted image
				// Firefox supports PNG and JPEG. You could check img.src to
				// guess the original format, but be aware the using "image/jpg"
				// will re-encode the image.
				return canvas.toDataURL("image/png");

			}
		},

		internetConnection:{
			checkConnection:function(conType){

		        var states = {};
		        states[Connection.UNKNOWN]  = 'Unknown connection';
		        states[Connection.ETHERNET] = 'Ethernet connection';
		        states[Connection.WIFI]     = 'WiFi connection';
		        states[Connection.CELL_2G]  = 'Cell 2G connection';
		        states[Connection.CELL_3G]  = 'Cell 3G connection';
		        states[Connection.CELL_4G]  = 'Cell 4G connection';
		        states[Connection.CELL]     = 'Cell generic connection';
		        states[Connection.NONE]     = 'No network connection';

		        return states[conType];
			}
		},

		iosUTI:{
			getUTIByExtension:function(extension){

				var uti = '';

				angular.forEach(utiList,function(u,k){

					if(u.tag == extension){
						uti = u.uti;
					}
				});

				if(uti == ''){
					return 'noUti';
				}else{
					return uti;
				}
				
			}
		},

		inAppBrowser:{
			browser: function(url){
				var ref = window.open(url, '_blank', 'location=yes');
		        ref.addEventListener('loadstart', function() { console.log('start: ' + event.url); });
		        ref.addEventListener('loadstop', function() { console.log('stop: ' + event.url); });
		        ref.addEventListener('exit', function() { console.log(event.type); });
			}
		}
	}
}])