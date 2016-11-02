var gulp          = require('gulp');
var notify        = require('gulp-notify');
var fs            = require('fs');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync').create();

gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: {
      baseDir: './'
    },
    files: ['./**/*.html'],
    rewriteRules: [
      {
        match: /@include\("(.+?)"\)/g,
        fn: function (match, filename) {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename);
          } else {
            return '<span style="color: red">'+filename+' not found.</span>';
          }
        }
      }
    ]
  });

  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js').on('change', browserSync.reload);
  gulp.watch('*.html').on('change', browserSync.reload);

});


gulp.task('sass', function () {
  gulp.src('sass/**/*.scss')
    .pipe(sass())
    .on('error', notify.onError({
      message: 'Error: <%= error.message %>'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('css/'))
    .pipe(notify({ message: 'sass task complete' }))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
