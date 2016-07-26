var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var pump = require('pump');
var browserSync = require('browser-sync').create();


browserSync.stream();

gulp.task('serve', ['styles', 'compress', 'copy-html'], function(){

  gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch('scripts/app.js', ['compress']);
  gulp.watch('./index.html', ['copy-html']);
  gulp.watch(["dist/index.html", "dist/scripts/app.js"]).on('change', browserSync.reload);
  browserSync.init({
    server: "./dist"
  });

});

gulp.task('styles', function(){
  gulp.src('sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css/'))
      .pipe(browserSync.stream());
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('scripts/*.js'),
        uglify(),
        gulp.dest('dist/scripts')
    ],
    cb
  );
});

gulp.task('copy-html', function() {
    gulp.src('./index.html')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['serve']);
