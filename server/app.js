var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var login = require('./routes/login');
var admin = require('./routes/admin');
var user = require('./routes/user');
var base = require('./routes/base');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//服务器需要接受热更新，次插件必须在上面代码的下面，否则无效
app.use(require('connect-livereload')());

app.use(function(req,res,next){
  if(req.cookies.userId){
    if(req.cookies.roleId=='0'&&/(\/user)/.test(req.originalUrl)){
      res.render('login');
    }else if(req.cookies.roleId=='1'&&/(\/admin)/.test(req.originalUrl)){
      res.render('login');
    }else{
      next();
    }
  }else{
    if(req.originalUrl=='/login'||req.originalUrl=="/login/login"||req.originalUrl=="/login/register"){
      next();
    }else{
      res.render('login');
      res.json({
        msg:'当前未登录',
        status:'10001',
        result:''
      })
    }
  }
});

//退出登录
app.use('/logout',function(req,res,next){
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  });
  res.json({
    msg:'退出登录',
    status:'0',
    result:''
  });
})

app.use('/base',base);
app.use('/user',user);
app.use('/login',login);
app.use('/admin',admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
