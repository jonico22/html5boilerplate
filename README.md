# Worflow frontend

## Documentación

Node - Descargar la version NTS -
[Descarga](https://nodejs.org/es/)

Lista de browsers -
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

> **Nota.- **
> Se pretende que sea una solución temporal hasta el lanzamiento de gulp 4.0 que tiene soporte para definir dependencias de tareas en serie o en paralelo .

  ` var runSequence = require('run-sequence'); `

**imagemin-pngquant** .- Minifica imagenes .png

  ` var pngquant = require('imagemin-pngquant'); `

**browser-sync** .- Sincronizacion con el navegador

  ` var browserSync = require('browser-sync').create(); `

**gulp-load-plugins** - Carga los plugins de gulp.js. desde devDependencies del package.json y los une a un solo objeto.

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
    "gulp-size": "^2.1.0",
    "gulp-sourcemaps": "^1.9.1",
    "gulp-svgmin": "^1.2.3",
    "gulp-useref": "^3.1.2",
    "gulp-util": "^3.0.8",
    "gulp-w3cjs": "^1.3.0",
    "gulp-webp": "^2.3.0",
  }
```
La configuración seria la siguiente utilizando el plugin gulp-w3cjs :

  ``` javascript

    var plugins = require('gulp-load-plugins')();

    gulp.task('w3cjs', function() {
      gulp.src(dir.dist + '/*.html')
        .pipe(plugins.w3cjs())
        .pipe(plugins.w3cjs.reporter());
    });
  ```
