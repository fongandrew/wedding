"use strict";

// NB: This gulp file is intended to be used with Gulp 4.x and won't
// work with Gulp 3.x or below.
var _ = require("lodash"),
    babel = require("babelify"),
    browserify = require("browserify"),
    buffer = require("vinyl-buffer"),
    del = require("del"),
    ecstatic = require("ecstatic"),
    gulp = require("gulp"),
    gutil = require("gulp-util"),
    http = require("http"),
    less = require("gulp-less"),
    path = require("path"),
    source = require("vinyl-source-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    watchify = require("watchify");

var PRODUCTION = process.env.NODE_ENV === "production";

/* LESS */

gulp.task("build-less", function() {
  return gulp.src("./less/**/*.less")
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', function(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./pub/css"));
});

gulp.task("watch-less",function() {
  return gulp.watch("./less/**/*.less", gulp.series("build-less"));
});


/* ES6/Babel */

function compileES6(watch) {
  var bundler = watchify(browserify('./js/main.es6', {
    debug: !PRODUCTION
  }).transform(babel, {presets: ["es2015"]}));

  function rebundle() {
    var b = bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer());

    if (! PRODUCTION) {
      b.pipe(sourcemaps.init({ loadMaps: true }))
       .pipe(sourcemaps.write());
    }

    return b.pipe(gulp.dest('./pub/js'))
      .on('end', function(){ gutil.log('Done!'); });
  }

  if (watch) {
    bundler.on('update', function() {
      gutil.log('Bundling...');
      rebundle();
    });
  }

  return rebundle();
}

gulp.task("build-es6", function() {
  return compileES6();
});

gulp.task("watch-es6", function() {
  return compileES6(true);
});


/* Our uncompiled assets */

gulp.task("build-assets", function() {
  return gulp.src("assets/**/*.*")
    .pipe(gulp.dest("./pub"));
});

gulp.task("watch-assets", function() {
  return gulp.watch("assets/**/*.*", gulp.series("build-assets"));
});


/* Font-Awesome */

gulp.task("build-fonts", function() {
  return gulp.src([
    "./node_modules/font-awesome/fonts/**/*.*"
  ]).pipe(gulp.dest("./pub/fonts"));
});


/* Dev server */

gulp.task("dev-server", function(cb) {
  var port = 5000;
  http.createServer(
    ecstatic({ root: path.resolve("./pub"),
               contentType: 'text/html' })
  ).listen(port);
  console.log("Dev server listening at http://localhost:" + port);
  cb();
});


////

gulp.task("clean", function() {
  return del(["./pub"]);
});

gulp.task("build", gulp.series("clean",
  gulp.parallel("build-assets",
                "build-fonts",
                "build-es6",
                "build-less")));

gulp.task("watch", gulp.series("build",
  gulp.parallel(
    "dev-server",
    "watch-es6",
    "watch-less",
    "watch-assets"
  )
));

gulp.task("default", gulp.series("build"));
