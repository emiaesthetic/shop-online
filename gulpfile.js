// gulp
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import { deleteSync } from 'del';

// html
import htmlMin from 'gulp-htmlmin';

// css
import sass from 'sass';
import gulpSass from 'gulp-sass';
const compSass = gulpSass(sass);

import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import gcmq from 'gulp-group-css-media-queries';
import { stream as critical } from 'critical';

// js
import terser from 'gulp-terser';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';

// img
import gulpImg from 'gulp-image';
import gulpWebp from 'gulp-webp';
import gulpAvif from 'gulp-avif';
import svgSprite from 'gulp-svg-sprite';

let dev = false;

const develop = ready => {
  dev = true;
  ready();
};

const path = {
  dist: {
    base: 'dist/',
    html: 'dist/',
    critical: 'dist/*.html',
    js: 'dist/js/',
    css: 'dist/css/',
    cssIndex: 'dist/css/app.min.css',
    img: 'dist/img/',
    fonts: 'dist/fonts/',
  },
  src: {
    base: 'src/',
    html: 'src/*.html',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/app.js',
    img: 'src/img/**/*.*',
    svg: 'src/svg/**/*.svg',
    imgF: 'src/img/**/*.{jpg,jpeg,png}',
    assets: ['src/fonts/**/*.*'],
  },
  watch: {
    html: 'src/*.html',
    js: 'src/**/*.js',
    css: 'src/**/*.scss',
    svg: 'src/svg/**/*.svg',
    img: 'src/img/**/*.*',
    imgF: 'src/img/**/*.{jpg,jpeg,png}',
  },
};

// html

export const html = () =>
  gulp
    .src(path.src.html)
    .pipe(
      gulpIf(
        !dev,
        htmlMin({
          removeComments: true,
          collapseWhitespace: true,
        }),
      ),
    )
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.stream());

// css

export const scss = () =>
  gulp
    .src(path.src.scss)
    .pipe(gulpIf(dev, sourcemaps.init()))
    .pipe(compSass().on('error', compSass.logError))
    .pipe(
      gulpIf(
        !dev,
        autoprefixer({
          cascade: false,
          grid: false,
        }),
      ),
    )
    .pipe(gulpIf(!dev, gcmq()))
    .pipe(gulpIf(!dev, gulp.dest(path.dist.css)))
    .pipe(
      gulpIf(
        !dev,
        cleanCSS({
          2: {
            specialComments: 0,
          },
        }),
      ),
    )
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(gulpIf(dev, sourcemaps.write()))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.stream());

// js

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
    rules: [],
  },
};

if (!dev) {
  webpackConf.module.rules.push({
    test: /\.(js)$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
  });
}

export const js = () =>
  gulp
    .src(path.src.js)
    .pipe(plumber())
    .pipe(webpackStream(webpackConf, webpack))
    .pipe(gulpIf(!dev, gulp.dest(path.dist.js)))
    .pipe(gulpIf(!dev, terser()))
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.stream());

export const img = () =>
  gulp
    .src(path.src.img, {
      encoding: false,
    })
    .pipe(
      gulpIf(
        !dev,
        gulpImg({
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
        }),
      ),
    )
    .pipe(gulp.dest(path.dist.img))
    .pipe(
      browserSync.stream({
        once: true,
      }),
    );

export const svg = () =>
  gulp
    .src(path.src.svg)
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
      }),
    )
    .pipe(gulp.dest(path.dist.img))
    .pipe(
      browserSync.stream({
        once: true,
      }),
    );

export const webp = () =>
  gulp
    .src(path.src.imgF, {
      encoding: false,
    })
    .pipe(
      gulpWebp({
        quality: dev ? 100 : 60,
      }),
    )
    .pipe(gulp.dest(path.dist.img))
    .pipe(
      browserSync.stream({
        once: true,
      }),
    );

export const avif = () =>
  gulp
    .src(path.src.imgF, {
      encoding: false,
    })
    .pipe(
      gulpAvif({
        quality: dev ? 100 : 50,
      }),
    )
    .pipe(gulp.dest(path.dist.img))
    .pipe(
      browserSync.stream({
        once: true,
      }),
    );

export const critCSS = () =>
  gulp
    .src(path.dist.critical)
    .pipe(
      critical({
        base: path.dist.base,
        inline: true,
        css: [path.dist.cssIndex],
      }),
    )
    .on('error', err => {
      console.error(err.message);
    })
    .pipe(gulp.dest(path.dist.base));

export const copy = () =>
  gulp
    .src(path.src.assets, {
      base: path.src.base,
      encoding: false,
    })
    .pipe(gulp.dest(path.dist.base))
    .pipe(
      browserSync.stream({
        once: true,
      }),
    );

export const server = () => {
  browserSync.init({
    ui: false,
    notify: false,
    host: 'localhost',
    port: 3001,
    // tunnel: true,
    server: {
      baseDir: 'dist',
    },
  });

  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.css, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.svg, svg);
  gulp.watch(path.watch.img, img);
  gulp.watch(path.watch.imgF, webp);
  gulp.watch(path.watch.imgF, avif);
};

export const clear = done => {
  deleteSync([path.dist.base], {
    force: true,
  });
  done();
};

export const base = gulp.parallel(html, scss, js, img, svg, webp, avif, copy);

export const build = gulp.series(clear, base, critCSS);

export default gulp.series(develop, base, server);
