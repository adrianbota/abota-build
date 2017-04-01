const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const plumber = require('gulp-plumber');

module.exports = function (jsSrc) {
  return gulp.src(jsSrc)
    .pipe(plumber())
    .pipe(istanbul({ includeUntested: true }))
    .pipe(istanbul.hookRequire());
};
