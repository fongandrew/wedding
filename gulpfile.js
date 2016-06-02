"use strict";

// NB: This gulp file is intended to be used with Gulp 4.x and won't
// work with Gulp 3.x or below.
var _ = require("lodash"),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("babelify"),
    browserify = require("browserify"),
    buffer = require("vinyl-buffer"),
    del = require("del"),
    ecstatic = require("ecstatic"),
    gulp = require("gulp"),
    gutil = require("gulp-util"),
    http = require("http"),
    less = require("gulp-less"),
    merge = require("merge-stream"),
    minifyCss = require("gulp-cssnano"),
    minifyHtml = require("gulp-htmlmin"),
    nunjucks = require("gulp-nunjucks-render"),
    path = require("path"),
    source = require("vinyl-source-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    watchify = require("watchify");

var PRODUCTION = process.env.NODE_ENV === "production";

/* LESS */

gulp.task("build-less", function() {
  var ret = gulp.src(["less/**/*.less", "!less/**/_*.less"])
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', function(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }));

  if (PRODUCTION) {
    ret = ret
      .pipe(minifyCss({ zindex: false }))
      .pipe(sourcemaps.write("./"))
  } else {
    ret = ret.pipe(sourcemaps.write());
  }

  return ret.pipe(gulp.dest("./pub/css"));
});

gulp.task("watch-less",function() {
  return gulp.watch("./less/**/*.less", gulp.series("build-less"));
});


/* ES6/Babel */

function compileES6(entry, watch) {
  var bundler = watchify(browserify(entry, {
    debug: true // Always write sourcemaps
  }).transform(babel, {presets: ["es2015"]}));

  var target = path.basename(entry);
  target = target.substr(0, target.lastIndexOf(".")) + ".js";

  function rebundle() {
    var b = bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source(target))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }));

    if (PRODUCTION) {
      b = b
        .pipe(uglify({
          output: {
            "ascii_only": true
          }
        }))
        .pipe(sourcemaps.write("./"))
    } else {
      b = b.pipe(sourcemaps.write());
    }

    return b.pipe(gulp.dest('./pub/js'))
      .on('end', function(){ gutil.log(target + ' done!'); });
  }

  if (watch) {
    bundler.on('update', function() {
      gutil.log('Bundling ' + target + " ...");
      rebundle();
    });
  }

  return rebundle();
}

gulp.task("build-es6", function() {
  return merge(
    compileES6("./js/index.es6"),
    compileES6("./js/registry.es6")
  );
});

gulp.task("watch-es6", function() {
  return merge(
    compileES6("./js/index.es6", true),
    compileES6("./js/registry.es6", true)
  );
});


/* HTML */

gulp.task("build-html", function() {
  var ret = gulp.src(["html/**/*.html", "!html/**/_*.html"])
    .pipe(nunjucks({
      path: ['html']
    }))
    .on('error', function(err) {
      console.error(err.toString());
      this.emit('end');
    });

  if (PRODUCTION) {
    ret = ret.pipe(minifyHtml({
      collapseWhitespace: true,
      conservativeCollapse: true
    }));
  }

  return ret.pipe(gulp.dest("./pub"));
});

gulp.task("watch-html", function() {
  return gulp.watch("html/**/*.html", gulp.series("build-html"));
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
                "build-html",
                "build-es6",
                "build-less")));

gulp.task("watch", gulp.series("build",
  gulp.parallel(
    "dev-server",
    "watch-html",
    "watch-es6",
    "watch-less",
    "watch-assets"
  )
));

gulp.task("prod", gulp.series(function(cb) {
  process.env.NODE_ENV = "production";
  PRODUCTION = true;
  cb();
}, "build"))

gulp.task("default", gulp.series("build"));
