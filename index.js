const gulp = require('gulp');
const del = require('del');
const js = require('./tasks/js');
const css = require('./tasks/css');
const html = require('./tasks/html');
const img = require('./tasks/img');
const preTest = require('./tasks/pre-test');
const test = require('./tasks/test');
const clone = require('lodash.clone');
const forEach = require('lodash.foreach');
const idxTmpl = require('index-template');
const browserSync = require('browser-sync');
const merge = require('merge-stream');
const fileExtension = require('file-extension');

module.exports = function (options) {
  options = (options || {});

  const jsCfg = clone(options.js || { 'main.js': 'script.js' });
  const cssCfg = clone(options.css || { 'main.less': 'style.css' });
  const htmlCfg = clone(options.html || { 'index.html': 'index.html' });
  const miscSrc = clone(options.misc || ['.nojekyll', 'src/robots.txt', 'src/favicon.*', 'src/CNAME']);
  const distSrc = clone(options.dist || []);

  const distTask = function () {
    return gulp.src(distSrc).pipe(gulp.dest('dist'));
  };

  const guessCSSPreProc = function (fileName) {
    var ext = fileExtension(fileName);
    return  (ext === 'scss' || ext === 'sass') ? ext : 'less';
  };

  gulp.task('clean', function () {
    return del.sync([
      'dist/**/*',
      'docs/**/*'
    ]);
  });

  gulp.task('js', function () {
    var streams = [];
    forEach(jsCfg, function (destFile, srcFile) {
      streams.push(js({
        src: idxTmpl('src/js/{0}', srcFile),
        dest: 'docs/js',
        name: idxTmpl('{0}', destFile)
      }));
    });
    return merge(streams);
  });

  gulp.task('css', function () {
    var streams = [];
    forEach(cssCfg, function (destFile, srcFile) {
      var preProcName = guessCSSPreProc(srcFile);
      var parentDir = preProcName;
      streams.push(css({
        src: idxTmpl('src/{0}/{1}', parentDir, srcFile),
        dest: 'docs/css',
        name: idxTmpl('{0}', destFile)
      }, preProcName));
    });
    return merge(streams);
  });

  gulp.task('html', function () {
    var streams = [];
    forEach(htmlCfg, function (destFile, srcFile) {
      streams.push(html({
        src: idxTmpl('src/{0}', srcFile),
        dest: 'docs',
        name: idxTmpl('{0}', destFile)
      }));
    });
    return merge(streams);
  });

  gulp.task('img', function () {
    del.sync('docs/img/**/*');
    return img({
      src: 'src/img/**/*',
      dest: 'docs/img'
    });
  });

  gulp.task('misc', function () {
    return gulp.src(miscSrc).pipe(gulp.dest('docs'));
  });

  gulp.task('dist', distTask);
  gulp.task('build', ['clean', 'js', 'css', 'html', 'img', 'misc'], distTask);

  gulp.task('dev', ['build'], function () {
    browserSync.init({ server: 'docs' });
    gulp.watch('src/less/**/*.less', ['css']);
    gulp.watch('src/scss/**/*.scss', ['css']);
    gulp.watch('src/sass/**/*.sass', ['css']);
    gulp.watch('src/js/**/*.js', ['js']).on('change', browserSync.reload);
    gulp.watch('src/**/*.html', ['html']).on('change', browserSync.reload);
    gulp.watch('src/img/**/*', ['img']).on('change', browserSync.reload);
    gulp.watch(miscSrc, ['misc']).on('change', browserSync.reload);
    gulp.watch(distSrc, ['dist']);
  });

  gulp.task('pre-test', function () {
    return preTest('src/js/**/*.js');
  });

  gulp.task('test', ['pre-test'], function () {
    return test('test');
  });

  gulp.task('tdd', ['test'], function () {
    gulp.watch('src/js/**/*.js', ['test']);
    gulp.watch('test/**/*-spec.js', ['test']);
  });

  gulp.task('default', ['test', 'build']);
};
