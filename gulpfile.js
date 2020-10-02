var gulp = require('gulp'),
    webserver = require("gulp-webserver"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    sass = require("gulp-sass"),
    autoprefixer = require('gulp-autoprefixer'),
		cleanCSS = require("gulp-clean-css");
		cachebust = require('gulp-cache-bust');

// JS
gulp.task('js', gulp.parallel(function () {
    // gulp.src(['./src/js/vendor/**/*.*'])
    //     .pipe(gulp.dest('./js/vendor/'));
    return gulp.src(['./Assets/Scripts/site.js'])
				.pipe(concat('main.js'))
				.pipe(cachebust({
					type: 'timestamp'
				}))
        .pipe(gulp.dest('./Assets/dist/js/'));
}));


// sass task
gulp.task('sass', gulp.parallel(function() {
    return gulp.src(['./Assets/Styles/general.scss'])
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
				.pipe(sourcemaps.write('.'))
				.pipe(cachebust({
					type: 'timestamp'
				}))
        .pipe(gulp.dest('./Assets/dist/css/'));
}));

// Minify CSS
gulp.task('minify-css', gulp.parallel(() => {
    return gulp.src('./Assets/dist/css/*.css')
      .pipe(sourcemaps.init())
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('.'));
  }));

// local server for dev
gulp.task('serve', function() {
  gulp.src('./')
    .pipe(webserver({
      port:'9090',
      livereload: true,
      open: true
    }));
});


// Watchers
gulp.task('watch', gulp.series(function() {
    gulp.watch([
        './Assets/Styles/*.scss'
    ], gulp.series('sass', 'minify-css'));
    gulp.watch([
        './Assets/scripts/*.js'
    ],  gulp.series('js'));    
}));



gulp.task('default', gulp.series(['sass', 'js', 'minify-css'], gulp.parallel(['serve', 'watch'])));
