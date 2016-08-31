 var gulp = require('gulp');
 var browserSync = require('browser-sync');
 var reload = browserSync.reload;
 var uglify = require('gulp-uglify');
 var less = require('gulp-less');
 var autoprefixer = require('gulp-autoprefixer');

 gulp.task('uglifyJs', function() {
 	gulp.src('js/zepto.js')
 	.pipe(uglify())
 	.pipe(gulp.dest('js'));
 })


 gulp.task('transLess', function() {
 	gulp.src('less/style.less')
 	.pipe(less())
 	.pipe(autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0'],
        cascade: true, //是否美化属性值 默认：true 
        remove:true //是否去掉不必要的前缀 默认：true 
    }))
 	.pipe(gulp.dest('css'))
 })

 gulp.task('default', function() {
 	browserSync.init({
		server: './'
	});

 	gulp.watch(['*.html', 'js/*.js'], reload);
 	gulp.watch('less/*.less', ['transLess', reload]);
 })
