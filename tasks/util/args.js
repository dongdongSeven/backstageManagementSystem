import yargs from 'yargs';
//严格的说，yargs不是专门用于gulp的，
//它是Node中处理命令行参数的通用解决方案。
//只要一句代码var args = require('yargs').argv;
//就可以让命令行的参数都放在变量args上，非常方便。

const args = yargs
  //区分开发环境和生产环境
  .option('production',{
    boolean:true,
    default:false,
    describe:'min all scripts'
  })
  //控制是否监听
  .option('watch',{
    boolean:true,
    default:false,
    describe:'watch all files'
  })
  //详细输出命令行输出的日志
  .option('verbose',{
    boolean:true,
    default:false,
    describe:'log'
  })
  //处理映射的，生成sourcemap
  .option('sourcemaps',{
    describe:'force the creation of sroucemaps'
  })
  //服务器端口
  .option('port',{
    string:true,
    default:8080,
    describe:'server port'
  })

  .argv

export default args;
