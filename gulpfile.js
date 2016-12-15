//init gulp
var gulp = require('gulp');

// helpers
var del = require('del');
var rename = require('gulp-rename');

//notify error
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

//browser reload
var browserSync = require('browser-sync');
var reload = browserSync.reload;

//css
var sass = require('gulp-sass');

//plugins css
var mqpacker = require('css-mqpacker');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var flexibility = require('postcss-flexibility');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');

//html
var pug = require('gulp-pug');

//path
var paths = {
    css: ['./*.css', '!*.min.css'],
    sass: './assest/css/**/*.scss',
    html : './assest/html/**/*.pug'
    dest : './public'
}

/**
 * Notify Error
 */
function handleErrors () {
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: 'Task Failed [<%= error.message %>',
		message: 'error',
		sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).apply(this, args);
	gutil.beep(); // Beep 'sosumi' again
	this.emit('end'); // Prevent the 'watch' task from stopping
}

// Compile pug to HTML
gulp.task('pug', function() {
  return gulp.src(paths.html)
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.dest));
});

/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
gulp.task('watch', function() {

    browserSync.init({
        browser: ["google chrome"],
        server: {
            baseDir: "./public"
        }
    });

    gulp.watch([paths.html], ['pug']);
    gulp.watch(paths.dest + '/*.html').on('change', reload);
});
