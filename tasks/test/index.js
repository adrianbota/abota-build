const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const jasmine = require('gulp-jasmine');
const Reporter = require('jasmine-console-reporter');
const plumber = require('gulp-plumber');

module.exports = function (testDir) {
  return gulp.src(testDir + '/**/*-spec.js')
    .pipe(plumber())
    .pipe(jasmine({
      includeStackTrace: true,
      errorOnFail: false,
      reporter: new Reporter(),
      config: {
        spec_dir: testDir,
        spec_files: [
          '**/*-spec.js'
        ]
      }
    }))
    .pipe(istanbul.writeReports({
      dir: testDir + '/_coverage',
      reporters: ['lcov', 'json']
    }));
};
