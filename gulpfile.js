import gulp from 'gulp';
import browserSync from 'browser-sync';
import cssImport from 'gulp-cssimport';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import {deleteAsync} from 'del';

const isPreproc = true;
const sass = gulpSass(dartSass);

export const html = () => gulp
    .src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());

export const style = () => {
  if (isPreproc) {
    return gulp
        .src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
  }

  return gulp
      .src('src/css/main.css')
      .pipe(cssImport({
        extensions: ['css'],
      }))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
};

export const js = () => gulp
    .src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());

export const copy = () => gulp
    .src(['src/fonts/**/*', 'src/img/**/*'], {
      base: 'src',
      encoding: false,
    })
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream({
      once: true,
    }));

export const server = () => {
  browserSync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist',
    },
  });

  gulp.watch('./src/**/*.html', html);
  gulp.watch(isPreproc ? './src/sass/**/*.scss' : './src/css/**/*.css', style);
  gulp.watch('./src/js/**/*.js', js);
  gulp.watch(['./src/fonts/**/*', './src/img/**/*'], copy);
};

export const clear = (done) => {
  deleteAsync('dist/**/*', {
    force: true,
  });
  done();
};

export const base = gulp.parallel(html, style, js, copy);

export const build = gulp.series(clear, base);

export default gulp.series(base, server);
