//init gulp
var gulp = require('gulp');

// helpers
var del = require('del');
var rename = require('gulp-rename');

//notify error
var plumber = require('gulp-plumber');

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
var cssnano = require('cssnano');
var sourcemaps = require('gulp-sourcemaps');

//html
var pug = require('gulp-pug');

// favicon
var favicons = require("gulp-favicons"),
  gutil = require("gulp-util");

//path
var paths = {
  css: ['./*.css', '!*.min.css'],
  sass: './assest/css/**/*.scss',
  pug: './assest/html/module/*.pug',
  html: './assest/html/**/*.pug',
  dest: './public'
}

// Compile pug to HTML
gulp.task('pug', function() {

  return gulp.src(paths.pug)
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.dest));
});

// Clean files .css
gulp.task('clean:styles', function() {
  return del([paths.dest + '/css/style.css', paths.dest +
    '/css/style.min.css'
  ])
});

/**
 * Compile sass - include plugin css
 */
gulp.task('css', ['clean:styles'], function() {
  return gulp.src('./assest/css/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass.sync({
      includePaths: [require('node-normalize-scss').includePaths],
      errLogToConsole: true,
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 version', 'ie >= 9']
      }),
      mqpacker({
        sort: true
      }),
      flexibility()
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'))
});

gulp.task('cssnano', ['css'], function() {
  return gulp.src('./public/css/style.css')
    .pipe(postcss([
      cssnano({
        discardComments: {
          removeAll: true
        }
      })
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./public/css'));
});

/**
 * Process tasks and reload browsers on file changes.
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
  gulp.watch(paths.sass, ['css']);
});

gulp.task("favicon", function() {
  return gulp.src("./assest/img/logo.png").pipe(favicons({
      appName: "My App",
      appDescription: "This is my application",
      background: "#fff",
      path: "img/",
      display: "standalone",
      orientation: "portrait",
      start_url: "/?homescreen=1",
      version: 1.0,
      logging: false,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        windows: true,
        yandex: false
      }
    }))
    .on("error", gutil.log)
    .pipe(gulp.dest("./public/img"));
});

gulp.task('fonts', () => {
  gulp
    .src('./assest/fonts/*.*')
    .pipe(gulp.dest('./public/fonts'));
});
