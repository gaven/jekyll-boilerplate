import gulp from 'gulp';
import browsersync from 'browser-sync';

gulp.task('serve', () => {
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
