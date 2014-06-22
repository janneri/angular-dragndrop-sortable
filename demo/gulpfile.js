var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    serve = require('gulp-serve'),
    embedlr = require('gulp-embedlr'),
    jshint = require('gulp-jshint');

 
gulp.task('default', ['watch']);

gulp.task('statics', serve({
  port: 3000,
  root: ['./.tmp']
}));

gulp.task('jshint', function() {
  return gulp.src(['./gulpfile.js', './app/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js', function () {
    console.log("js changed");
    gulp.src("./app/*.js")
        .pipe(gulp.dest("./.tmp"))
        .pipe(livereload());
});


gulp.task('index', function () {
    gulp.src("./app/*.html")
        .pipe(embedlr())
        .pipe(gulp.dest("./.tmp"))
        .pipe(livereload());
});

gulp.task('watch', ['index', 'js', 'statics'], function () {
    gulp.watch('./app/*.js', ['js']);
    gulp.watch('./app/*.html', ['index']);
});
