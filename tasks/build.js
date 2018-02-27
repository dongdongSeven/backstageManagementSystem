import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';//处理包的顺序

gulp.task('build',gulpSequence('clean','css','image','pages','scripts',['browser','serve']));
