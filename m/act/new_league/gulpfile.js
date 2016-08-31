var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload();

gulp.task('dev', function() {
	browserSync.init({
		server: './'
	})

	gulp.watch(['**/*.html', 'js/**/*.js', 'css/**/*.css'], reload);
})