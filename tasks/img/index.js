const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

module.exports = function (config) {
  return gulp.src(config.src)
    .pipe(imagemin())
    .pipe(gulp.dest(config.dest));
};
