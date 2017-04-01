const gulp = require('gulp');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const UglifyJsPlugin = webpack.webpack.optimize.UglifyJsPlugin;
const plumber = require('gulp-plumber');

module.exports = function (config) {
  return gulp.src(config.src)
    .pipe(plumber())
    .pipe(webpack({
      devtool: 'source-map',
      output: {
        filename: config.name
      },
      plugins: [
        new UglifyJsPlugin()
      ]
    }))
    .pipe(gulp.dest(config.dest));
};
