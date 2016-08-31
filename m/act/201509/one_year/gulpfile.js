var gulp = require('gulp'),
	browserSync = require('browser-sync');

gulp.task('serve', function () {
	browserSync({
		notify: false,
		server: {
			baseDir: ['./']
		}
	});

	gulp.watch(['*.html', 'js/*.js'], browserSync.reload);
	gulp.watch(['css/*.css'], function (file) {
		return gulp.src(file.path)
			.pipe(browserSync.stream());
	});
});