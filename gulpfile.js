var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sassInheritance = require('custom-gulp-sass-inheritance');
var jsInheritance = require('gulp-js-inheritance');
var gulpImports = require('gulp-imports');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');
var data = require('gulp-data');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var path = require('path');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var web = require("browser-sync").create();

var pkg = require('./package.json');

var info = {};
info.web = pkg.config.web;
info.js = pkg.config.js;
info.scss = pkg.config.scss;
info.watch = pkg.config.watch;
info.jshint = pkg.jshintConfig;

var _onError = function(err, errorType) {
    gutil.beep();
    notify.onError({
        title: errorType + ' Error',
        message: err.message,
        sound: false
    })(err);

};




// > SASS

gulp.task('sass', function() {

    return gulp.src(info.scss.src)
        .pipe(plumber({
            errorHandler: function(error) {
                _onError(error, 'SCSS');
                this.emit('end');
            }
        }))
        .pipe(gulpif(global.isWatching, cached('sass', {
            optimizeMemory: true
        })))
        .pipe(sassInheritance({
            dir: info.scss.folder
        }))
        .pipe(filter(function(file) {
            return !/\/_/.test(file.path) || !/^_/.test(file.relative);
        }))
        .pipe(data(function(file) {
            process.stdout.write("[SASS]\t" + gutil.colors.magenta('Compiling ') + file.path + "\t\t......\t");
        }))
        .pipe(sass({
            outputStyle: info.scss.style
        }))
        .pipe(data(function(file) {
            console.log(gutil.colors.green('done'));
        }))
        .pipe(gulp.dest(function(file) {
            return file.base.replace(path.resolve(info.scss.folder), path.resolve(info.scss.dist));
        }))
        .pipe(web.stream({
            match: '**/*.css'
        }));

});


// > JAVASCRIPT
gulp.task('js', function() {


    return gulp.src(info.js.src)
        .pipe(plumber({
            errorHandler: function(error) {
                _onError(error, 'JS');
                this.emit('end');
            }
        }))
        .pipe(gulpif(global.isWatching, cached('js', {
            optimizeMemory: true
        })))
        .pipe(jsInheritance({
            dir: info.js.folder,
        }))
        .pipe(jshint(info.jshint))
        .pipe(jshint.reporter(stylish))
        .pipe(filter(function(file) {
            return !/\/_/.test(file.path) || !/^_/.test(file.relative);
        }))
        .pipe(data(function(file) {
            process.stdout.write("[JS]\t" + gutil.colors.magenta('Processing ') + file.path + "\t\t......\t");
        }))
        .pipe(gulpImports())
        .pipe(uglify())
        .pipe(data(function(file) {
            console.log(gutil.colors.green('done'));
        }))
        .pipe(gulp.dest(function(file) {
            return file.base.replace(path.resolve(info.js.folder), path.resolve(info.js.dist));
        }));

});


// > SERVE WEB
gulp.task('serve', function() {
    gutil.log("[WEBSERVER]\tInitializing");
    web.init(info.web);
});

// > UTILS
gulp.task('setWatch', function() {
    global.isWatching = true;
});


gulp.task('sassCache', function() {
    return gulp.src(info.scss.src)
        .pipe(gulpif(global.isWatching, cached('sass', {
            optimizeMemory: true
        }))).
    on('end', function() {
        gutil.log("[SASS]\tCached");
    });

});

gulp.task('jsCache', function() {

    return gulp.src(info.js.src)
        .pipe(gulpif(global.isWatching, cached('js', {
            optimizeMemory: true
        }))).
    on('end', function() {
        gutil.log("[JS]\t\tCached");
    });

});

// > WATCH
gulp.task('watch', ['setWatch', 'jsCache', 'sassCache'], function() {

    watch(info.scss.src, function(file) {
        gulp.start('sass');
    });
    watch(info.js.src, function() {
        gulp.start('js');
        web.reload();
    });
    watch(info.watch.reload, function() {
        web.reload();
    });

    gutil.log("[WATCH]\tInitialized");
});

// > DEFAULT TASK
gulp.task('default', ['serve', 'watch']);
