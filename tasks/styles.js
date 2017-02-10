import gulp from 'gulp';
import browsersync from 'browser-sync';
import loadPlugins from 'gulp-load-plugins';
import group from 'gulp-group-css-media-queries';

const $ = loadPlugins();
const supported = [
  '> 1%',
  'last 2 versions',
  'IE >= 9'
];

const styles = () => {
  return gulp.src('_app/styles/styles.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['sass'],
      onError: $.util.log
    }))
    .pipe($.autoprefixer(supported))
    .pipe(group())
    .pipe($.rename({extname: '.css'}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./css'));
};

gulp.task('build:styles', styles);
