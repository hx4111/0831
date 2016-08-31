 var gulp = require('gulp');
 var browserSync = require('browser-sync');
 var less = require('gulp-less');
 var reload = browserSync.reload;

 gulp.task('default', function() {
 	browserSync.init({
		server: './'
	});

 	gulp.watch('less/*.less', ['transless', reload]);
 	gulp.watch('*.html', reload);
 	gulp.watch('js/*.js', reload);
 })

gulp.task('transless', function() {
	gulp.src('less/style.less')
		.pipe(less())
		.pipe(gulp.dest('css'));
})