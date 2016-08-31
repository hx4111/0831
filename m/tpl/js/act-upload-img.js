var uploadIndex = 0;
var uploadImgMap = {};
$(function() {
	jsonp({
		url: 'upload_token4h5',
		jsonpCallback: 'jsonp_upload_token',
		success: function(data) {
			newuploader(data.upload_token);
		}
	});
	var newuploader = function(token) {
		var uploader = Qiniu.uploader({
			runtimes: 'html5,flash,html4',
			browse_button: 'upload-pic',
			container: 'upload-container',
			max_file_size: '4mb',
			uptoken: token,
			dragdrop: false,
			domain: 'http://up.cdn.icomico.com/',
			get_new_uptoken: false,
			auto_start: true,
			init: {
				'FilesAdded': function(up, files) {
					plupload.each(files, function(file) {
						var progress = new FileProgress(file, 'fsUploadProgress');
						progress.bindUploadCancel(up);
					});
				},
				'BeforeUpload': function(up, file) {
					if (!CONFIG.isLogin) {
						window.location.href = CONFIG.rootUrl + '/login.html';
					}
				},
				'UploadProgress': function(up, file) {
					var fileProgressID = file.id;
					$('#' + fileProgressID).find('.fs-percent').html(file.percent + "%");
				},
				'UploadComplete': function(up, file) {
					console.info(JSON.stringify(file));
				},
				'FileUploaded': function(up, file, info) {
					var res = JSON.parse(info);
					console.info(JSON.stringify(res));
					var fileProgressID = file.id;
					var img = new Image();
					var domain = up.getOption('domain');
					var imgItemWidth = Math.floor((document.body.clientWidth * 0.85) / 3);
					var imgViewerStr = '?imageView2/1/w/' + imgItemWidth + '/h/' + imgItemWidth;
					var uploadimgurl = domain + encodeURI(res.key);
					img.src = uploadimgurl + imgViewerStr;
					img.onload = function() {
						var imgMapItem = {
							"content_type": "img",
							"img_url": res.key,
							"img_width": img.width,
							"img_height": img.height,
							"mime": file.type,
						};
						uploadImgMap[(uploadIndex++)] = imgMapItem;
						$('#' + fileProgressID).find('.fs-percent').html(img);
					};
				},
				'Error': function(up, err, errTip) {}
			}
		});
		uploader.bind('FileUploaded', function() {
			console.log('hello man,a file is uploaded');
		});
	}
});

function FileProgress(file, targetID) {
	this.fileProgressID = file.id;
	this.file = file;
	this.$imgItem = $('<div class="img-item" id="' + this.fileProgressID + '" data-uploadIndex="' + uploadIndex + '">' + '    <i class="iconfont icon-guanbi"></i>' + '    <div class="fs-percent"></div>' + '</div>');
	this.$fs_percent = this.$imgItem.find('.fs-percent');
	$('#' + targetID).append(this.$imgItem);
}
FileProgress.prototype.setProgress = function(percentage) {};
FileProgress.prototype.setComplete = function(up, info) {};
FileProgress.prototype.setError = function() {
	this.$fs_percent.html("上传出错!").css({
		"top": "0px",
		"height": "100px"
	});
};
// 绑定取消上传事件
FileProgress.prototype.bindUploadCancel = function(up) {
	var self = this;
	if (up) {
		self.$imgItem.find('.icon-guanbi').on('click', function() {
			up.removeFile(self.file);
			var removeIndex = self.$imgItem.data('uploadIndex');
			for (var prop in uploadImgMap) {
				if (prop == removeIndex) {
					uploadImgMap[prop].useless = true;
				}
			}
			self.$imgItem.remove();
		});
	}
};