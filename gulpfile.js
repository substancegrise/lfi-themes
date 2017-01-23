// Include gulp.
var gulp = require('gulp');
var config = require('./config.json');

// Include plugins.
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var shell = require('gulp-shell');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefix = require('gulp-autoprefixer');
var glob = require('gulp-sass-glob');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

// CSS.
gulp.task('lficss', function() {
  return gulp.src(config.lficss.src)
    .pipe(glob())
    .pipe(concat(config.lficss.file))
    .pipe(plumber({
      errorHandler: function (error) {
        notify.onError({
          title:    "Gulp",
          subtitle: "Failure!",
          message:  "Error: <%= error.message %>",
          sound:    "Beep"
        }) (error);
        this.emit('end');
      }}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      style: 'compressed',
      errLogToConsole: true,
      includePaths: config.lficss.includePaths
    }))
    .pipe(autoprefix('last 2 versions', '> 1%', 'ie 9', 'ie 10'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.lficss.dest));
});

// JS
gulp.task('lfijs', function() {
  return gulp.src(config.lfijs.src)
    .pipe(sourcemaps.init())
    .pipe(concat(config.lfijs.file))
    .pipe(plumber({
      errorHandler: function (error) {
        notify.onError({
          title:    "JS",
          subtitle: "Failure!",
          message:  "Error: <%= error.message %>",
          sound:    "Beep"
        }) (error);
        this.emit('end');
      }}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.lfijs.dest));
});

// Compress images.
gulp.task('images', function () {
  return gulp.src(config.images.src)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest(config.images.dest));
});

// Fonts.
gulp.task('fonts', function() {
  return gulp.src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dest));
});

// Static Server + Watch
gulp.task('serve', ['fonts', 'lficss', 'lfijs'], function() {
  /*
  browserSync.init({
    proxy: config.browserSyncProxy,
    notify: false,
    browser: "chrome"
  });
  */
  gulp.watch(
  		config.lficss.src, {
        interval: 1000, // default 100
        debounceDelay: 500, // default 500
        mode: 'poll'
    	}, ['lficss']);
  gulp.watch(
  		config.lfijs.src, {
        interval: 1000, // default 100
        debounceDelay: 500, // default 500
        mode: 'poll'
    	}, ['lfijs']);
  gulp.watch('assets/**/*');
});

// Run drush to clear the theme registry.
gulp.task('drush', shell.task([
  'drush cache-clear theme-registry'
]));

// Default Task
gulp.task('default', ['serve']);
