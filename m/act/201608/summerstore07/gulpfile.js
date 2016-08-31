 var gulp = require('gulp');
 var browserSync = require('browser-sync');
 var reload = browserSync.reload;

 gulp.task('default', function() {
 	browserSync.init({
		server: './'
	});

 	gulp.watch('*.html', reload);
 })
