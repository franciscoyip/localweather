var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();


browserSync.stream();

gulp.task('serve', ['styles'], function(){

  gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch(["/index.html", "scripts/app.js"]).on('change', browserSync.reload);
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

gulp.task('default', ['serve']);
