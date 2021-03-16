/**
 * Wrap gulp streams into fail-safe function for better error reporting
 * Usage:
 * gulp.task('less', wrapPipe(function(success, error) {
 *   return gulp.src('less/*.less')
 *      .pipe(less().on('error', error))
 *      .pipe(gulp.dest('app/css'));
 * }));
 *
 * @author just-boris
 * @url    https://gist.github.com/just-boris/89ee7c1829e87e2db04c
 *
 * @param taskFn
 * @returns {Function}
 */
function wrapPipe(taskFn) {
    return function(done) {
        var onSuccess = function() {
            done();
        };
        var onError = function(err) {
            done(err);
        }
        var outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
}

/**
 * @url http://markgoodyear.com/2014/01/getting-started-with-gulp/
 * @type {*|Gulp}
 */
var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    replace      = require('gulp-string-replace'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    del          = require('del'),
    exec         = require('child_process').exec;

/**
 * watch task
 */
gulp.task('watch', wrapPipe(function(success, error) {

    gulp.watch('host/**/*.js*',   gulp.series('host')).on('error', error);
    gulp.watch('client/**/*.js*', gulp.series('client')).on('error', error);
}));

/**
 * default task
 */
// gulp.task('default', wrapPipe(function(success, error) {
//     gulp.series('watch');
// }));
gulp.task('default', wrapPipe(function(success, error) {
    gulp.series('watch');
}));

/**
 * Concat Host JS(X) files.
 */
gulp.task('host', wrapPipe(function(success, error) {

    var sources = [
        '!host/host.all.jsx',
        'Logger.jsx',
        'prototypes.js',
        'JSON.jsx',
        'Utils.jsx',
        'Configuration.jsx',
        'ArtboardDimensions.jsx',
        'CustomEvent.jsx',
        'Progress.jsx',
        'Helpers.jsx',
        'Cache.js',
        'ImageGrid.jsx',
        'CenterOnArtboards.jsx',
        'Rules.jsx',
        'Rule.jsx'
    ];

    return gulp.src(sources)
    .pipe(concat('host.all.jsx').on('error', error))
    .pipe(gulp.dest('host'));

}));

/**
 * Concat Client JS(X) files.
 */
gulp.task('client', wrapPipe(function(success, error) {

    var source = [
        '!client/client.all.jsx',
        'lib/jquery.3.3.1.min.js',
        'lib/JSX.js',
        'lib/CSInterface.js',
        '../host/Atomic.js',
        '../host/Helpers.jsx',
        'lib/FlyoutMenu.js',
        'Client.js'
    ];

    return gulp.src(source)
    .pipe(concat('client.all.js').on('error', error))
    .pipe(gulp.dest('client'));
}));
