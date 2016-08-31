var gulp = require('gulp');
var reactify = require('reactify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var reactJSX = require('gulp-react');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


gulp.task('concatJs', function() {
    gulp.src(['js/react-with-addons.min.js', 'js/react-dom.min.js', 'js/base64.min.js', 'js/config.js', 'js/post.js'])
        .pipe(concat('act-global.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
})

gulp.task('concatJsDev', function() {
    gulp.src(['js/react-with-addons.min.js', 'js/react-dom.min.js', 'js/base64.min.js', 'js/config.js', 'js/post.js'])
        .pipe(concat('act-global.js'))
        .pipe(gulp.dest('dist'));
})

gulp.task('concatJsTest', function() {
    gulp.src(['js/react-with-addons.js', 'js/react-dom.min.js', 'js/base64.min.js', 'js/config.js', 'js/post.js'])
        .pipe(concat('act-global-test.js'))
        .pipe(gulp.dest('dist'));
})

// 生成 react 相关 js 的合并压缩文件
gulp.task('concatReactJs', function(){
    gulp.src(['js/react.min.js', 'js/react-dom.min.js'])
        .pipe(concat('react-common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
})

// 生成压缩config.js文件
gulp.task('configJs', function() {
    gulp.src('js/config.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
})

// 将less 编译为css文件
gulp.task('transLess', function () {
    gulp.src(['less/style.less', 'less/post.less', 'less/controlcompanent.less']) 
        .pipe(less())
        .pipe(concat('style.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('css'));
});

// 将less 编译为css文件Dev
gulp.task('transLessDev', function () {
    gulp.src(['less/style.less', 'less/post.less', 'less/controlcompanent.less']) 
        .pipe(less())
        .pipe(concat('style.css'))
        // .pipe(minifycss())
        .pipe(gulp.dest('css'));
});

//编译jsx文件
gulp.task('reactJSX', function() {
    gulp.src('jsx/**.jsx')
        .pipe(reactJSX({harmony: true}))
        .pipe(gulp.dest('js'))
})

//编译并打包jsx
gulp.task('reactConcatJs', ['reactJSX'], function() {
    gulp.src(['js/react-with-addons.min.js', 'js/react-dom.min.js', 'js/base64.min.js', 'js/config.js', 'js/post.js'])
        .pipe(concat('act-global.min.js'))
        .pipe(gulp.dest('dist'));
})

//编译并打包jsx dev
gulp.task('reactConcatJsDev', ['reactJSX'], function() {
    gulp.src(['js/react-with-addons.js', 'js/react-dom.min.js', 'js/base64.min.js', 'js/config.js', 'js/post.js'])
        .pipe(concat('act-global.js'))
        .pipe(gulp.dest('dist'));
})

//编译并打包jsx test
gulp.task('reactConcatJsTest', ['reactJSX'], function() {
    gulp.src(['js/react-with-addons.js', 'js/react-dom.min.js', 'js/base64.min.js', 'js/config.js', 'js/post.js'])
        .pipe(concat('act-global-test.js'))
        .pipe(gulp.dest('dist'));
})

//dev 
gulp.task('default', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    })

    gulp.watch('less/**/*.less', ['transLessDev', reload]);
    gulp.watch(['*.html', 'css/**/*.css'], reload);
    gulp.watch('jsx/post.jsx', ['reactJSX', reload]);
    gulp.watch(['js/**/*.js'], ['concatJsTest', reload]);
})
