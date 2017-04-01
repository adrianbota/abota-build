const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');

module.exports = function (config) {
  return gulp.src(config.src)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(config.dest));
};
