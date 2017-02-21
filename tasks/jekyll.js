import browsersync from 'browser-sync';
import cp from 'child_process';
import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';

const $ = loadPlugins();
const reload = browsersync.reload;

const jekyll = () => {
  const command = 'jekyll build --config _config.yml';

  cp.exec(command, (err) => {
    if (err) {
      $.util.log(err);
    }
  });
};

gulp.task('build:jekyll', jekyll);

gulp.task('build:reload', ['build:jekyll'], () => {
  reload();
});
