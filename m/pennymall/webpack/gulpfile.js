var gulp = require('gulp');
var browserSync = require('browser-sync');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var reload = browserSync.reload;
var jsxLoader = require('jsx-loader')


gulp.task('jsTransformer', function () {
	var b = browserify({
	    entries: './app/main.jsx',
	    debug: true,
	    transform: [reactify]
	});

	return b.bundle()
    		.pipe(source('./bundle.js'))
            .pipe(buffer())
            // .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./app/dest/js'))
            .pipe(reload({stream: true}));
})

gulp.task('transLess', function () {
    gulp.src('app/less/**.less') //多个文件以数组形式传入
        .pipe(less())
        .pipe(gulp.dest('app/css'))
        .pipe(reload({stream: true})); //将会在src/css下生成index.css以及detail.css 
});

var browsersyncConfig = {
    files: [
        'app/css',
        'app/dest/js',
        'app/index.html'
    ],
    server: {
        baseDir: "./app"
    }
}

gulp.task('dev', ['jsTransformer', 'transLess'], function() {
	browserSync(browsersyncConfig);

    gulp.watch('app/less/**.less', ['transLess']);
    gulp.watch('app/js/**.*', ['jsTransformer']);
})