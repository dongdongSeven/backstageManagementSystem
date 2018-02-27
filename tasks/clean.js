import gulp from 'gulp';
import del from 'del';//清空文件
import args from './util/args';
//为了安全起见，在每次生成文件时清空原来的文件
gulp.task('clean',()=>{
  return del(['server/public','server/views'])
})
