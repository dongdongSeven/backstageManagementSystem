//压缩图片
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import livereload from 'gulp-livereload';
import argv from './util/args.js';

const $=gulpLoadPlugins();

gulp.task('image',()=>{
  return gulp.src('app/**/*.{png,jpg,gif}',{base:'app'})
             .pipe($.cache($.imagemin({//使用cache只压缩改变的图片
              optimizationLevel:3,   //压缩级别
              progressive:true,
              interlaced:true
             })))
             .pipe(gulp.dest('server/public'))
             .pipe($.if(argv.watch,livereload()))
});