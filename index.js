const gulp = require('gulp');
const del = require('del');
const js = require('./tasks/js');
const css = require('./tasks/css');
const html = require('./tasks/html');
const img = require('./tasks/img');
const assign = require('lodash.assign');
const forEach = require('lodash.foreach');
const idxTmpl = require('index-template');
const browserSync = require('browser-sync');

module.exports = function (options) {
  var jsMap = assign({ 'main.js': 'script.js' }, options.js);
  var cssMap = assign({ 'main.less': 'style.css' }, options.css);
  var htmlMap = assign({ 'index.html': 'index.html' }, options.html);
  var distSrc = [].concat(options.dist || []);

  var miscSrc = [
    'src/robots.txt',
    'src/favicon.*',
    'src/CNAME'
  ].concat(options.misc || []);

  var distTask = function () {
    gulp.src(distSrc).pipe(gulp.dest('dist'));
  };

  gulp.task('clean', function () {
    del.sync([
      'dist/**/*',
      'docs/**/*'
    ]);
  });

  gulp.task('js', function () {
    forEach(jsMap, function (srcFile, destFile) {
      js({
        src: idxTmpl('src/js/{0}', srcFile),
        dest: 'docs/js',
        name: idxTmpl('{0}', destFile)
      });
    });
  });

  gulp.task('css', function () {
    forEach(cssMap, function (srcFile, destFile) {
      css({
        src: idxTmpl('src/less/{0}', srcFile),
        dest: 'docs/css',
        name: idxTmpl('{0}', destFile)
      });
    });
  });

  gulp.task('html', function () {
    forEach(htmlMap, function (srcFile, destFile) {
      html({
        src: idxTmpl('src/{0}', srcFile),
        dest: 'docs',
        name: idxTmpl('{0}', destFile)
      });
    });
  });

  gulp.task('img', function () {
    img({
      src: 'src/img/**/*',
      dest: 'docs/img'
    });
  });

  gulp.task('misc', function () {
    gulp.src(miscSrc).pipe(gulp.dest('docs'));
  });

  gulp.task('dist', distTask);
  gulp.task('build', ['clean', 'js', 'css', 'html', 'img', 'misc'], distTask);

  gulp.task('dev', ['build'], function () {
    browserSync.init({ server: 'docs' });
    gulp.watch('src/less/*/**.less', ['css']);
    gulp.watch('src/js/**/*.js', ['js']).on('change', browserSync.reload);
    gulp.watch('src/**/*.html', ['html']).on('change', browserSync.reload);
    gulp.watch('src/img/**/*', ['img']).on('change', browserSync.reload);
    gulp.watch(miscSrc, ['misc']).on('change', browserSync.reload);
    gulp.watch(distSrc, ['dist']);
  });

  gulp.task('default', ['build']);
};
