'use strict'

const gulp = require('gulp');
const browserSync = require('browser-sync');
const hbs = require('gulp-compile-handlebars');
const yaml = require('js-yaml');
const fs = require('fs');
const data = require('gulp-data');
const juice = require('gulp-juice');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const argv = require('yargs').argv;
const rename = require('gulp-rename');


let opts = {
  template: argv.t || 'template-1',
  data: argv.d || '1'
}


gulp.task('template', function() {
  return gulp.src(`./templates/${opts.template}/*.hbs`)
    .pipe(data(function() {
      return yaml.safeLoad(fs.readFileSync(`./data/${opts.data}.yaml`));
    }))
    .pipe(hbs(null, {
      helpers: {
        inc: function(value) {
          return parseInt(value) + 1;
        }
      }
    }))
    .pipe(juice({
      removeStyleTags: false,
      webResources: {
        images: false,
        relativeTo: `./templates/${opts.template}/`
      }
    }))
    .pipe(rename(`issue${opts.data}.html`))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  return gulp.src('src/images/**')
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images/'));
})

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: 'dist',
      index: `issue${opts.data}.html`
    }
  });
  gulp.watch(['templates/**/*.hbs', 'templates/**/*.css', 'data/*.yaml'], ['template']);
});

gulp.task('default', ['serve', 'template', 'images']);