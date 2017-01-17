//init gulp
var gulp = require('gulp');

// helpers
var del = require('del');
var runSequence = require('run-sequence');
var pngquant = require('imagemin-pngquant');
//browser reload
var browserSync = require('browser-sync').create();
var bulkSass = require('gulp-sass-bulk-import');

//plugins css
var mqpacker = require('css-mqpacker'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano');

// js
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var generaterSvg = require('gulp-svg-sprite');

var dir = {
  src: './src',
  dist: './dist'
}

var paths = {
  css: ['./*.css', '!*.min.css'],
  sass: dir.src + '/css/**/*.scss',
  pug: dir.src + '/html/module/*.pug',
  fonts: dir.src + '/fonts',
  img: dir.src + '/img/**/*.+(png|jpeg|jpg|gif)',
  js: dir.src + '/js/**/*.js',
  svg: dir.src + '/svg/*.svg',
  spriteSvg: dir.src + '/sprites/*.svg'
}

var config = {
  browsers: ['last 2 version', 'ie >= 9'],
  humans: {
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
  },
  robots: {
    useragent: '*',
    disallow: ' '
  },
  favicon: {
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
  },
  sprite: {
    shape :{
      spacing: {
          padding: 2
      }
    },
    mode: {
      css: {
        prefix: ".icon-",
        render: {
          scss: true
        }
      }
    }
  },
  imagemin: {
    progressive: true,
    interlaced: true,
    use: [pngquant()]
  },
  svgmin: {
    plugins: [{
      convertColors: false
    }]
  },
  htmlmin: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
  }
}

gulp.task('img', function() {
  gulp.src(paths.img)
    .pipe(plugins.imagemin(config.imagemin))
    .pipe(gulp.dest(dir.dist + '/img'));
})

gulp.task('webp', function() {
  gulp.src(dir.src + '/img/**/*.+(png|jpeg|jpg)')
    .pipe(plugins.webp())
    .pipe(gulp.dest(dir.dist + '/img/webp'))
    .pipe(plugins.size({
      title: 'webp'
    }));
})

gulp.task('svg', function() {
  gulp.src(paths.svg)
    .pipe(plugins.svgmin(config.svgmin))
    .pipe(gulp.dest(dir.dist + '/svg'))
    .pipe(plugins.size({
      title: 'min svg'
    }));
});

gulp.task('w3cjs', function() {
  gulp.src(dir.dist + '/*.html')
    .pipe(plugins.w3cjs())
    .pipe(plugins.w3cjs.reporter());
});

gulp.task('humans', function() {
  gulp.src('index.html')
    .pipe(plugins.humans(config.humans))
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'humans'
    }))
});

gulp.task('robots', function() {
  gulp.src('index.html')
    .pipe(plugins.robots(config.robots))
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'robots'
    }))
});

gulp.task('htaccess', function() {
  gulp.src('node_modules/apache-server-configs/dist/.htaccess', {
      dot: true
    })
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'htaccess'
    }))
})

gulp.task('fonts', () => {
  gulp
    .src(paths.fonts + '*.*')
    .pipe(gulp.dest(dir.dist + '/fonts'));
});

gulp.task("generate:favicon", function() {
  return gulp
    .src(paths.img + "/logo.png")
    .pipe(plugins.favicons(config.favicon))
    .on("error", plugins.util.log)
    .pipe(gulp.dest(dir.dist + "/img"))
});

gulp.task('move:files', ['generate:favicon'], function() {
  return gulp.src(dir.dist + "/img/*.+(xml|json)")
    .pipe(gulp.dest(dir.dist));
});

gulp.task('favicon', ['move:files'], function() {
  return del(dir.dist + '/img/*.+(xml|json)');
});

gulp.task('generate:sprites', function() {
  return gulp.src(paths.spriteSvg)
    .pipe(plugins.plumber())
    .pipe(generaterSvg(config.sprite))
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'sprite - svg'
    }))
})

gulp.task('copy:sprites', ['generate:sprites'], function() {
  gulp.src(dir.dist + '/css/sprite.scss')
    .pipe(plugins.rename('_sprite.scss'))
    .pipe(gulp.dest(dir.src + '/css/plugins'))
});

gulp.task('sprites', ['copy:sprites'], function() {
  return del(dir.dist + '/css/sprite.scss');
})

gulp.task('normalize', function() {
  gulp.src('node_modules/node-normalize-scss/_normalize.scss')
    .pipe(gulp.dest(dir.src + '/css/plugins'))
})

// Compile pug to HTML
gulp.task('pug', function() {
  return gulp.src(paths.pug)
    .pipe(plugins.plumber())
    .pipe(plugins.pug({
      pretty: true
    }))
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'html'
    }))
});

// Clean files .css
gulp.task('clean:styles', function() {
  return del(dir.dist + '/css/*.css')
});

/**
 * Compile sass - include plugins
 */
gulp.task('css', ['clean:styles'], function() {
  return gulp.src(paths.sass)
    .pipe(plugins.plumber())
    .pipe(bulkSass())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass.sync({
      errLogToConsole: true,
      outputStyle: 'expanded'
    }).on('error', plugins.sass.logError))
    .pipe(plugins.postcss([
      autoprefixer(config.browser),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(dir.dist + "/css"))
    .pipe(plugins.size({
      title: 'css'
    }))
});


gulp.task('default', function(callback) {
  runSequence('pug', ['humans', 'robots', 'htaccess', 'fonts', 'sprites'],
    'normalize', 'css',
    callback);
});

gulp.task('cssnano', ['css'], function() {
  return gulp.src(dir.dist + '/css/style.css')
    .pipe(plugins.postcss([
      cssnano({
        discardComments: {
          removeAll: true
        }
      })
    ]))
    .pipe(plugins.rename('style.min.css'))
    .pipe(gulp.dest(dir.dist + '/css'))
    .pipe(plugins.size({
      title: 'min css'
    }))
});

gulp.task('html', function() {
  gulp.src(dir.dist + "/*.html")
    .pipe(plugins.useref())
    .pipe(plugins.htmlmin(config.htmlmin))
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'min html'
    }))
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
    plugins.util.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
  devCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError("webpack:build-dev", err);
    plugins.util.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    callback();
  })
});
