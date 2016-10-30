const gulp = require('gulp');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

module.exports = function (config) {
  return gulp.src(config.src)
    .pipe(imagemin())
    .pipe(gulpIf(config.name, rename(config.name)))
    .pipe(gulp.dest(config.dest));
};
