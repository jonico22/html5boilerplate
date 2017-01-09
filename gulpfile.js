//init gulp
var gulp = require('gulp');

// helpers
var del = require('del'),
  rename = require('gulp-rename')
gutil = require("gulp-util");

//notify error
var plumber = require('gulp-plumber');

//browser reload
var browserSync = require('browser-sync').create(),
  reload = browserSync.reload;

//css
var sass = require('gulp-sass');

//plugins css
var mqpacker = require('css-mqpacker'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  flexibility = require('postcss-flexibility'),
  cssnano = require('cssnano'),
  sourcemaps = require('gulp-sourcemaps');

//html
var pug = require('gulp-pug');

// favicon
var favicons = require("gulp-favicons");

// generate humans.txt
var humans = require('gulp-humans');

// generate robots.txt
var robots = require('gulp-robots');

// confif
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

//svg generator
var svgSprite = require("gulp-svg-sprites");
var filter = require('gulp-filter');
var svg2png = require('gulp-svg2png');

var dir = {
  src: './src',
  dist: './dist'
}

var paths = {
  css: ['./*.css', '!*.min.css'],
  sass: dir.src + '/css/**/*.scss',
  pug: dir.src + '/html/module/*.pug',
  fonts: dir.src + '/fonts',
  img: dir.src + '/img',
  js: dir.src + '/js/**/*.js',
  svg: dir.src + '/svg/*.svg'
}

gulp.task('sprites', function() {
  return gulp.src(paths.svg)
    .pipe(svgSprite({
      cssFile: "_sprite.scss",
      preview: false
    }))
    .pipe(gulp.dest(dir.dist))
    .pipe(filter("**/*.svg")) // Filter out everything except the SVG file
    .pipe(svg2png()) // Create a PNG
    .pipe(gulp.dest(dir.dist));
});

gulp.task("favicon", function() {
  return gulp
    .src(paths.img + "/logo.png").pipe(favicons({
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
    .pipe(gulp.dest(dir.dist + "/img"))
});

gulp.task('fonts', () => {
  gulp
    .src(paths.fonts + '*.*')
    .pipe(gulp.dest(dir.dist + '/fonts'));
});

gulp.task('humans', function() {
  gulp.src('index.html')
    .pipe(humans({
      team: 'Jose Luis Yana - developer - @jonico22',
      thanks: [
        'Node (@nodejs on Twitter)',
        'Gulp (@gulpjs on Twitter)'
      ],
      site: [
        'Standards: HTML5, CSS3',
        'Components: jQuery, Normalize.css',
        'Software: Atom'
      ]
    }))
    .pipe(gulp.dest(dir.dist));
});

gulp.task('robots', function() {
  gulp.src('index.html')
    .pipe(robots({
      useragent: '*',
      disallow: ' '
    }))
    .pipe(gulp.dest(dir.dist));
});

// Compile pug to HTML
gulp.task('pug', function() {
  return gulp.src(paths.pug)
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(dir.dist))
});

// Clean files .css
gulp.task('clean:styles', function() {
  return del([dir.dist + '/css/style.css', dir.dist +
    '/css/style.min.css'
  ])
});

// clean others files
gulp.task('move', function() {
  return gulp
    .src(dir.dist + "/img/*.+(xml|json)")
    .pipe(gulp.dest(dir.dist));
});


/**
 * Compile sass - include plugins
 */
gulp.task('css', ['clean:styles'], function() {
  return gulp.src(paths.sass)
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
    .pipe(gulp.dest(dir.dist + "/css"))
});



gulp.task('watch', function() {
  browserSync.init({
    browser: ["google chrome"],
    files: [dir.dist + "/css/*.css", dir.dist + "/js/*.js", dir.dist +
      '/*.html'
    ],
    server: {
      baseDir: dir.dist
    }
  });
  gulp.watch([dir.src + '/html/**/*.pug'], ['pug']);
  gulp.watch(paths.sass, ['css']);
  gulp.watch([paths.js], ["webpack:build-dev"]);
});

gulp.task("build-dev", ["webpack:build-dev"], function() {
  gulp.watch([paths.js], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task('cssnano', ['css'], function() {
  return gulp.src(dir.dist + '/css/style.css')
    .pipe(postcss([
      cssnano({
        discardComments: {
          removeAll: true
        }
      })
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(dir.dist + '/css'));
});

gulp.task("webpack:build", function(callback) {

  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {

  devCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError("webpack:build-dev", err);
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    callback();
  });
});
