import gulp from 'gulp';
import browserSync from 'browser-sync';
import cssImport from 'gulp-cssimport';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import {deleteAsync} from 'del';
import htmlMin from 'gulp-htmlmin';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import plumber from 'gulp-plumber';
import gulpIf from 'gulp-if';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import rename from 'gulp-rename';
import gulpImg from 'gulp-image';
import filter from 'gulp-filter';
import gulpWebp from 'gulp-webp';
import gulpAvif from 'gulp-avif';
import {stream as critical} from 'critical';
import autoprefixer from 'gulp-autoprefixer';

let dev = false;
const isPreproc = true;
const sass = gulpSass(dartSass);

const webpackConf = {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-source-map' : false,
  optimization: {
    minimize: false,
  },
  output: {
    filename: 'index.js',
  },
  module: {
    rules: [
    ],
  },
};

if (!dev) {
  webpackConf.module.rules.push({
    test: /\.(js)$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
  });
}

export const html = () => gulp
    .src('src/*.html')
    .pipe(htmlMin({
      removeComments: true,
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());

export const style = () => {
  if (isPreproc) {
    return gulp
        .src('src/sass/**/*.scss')
        .pipe(gulpIf(dev, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
          2: {
            specialComments: 0,
          },
        }))
        .pipe(
            rename({
              suffix: '.min',
            }),
        )
        .pipe(gulpIf(dev, sourcemaps.write('../maps')))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
  }

  return gulp
      .src('src/css/main.css')
      .pipe(gulpIf(dev, sourcemaps.init()))
      .pipe(cssImport({
        extensions: ['css'],
      }))
      .pipe(autoprefixer())
      .pipe(cleanCSS({
        2: {
          specialComments: 0,
        },
      }))
      .pipe(
          rename({
            suffix: '.min',
          }),
      )
      .pipe(gulpIf(dev, sourcemaps.write('../maps')))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
};

export const js = () => gulp
    .src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(webpackStream(webpackConf, webpack))
    .pipe(gulpIf(!dev, gulp.dest('dist/js')))
    .pipe(gulpIf(dev, sourcemaps.init()))
    .pipe(gulpIf(!dev, terser()))
    .pipe(
        rename({
          suffix: '.min',
        }),
    )
    .pipe(gulpIf(dev, sourcemaps.write('../maps')))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());

const imgFilter = filter(['**/*', '!**/svgsprite.svg'], {restore: true});
export const img = () => gulp
    .src('src/img/**/*.{jpg,jpeg,png,svg}', {
      encoding: false,
    })
    .pipe(imgFilter)
    .pipe(gulpIf(!dev, gulpImg({
      optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
      pngquant: ['--speed=1', '--force', 256],
      zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
      jpegRecompress: [
        '--strip',
        '--quality',
        'medium',
        '--min',
        40,
        '--max',
        80,
      ],
      mozjpeg: ['-optimize', '-progressive'],
      gifsicle: ['--optimize'],
      svgo: true,
    })))
    .pipe(imgFilter.restore)
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());

export const webp = () => gulp
    .src('src/img/**/*.{jpg,jpeg,png}', {
      encoding: false,
    })
    .pipe(gulpIf(!dev, gulpWebp({
      quality: 60,
    })))
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());

export const avif = () => gulp
    .src('src/img/**/*.{jpg,jpeg,png}', {
      encoding: false,
    })
    .pipe(gulpAvif({
      quality: 60,
    }))
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());

export const critCSS = () => gulp
    .src('dist/*.html')
    .pipe(critical({
      base: 'dist/',
      inline: true,
      css: ['dist/css/main.min.css'],
    }))
    .pipe(gulp.dest('dist'));

export const copy = () => gulp
    .src('src/fonts/**/*', {
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
  gulp.watch('./src/img/**/*.{jpg,jpeg,png,svg}', img);
  gulp.watch('./src/img/**/*.{jpg,jpeg,png}', webp);
  gulp.watch('./src/img/**/*.{jpg,jpeg,png}', avif);
  gulp.watch('./src/fonts/**/*', copy);
};

export const clear = (done) => {
  deleteAsync('dist/**/*', {
    force: true,
  });
  done();
};

export const develop = async () => {
  dev = true;
};

export const base = gulp.parallel(html, style, js, img, avif, webp, copy);

export const build = gulp.series(clear, base, critCSS);

export default gulp.series(develop, base, server);
