const gulp = require('gulp');
const rename = require('gulp-rename');
const less = require('gulp-less');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync');

module.exports = function (config, preProcName) {
  var preproc = (preProcName === 'scss' || preProcName === 'sass') ? sass : less;
	return gulp.src(config.src)
		.pipe(preproc())
		.pipe(postcss([
			autoprefixer({
        browsers: 'last 2 versions'
      }),
			cssnano()
		]))
		.pipe(rename(config.name))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
};
