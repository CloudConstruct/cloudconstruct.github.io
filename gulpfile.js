var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  cachebust = require('gulp-cache-bust');

// JS
gulp.task('js', function () {
  return gulp
    .src(['./Assets/Scripts/site.js'])
    .pipe(concat('main.js'))
    .pipe(
      cachebust({
        type: 'timestamp',
      })
    )
    .pipe(gulp.dest('./dist/Assets/js/'));
});

// sass task
gulp.task('sass', function () {
  return gulp
    .src(['./Assets/Styles/general.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(
      cachebust({
        type: 'timestamp',
      })
    )
    .pipe(gulp.dest('./dist/Assets/css/'));
});

// Minify CSS
gulp.task('minify-css', () => {
  return gulp
    .src('./dist/Assets/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/Assets/css'));
});

// Asset copy
gulp.task('Assets', function () {
  return gulp
    .src('./Assets/@(Icons|Images)/**/*.*')
    .pipe(gulp.dest('./dist/Assets/'));
});

// local server for dev
gulp.task('serve', function () {
  gulp.src('./dist').pipe(
    webserver({
      port: '9090',
      livereload: true,
      open: true,
      fallback: 'index.html',
    })
  );
});

// Watchers
gulp.task(
  'watch',
  gulp.series(function () {
    gulp.watch(['./Assets/Styles/*.scss'], gulp.series('sass', 'minify-css'));
    gulp.watch(['./Assets/scripts/*.js'], gulp.series('js'));
  })
);

gulp.task(
  'build',
  gulp.parallel(['js', 'Assets', gulp.series(['sass', 'minify-css'])])
);

gulp.task('default', gulp.series('build', gulp.parallel(['serve', 'watch'])));
