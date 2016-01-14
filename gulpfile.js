const gulp = require('gulp');
const browserSync = require('browser-sync');
const juice = require('gulp-juice');
const autoprefixer = require('gulp-html-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(juice({
      removeStyleTags: false,
      webResources: {
        images: false
      }
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/'))
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
    server: 'dist/'
  });
  gulp.watch(['src/**/*.html', 'src/**/*.css'], ['html']);
});

gulp.task('default', ['serve', 'html', 'images']);