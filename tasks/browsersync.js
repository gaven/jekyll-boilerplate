import gulp from 'gulp';
import browsersync from 'browser-sync';
import sequence from 'run-sequence';

const tasks = done => {
  sequence (
    'build:styles',
    'build:scripts',
    'build:images',
    'build:jekyll',
    done
  )
};

gulp.task('tasks', tasks);

gulp.task('serve', ['tasks'], () => {
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
