var gulp = require('gulp');
var browserSync = require('browser-sync');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var reload = browserSync.reload;


var src = 'src/';
var dist = 'dist/'

gulp.task('transless', function() {
    gulp.src(src + 'less/**.less')
    .pipe(less())
    .pipe(concat('main.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest( dist + 'css'))
    .pipe(reload({stream: true}));
});

gulp.task('translessDev', function() {
    gulp.src(src + 'less/**.less')
    .pipe(less())
    .pipe(gulp.dest( dist + 'css'));
});

gulp.task('uglifyjs', function() {
	gulp.src(src + 'js/**.js')
	.pipe(uglify())
	.pipe(gulp.dest(dist + 'js'))
	.pipe(reload({stream: true}));
});

gulp.task('cpsrc', function() {
	gulp.src(src + '**.html')
	.pipe(gulp.dest(dist))
	.pipe(reload({stream: true}));

	gulp.src(src + 'images/*')
	.pipe(gulp.dest(dist + 'images'))
	.pipe(reload({stream: true}));
})

gulp.task('cpjs', function() {
	gulp.src(src + 'js/**.js')
	.pipe(gulp.dest(dist + 'js'))
	.pipe(reload({stream: true}));
})

//env = dev
gulp.task('default', ['cpsrc', 'cpjs', 'transless'], function() {
	browserSync({
		server: {
			baseDir: 'dist'
		}
	});

	gulp.watch([src + '*.html', src + 'less/**/*.less', src + 'js/**/*.js'], ['cpsrc', 'cpjs', 'translessDev', reload]);
	gulp.watch([dist + '*.html', dist + 'css/**/*.css', dist + 'js/**/*.js'], ['cpsrc', 'translessDev', reload]);
})

//env = peenymall
gulp.task('pennymall', ['cpsrc', 'transless', 'uglifyjs'], function() {
	browserSync({
		server: {
			baseDir: 'dist'
		}
	});

	gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], reload);
})
