import gulp from 'gulp';
import gulpif from 'gulp-if';
import liveserver from 'gulp-live-server';//能启动服务器的包
import args from './util/args';

gulp.task('serve',(cb)=>{
  //如果不是处于监听模式下，直接返回回调函数
  if(!args.watch) return cb();
  //harmony参数是指在当前命令行下去执行后面的脚本
  var server = liveserver.new(['--harmony','server/bin/www']);
  server.start();//启动服务器
  //当服务器的JS改变，浏览器热更新
  gulp.watch(['server/public/**/*.css','server/public/**/*.js','server/views/**/*.ejs'],function(file){
    server.notify.apply(server,[file]);//浏览器热更新
  })
  //当服务器的路由和APP.JS发生变化时需要重启服务器
  gulp.watch(['server/routes/**/*.js','server/app.js'],function(){
    server.start.bind(server)()//重启服务器
  });
})
