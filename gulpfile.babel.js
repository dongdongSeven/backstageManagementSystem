//此文件是为gulp在ES6环境下创建的，普通的环境则是gulpfile.js
//在执行命令gulp时第一个找的文件是gulpfile.js
//require-dir插件作用是运行指定目录下的文件
//开始写项目前执行gulp --watch，不加--watch就只执行一次

import requireDir from 'require-dir';

requireDir('./tasks');

