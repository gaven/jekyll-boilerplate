import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

const minifyHTML = () => {
  return gulp.src('./_site/**/*.html')
    .pipe($.htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gup.dest('./_site/'))
    .pipe(reload({stream: true}));
};

gulp.task('minifyHtml', ['buildProduction'], minifyHTML);

const buildProduction = (done) => {
  const productionEnv = process.env;
    productionEnv.JEKYLL_ENV = 'production';

  return cp.spawn('jekyll', ['build'], {
    stdio: 'inherit',
    env: productionEnv
  })
  .on('close', done);
};

gulp.task('buildProduction', ['build:scripts', 'build:styles', 'build:images'], buildProduction);

const deploy = () => {
  return gulp.src('./_site/**/*')
    .pipe($.ghPages({
      branch: 'prod'
    }));
};

gulp.task('deploy', ['minifyHTML'], deploy);
