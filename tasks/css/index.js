const gulp = require('gulp');
const rename = require('gulp-rename');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync');

module.exports = function (config) {
	return gulp.src(config.src)
		.pipe(less())
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
