const gulp = require('gulp');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const UglifyJsPlugin = webpack.webpack.optimize.UglifyJsPlugin;

module.exports = function (config) {
  return gulp.src(config.src)
    .pipe(webpack({
      devtool: 'source-map',
      plugins: [
        new UglifyJsPlugin()
      ]
    }))
    .pipe(gulpIf(config.name, rename(config.name)))
    .pipe(gulp.dest(config.dest));
};
