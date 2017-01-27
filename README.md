# Worflow frontend

## Documentación

Node - Descargar la version NTS -
[Descarga](https://nodejs.org/es/)

Versiones de navegadores web
[browser list](http://browserl.ist/?q=)

Bower - Package manager -
[Configuración](https://bower.io/docs/config/)

Gulp - [Documentación](http://gulpjs.com/)

Reportes con Insights PageSpeed -
[PSI](https://github.com/joeyhoer/psi/tree/mrt)

### Instalación

Dependencias globales

``` npm i -g gulp-cli bower psi ```

Dependencias desarrollo

``` npm install ```

### Configuracion

**Gulp** .- Es un automatizador de tareas escrito en JavaScript y que corre bajo Node.js

  ` var gulp = require('gulp'); `

**Del** .- Elimina archivos y carpetas

  ` var del = require('del'); `

**runSequence** .- Ejecuta una secuencia de tareas Gulp en el orden especificado

  ` var runSequence = require('run-sequence'); `

> **Nota.- **
> Se pretende que sea una solución temporal hasta el lanzamiento de gulp 4.0 que tiene soporte para definir dependencias de tareas en serie o en paralelo .

**imagemin-pngquant** .- Minifica imagenes .png

  ` var pngquant = require('imagemin-pngquant'); `

**browser-sync** .- Sincronizacion con el navegador

  ` var browserSync = require('browser-sync').create(); `

**css-mqpacker** .- Agrupa todos medias querias d y lo implementa al final del archivo css

` var mqpacker = require('css-mqpacker');`

**autoprefixer** .- Analiza CSS y añade prefijos de los navegadores utilizando **browserslist **, para que pueda especificar los navegadores que desea utilizar en su proyecto.

`var autoprefixer = require('autoprefixer');`

**cssnano** .- Analiza el CSS lo convierte en formato agradable y lo dirige a través de muchas optimizaciones focalizadas, para asegurar que el resultado final es lo más pequeño posible para un entorno de producción.

`var cssnano = require('cssnano');`

**webpack** .- Es un agrupador de módulos. Su principal objetivo es agrupar archivos JavaScript para el uso en el navegador. Sin embargo, también es capaz de transformar, empaquetar cualquier otro recurso(css, imagenes).

` var webpack = require("webpack");`

Necesitaremos tambien archivo de configuración :

 `var webpackConfig = require("./webpack.config.js");`

**gulp-load-plugins** - Carga los plugins de gulp.js. declarados en la dependencias del package.json y los une a un solo objeto.

``` javascript
  "devDependencies": {
    "gulp-favicons": "^2.2.7",
    "gulp-htmlmin": "^3.0.0",
    "gulp-humans": "^2.0.2",
    "gulp-imagemin": "^3.1.1",
    "gulp-plumber": "^1.1.0",
    "gulp-postcss": "^6.2.0",
    "gulp-pug": "^3.2.0",
    "gulp-rename": "^1.2.2",
    "gulp-robots": "^2.0.4",
    "gulp-sass": "^3.0.0",
    "gulp-sass-bulk-import": "^1.0.1",
    "gulp-size": "^2.1.0",
    "gulp-sourcemaps": "^1.9.1",
    "gulp-svg-sprite": "^1.3.6",
    "gulp-svgmin": "^1.2.3",
    "gulp-useref": "^3.1.2",
    "gulp-util": "^3.0.8",
    "gulp-w3c-css": "^1.0.1",
    "gulp-w3cjs": "^1.3.0",
    "gulp-webp": "^2.3.0",
  }
```
La configuración seria la siguiente utilizando por ejemplo con el plugin gulp-w3cjs :

``` javascript

  var plugins = require('gulp-load-plugins')();

  gulp.task('w3cjs', function() {
    gulp.src(dir.dist + '/*.html')
      .pipe(plugins.w3cjs())
      .pipe(plugins.w3cjs.reporter());
  });
```
**CONFIGURACION DE ARCHIVOS**

Directorios principales

``` javascript
var dir = {
  src: './src',
  dist: './dist'
}
```
Rutas archivos

``` javascript
var paths = {
  sass: dir.src + '/css/**/*.scss',
  pug: dir.src + '/html/module/*.pug',
  fonts: dir.src + '/fonts',
  img: dir.src + '/img/**/*.+(png|jpeg|jpg|gif)',
  js: dir.src + '/js/**/*.js',
  svg: dir.src + '/svg/*.svg',
  spriteSvg: dir.src + '/sprites/*.svg'
}
```

Configuración de cada plugin

``` javascript
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
```

### CONFIGURACIONES DE PLUGINS

**COMPLEMENTARIOS**

**gulp-util** .-Son funciones de utilidad para los plugins gulp.js (log,error)

**gulp-plumber** .- Permite no romper el flujo de una tarea en gulp si hubiera un error;

**gulp-rename** .-Renombra los archivos facilmente

**gulp-size** .- Finalizando la tarea del gulp.js muestra el tamaño del archivo por ejemplo de minificación de css o js.

**gulp-favicons** .- Utiliza un modulo favicons para generar favicons y sus archivos asociados. Se necesita la imagen del logo en formato .png.

```javascript

// Generamos favicon con la configuración indicada linea arriba
gulp.task("generate:favicon", function() {
  return gulp
    .src(paths.img + "/logo.png")
    .pipe(plugins.favicons(config.favicon))
    .on("error", plugins.util.log)
    .pipe(gulp.dest(dir.dist + "/img"))
});

// Una vez terminada la tarea generate:favicon tambien genera
// archivos browserconfig.xml y manifest.json con esta
// tarea copiamos los archivos en la raiz del proyecto
gulp.task('move:files', ['generate:favicon'], function() {
  return gulp.src(dir.dist + "/img/*.+(xml|json)")
    .pipe(gulp.dest(dir.dist));
});

// Esta es la tarea principal ya que finaliza las tareas de favicon(generate:favicon,move:files)
// y elimina los archivos copiados
gulp.task('favicon', ['move:files'], function() {
  return del(dir.dist + '/img/*.+(xml|json)');
});
```

> **Recomendaciones.- **
> Se recomienda utilizar la imagen del logo con una resolucion alta.
> Para mayor información del plugin puede visitar su [repositorio](https://github.com/haydenbleasel/favicons)

**gulp-svg-sprite**.- Este plugin genera un sprite en base archivos SVG y tambien los optimiza con su archivo. Tiene multiple opciones en esta ocasion genera archivo sass (scss).

```javascript

// Generamos el sprite con la ayuda de los plugins plumber para tener mejor
// control del errores y size para mostrar el tamaño del sprite svg generado
gulp.task('generate:sprites', function() {
  return gulp.src(paths.spriteSvg)
    .pipe(plugins.plumber())
    .pipe(plugins.svgSprite(config.sprite))
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'sprite - svg'
    }))
})

// El archivo .scss generado por el plugin movemos a la carpeta desarrollo
// del los archivos scss
gulp.task('copy:sprites', ['generate:sprites'], function() {
  gulp.src(dir.dist + '/css/sprite.scss')
    .pipe(plugins.rename('_sprite.scss'))
    .pipe(gulp.dest(dir.src + '/css/plugins'))
});

// Finalizando el proceso eliminamos la referencia del archivo .scss
gulp.task('sprites', ['copy:sprites'], function() {
  return del(dir.dist + '/css/sprite.scss');
})

```

**gulp-humans** .- Genera el archivo humans.txt donde indicara los participantes y que tecnologia utilizan en el proyecto web

``` javascript
// Generamos el archivo humans.txt y plugin size no indica el tamaño del archivo
gulp.task('humans', function() {
  gulp.src('index.html')
    .pipe(plugins.humans(config.humans))
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'humans'
    }))
});

```

**gulp-robots** .- Genera el archivo robots.txt donde podra configurar la reglas que requiran su web

``` javascript

// Generamos el archivo robots.txt y plugin size no indica el tamaño del archivo
gulp.task('robots', function() {
  gulp.src('index.html')
    .pipe(plugins.robots(config.robots))
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'robots'
    }))
});

```
**.htaccess** .- Copiamos el archivo .htaccess desde paquete npm **apache-server-configs** contiene una configuracion predeterminada.

``` javascript
gulp.task('htaccess', function() {
  gulp.src('node_modules/apache-server-configs/dist/.htaccess', {
      dot: true
    })
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'htaccess'
    }))
})

```
**fonts** .- Copiamos las fonts a la carpeta de distribución

``` javascript
gulp.task('fonts', function() {
  gulp
    .src(paths.fonts + '*.*')
    .pipe(gulp.dest(dir.dist + '/fonts'));
});

```

>NOTA :
> En la api gulp.src tiene opcion dot:true que permite tomar en cuenta archivos con la extension(.)

**normalize.css** .- Hace que los navegadores muestran todos los elementos de manera más consistente y de acuerdo con las normas modernas, si trabajamos con sass(.scss) con este paquete **node-normalize-scss** tendriamos este archivo y podriamos actualizarlo facilmente

``` javascript
gulp.task('normalize', function() {
  gulp.src('node_modules/node-normalize-scss/_normalize.scss')
    .pipe(gulp.dest(dir.src + '/css/plugins'))
})
```
**DESARROLLO**

**HTML**

**gulp-pug** .-Pug es un motor de plantillas de alto rendimiento fuertemente influenciado por Haml e implementado con el JavaScript para Node.js.

``` javascript

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

```

**CSS**

**gulp-sass**.- Permite compilar sass (.scss) con node.js.

**gulp-sass-Bulk-Import**.- Permite la importación de directorios en .scss

**gulp-postcss**.- Complemento de la herramienta PostCss . Esta herramienta es para la transformación de css con javascript actualmente cuenta con gran cantidad de plugins.

``` javascript
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
    .pipe(plugins.sassBulkImport())
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
```

**JAVASCRIPT**

Configuración otorgada por el repositorio de webpack

``` javascript

var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
  devCompiler.run(function(err, stats) {
    if (err) throw new plugins.util.PluginError("webpack:build-dev", err);
    plugins.util.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    callback();
  })
});

```

**OPTIMIZACION**

**gulp.imagemin** .- Optimizacion de imagenes [.png ,.jpge ,.gif ,.svg ] se puede incluir plugins para mayor resultado

``` javascript
gulp.task('img', function() {
  gulp.src(paths.img)
    .pipe(plugins.imagemin(config.imagemin))
    .pipe(gulp.dest(dir.dist + '/img'));
})
```

**gulp.webp** .- Convierte las imagenes [ .png, .jpge , tiff ]en formato .webp , este formato de imagen es optimizado actualmente soportado por el navegador chrome escritorio y movil.

``` javascript
gulp.task('webp', function() {
  gulp.src(dir.src + '/img/**/*.+(png|jpeg|jpg)')
    .pipe(plugins.webp())
    .pipe(gulp.dest(dir.dist + '/img/webp'))
    .pipe(plugins.size({
      title: 'webp'
    }));
})
```
**gulp.svgmin** .- Minificacion de archivos .svg muy personalizable.

``` javascript

gulp.task('svg', function() {
  gulp.src(paths.svg)
    .pipe(plugins.svgmin(config.svgmin))
    .pipe(gulp.dest(dir.dist + '/svg'))
    .pipe(plugins.size({
      title: 'min svg'
    }));
});

```

**CSS PRODUCIÓN**

``` javascript

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
```
**HTML PRODUCIÓN**

```JavaScript

gulp.task('html', function() {
  gulp.src(dir.dist + "/*.html")
    .pipe(plugins.useref())
    .pipe(plugins.htmlmin(config.htmlmin))
    .pipe(gulp.dest(dir.dist))
    .pipe(plugins.size({
      title: 'min html'
    }))
});

```

**JAVASCRIPT PRODUCIÓN**

``` JavaScript

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
    if (err) throw new plugins.util.PluginError("webpack:build", err);
    plugins.util.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

```

### TAREA PROGRAMADAS

** NPM BUILD**

``` JavaScript
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

```
