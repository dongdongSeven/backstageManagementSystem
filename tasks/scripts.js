import gulp from 'gulp';//基础
import gulpif from 'gulp-if';//gulp语句中做if判断的插件
import concat from 'gulp-concat';//使用gulp-concat合并javascript文件，减少网络请求。
import webpack from 'webpack';//打包
import gulpWebpack from 'webpack-stream';//webpack-->gulp是基于stream流式的
import named from 'vinyl-named';//该插件保证webpack生成的文件名能够和原文件对上
import livereload from 'gulp-livereload';//文件修改后，浏览器自动更新
import plumber from 'gulp-plumber';//处理文件信息流的，管道拼接
import rename from 'gulp-rename';//对文件重命名
import uglify from 'gulp-uglify';//压缩JS和CSS的，资源压缩
import {log,colors} from 'gulp-util';//在命令行工具输出的包，log,colors的输出
import args from './util/args';//对命令行参数进行解析的包

gulp.task('scripts',()=>{
  return gulp.src(['app/js/public.js'])//打开文件
    .pipe(plumber({//处理错误逻辑
      errorHandle:function(){//交给webpack处理

      }
    }))
    .pipe(named())//重命名
    .pipe(gulpWebpack({//JS编译
      module:{
        loaders:[{
          test:/\.js$/,
          loader:'babel'
        }]
      }
    }),null,(err,stats)=>{
      log(`Finished '${colors.cyan('scripts')}'`,stats.toString({
        chunks:false
      }))
    })
    .pipe(gulp.dest('server/public/js'))//第一份未压缩的，输出文件
    .pipe(rename({//重新复制一份
      basename:'public',
      extname:'.min.js'
    }))
    .pipe(uglify({compress:{properties:false},output:{'quote_keys':true}}))//压缩
    .pipe(gulp.dest('server/public/js'))//第二份压缩的，存储位置
    .pipe(gulpif(args.watch,livereload()))//gulpif判断args.watch这个参数，如果命令行中有这个的话，就启动热更新；
                                          //如果没有就不会对文件进行自动刷新了
})
