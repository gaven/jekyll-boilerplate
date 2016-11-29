'use strict';

import browsersync from 'browser-sync';
import cp from 'child_process';
import gulp from 'gulp';
import requireDir from 'require-dir';
import group from 'gulp-group-css-media-queries';
import loadPlugins from 'gulp-load-plugins';
import webpack from 'webpack-stream';

const $ = loadPlugins();
const reload = browsersync.reload;

gulp.task('default', ['browser-sync'], () => {
  gulp.watch(['./_app/styles/**/*.scss'], ['sass', 'build:reload']);
  gulp.watch(['./_app/scripts/**/*.js'], ['js']);
  gulp.watch(['./_app/images/**/*'], ['imagemin']);
  gulp.watch(['**/*.html', '**/*.md', '!_site/**/*.*'], ['build:reload']);
});

gulp.task('build', (done) => {
  return cp.spawn('jekyll', ['build', '--drafts'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('build:reload', ['build'], () => { reload(); });

gulp.task('deploy', ['htmlmin'], () => {
  return gulp.src('./_site/**/*').pipe($.ghPages({branch: 'prod'}));
});

gulp.task('htmlmin', ['build:prod'], () => {
  return gulp.src('./_site/**/*.html')
    .pipe($.htmlmin( {collapseWhitespace: true}))
    .pipe(gulp.dest('./_site/'))
    .pipe(reload({stream: true}));
});

gulp.task('build:prod', ['js', 'sass', 'imagemin'], (done) => {
  let productionEnv = process.env;
      productionEnv.JEKYLL_ENV = 'production';

  return cp.spawn('jekyll', ['build'], {stdio: 'inherit' , env: productionEnv}).on('close', done);
});

gulp.task('browser-sync', ['js', 'sass', 'imagemin', 'build'], () => {
  browsersync({
    server: {
      baseDir: '_site'
    },
    ghostMode: {
      clicks: true,
      forms: true
    },
    open: false
  });
});

gulp.task('sass', () => {
  return gulp.src('_app/styles/styles.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['sass'],
      onError: browsersync.notify
    }))
    .pipe($.autoprefixer(['last 15 versions', '> 1%', 'ie 8'], {cascade: true}))
    .pipe(group())
    .pipe($.rename({extname: '.css'}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(reload({stream: true}))
    .pipe($.cleanCss({
      keepBreaks: false,
      keepSpecialComments:true
    }))
    .pipe($.rename({extname: '.min.css'}))
    .pipe(gulp.dest('./css'));
});

gulp.task('js', () => {
  return gulp.src('./_app/scripts/global.js')
    .pipe(webpack({
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel',
          exclude: '/node_modules/',
          query: { compact: false }
        }]
      }
    }))
    .pipe($.rename('app.js'))
    .pipe(gulp.dest('./scripts'))
    .pipe(reload({stream: true}))
    .pipe($.uglify({onError: browsersync.notify}))
    .pipe($.rename({extname: '.min.js'}))
    .pipe(gulp.dest('./scripts'));
});

gulp.task('imagemin', () => {
  return gulp.src('_assets/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('_site/assets'));
});

gulp.task('build:svgs', () => {
  return gulp.src('./_app/svgs/*.svg')
    .pipe($.changed('./_app/svgs/*.svg'))
    .pipe($.rename({prefix: 'icon-'}))
    .pipe($.svgmin(function (file) {
      const prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-'
          }
        }, {
          removeUselessStrokeAndFill: true
        }, {
          removeDimensions: true
        }, {
          removeEditorsNSData: true
        }]
      };
    }))
    .on('error', browsersync.notify)
    .pipe($.svgstore())
    .pipe($.rename('svg-defs.html'))
    .pipe(gulp.dest('_includes'));
});
