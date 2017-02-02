const gulp         = require('gulp');
const config       = require('../config');
const fs           = require('fs');
const sass         = require('gulp-sass');
const plumber      = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const notify       = require('gulp-notify');
const sourcemaps   = require('gulp-sourcemaps');
const gutil        = require("gulp-util");
const size         = require('gulp-size');
const scsslint     = require('gulp-scss-lint');
const csso         = require("gulp-csso");
const options      = require('minimist')(process.argv.slice(2));

const createNormalizeScss = () => {
  fs.createReadStream(config.styles.file_normalize_css)
    .pipe(fs.createWriteStream(config.styles.file_normalize_scss));
}

gulp.task('normalize', () => {
  createNormalizeScss();
});

gulp.task('styles', () => {
  return gulp.src(config.styles.files_src)
    .pipe(plumber({
      errorHandler: notify.onError('SASS Error: <%= error.message %>')
    }))
    .pipe(!options.production ? sourcemaps.init() : gutil.noop())
    .pipe(sass({ precision: 10 }))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(!options.production ? sourcemaps.write('.') : gutil.noop())
    .pipe(options.production ? csso() : gutil.noop())
    .pipe(size({ title: 'style' }))
    .pipe(gulp.dest(config.styles.dest));
});

gulp.task('scsslinter', () => {
  return gulp.src([
    config.styles.files_src,
    '!' + config.styles.file_normalize_scss,
    '!' + config.font_icon.path_create_icon_font_file,
    '!' + config.font_icon.path
  ])
    .pipe(plumber({
      errorHandler: notify.onError('SASS Error: <%= error.message %>')
    }))
    .pipe(scsslint({
      'bundleExec': true,
      'config': 'scss-lint.yml'
    }))
});
