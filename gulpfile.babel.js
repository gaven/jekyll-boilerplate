'use strict';

import gulp from 'gulp';
import requireDir from 'require-dir';

requireDir('./gulp/tasks', { recurse: true });

const watch = () => {
  gulp.watch(['./_app/styles/**/*.scss'], ['build:styles', 'build:reload']);
  gulp.watch(['./_app/scripts/**/*.js'], ['build:scripts']);
  gulp.watch(['./_app/images/*'], ['build:images']);
  gulp.watch(['**/*.html', '**/*.md', '!_site/**/*.*'], ['build:reload']);
}

gulp.task('default', ['browser-sync'], watch);



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
