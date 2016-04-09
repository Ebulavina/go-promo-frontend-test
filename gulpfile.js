var sources, destinations, lr, gulp, gutil, jade, stylus;

gulp = require('gulp');
jade = require('gulp-jade');
gutil = require('gulp-util');
stylus = require('gulp-stylus');
lr = require('tiny-lr')();

sources = {
  jade: "jade/**/*.jade",
  stylus: "stylus/**/*.stylus",
};

destinations = {
  html: "public/",
  css: "public/css"
};

gulp.task("jade", function(event) {
  return gulp.src("jade/**/*.jade").pipe(jade({
    pretty: true
  })).pipe(gulp.dest(destinations.html));
});

gulp.task("stylus", function(event) {
  return gulp.src("stylus/**/*.stylus").pipe(stylus({
    style: "compressed"
  })).pipe(gulp.dest(destinations.css));
});

gulp.task("watch", function() {
  gulp.watch(sources.jade, ["jade"]);
  gulp.watch(sources.stylus, ["stylus"]);
  gulp.watch('public/**/*', refresh);
});

gulp.task('serve', function () {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(__dirname+'/public/'));
  app.listen(4000);
  lr = require('tiny-lr')();
  lr.listen(35729);
});

gulp.task("default", ["jade", "stylus", "watch", "serve"]);

refresh = function(event) {
  var fileName = require('path').relative(__dirname, event.path);
  gutil.log.apply(gutil, [gutil.colors.magenta(fileName), gutil.colors.cyan('built')]);
  lr.changed({
    body: { files: [fileName] }
  });
}
