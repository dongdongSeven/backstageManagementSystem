var express = require('express');
var router = express.Router();
var loginDao=require("./loginDao.js");

/* GET users listing. */
router.get("/",function(req,res,nextr){
  res.render('login');
})
//登录
router.post('/login',function(req,res,next){
  var userName=req.body.userName;
  var passWord=req.body.passWord;
  var timer=req.body.timer;
  
  loginDao.login([userName],function(err1,data1){
    if(err1) console.log(err1);
    //手机号存不存在
    if(data1!=undefined&&data1.length>0){
      //密码正确否
      loginDao.login([userName,passWord],function(err2,data2){
        if(err2) console.log(err2);
        if(data2!=undefined&&data2.length>0){
          if(data2[0].mark=='1'){
            res.json({
              msg:'请联系管理员激活用户',
              status:'1',
              result:''
            });
          }else{
            //更新登录时间
            loginDao.updateTime(userName,timer,function(err3,data3){
              if(err3) console.log(err3);
              if(data3!=undefined&&data3.affectedRows>0){
                //记录cookie
                res.cookie("userId",data2[0].id,{
                  path:'/',
                  maxAge:60*60*1000
                });
                res.cookie("roleId",data2[0].role_id,{
                  path:"/",
                  maxAge:60*60*1000
                });
                res.json({
                  msg:'',
                  status:'0',
                  result:data2
                })
              }else{
                res.json({
                  msg:'登录时间失败',
                  status:'1',
                  result:''
                })
              }
            })
          }
        }else{
          res.json({
            msg:'密码错误',
            status:'1',
            result:''
          })          
        }
      })
    }else{
      res.json({
        msg:'用户名不存在',
        status:'1',
        result:''
      })
    }
  });
});
//注册
router.post('/register',function(req,res,next){
  var userName=req.body.userName;
  var mobile=req.body.mobile; 
  var password=req.body.password; 
  var company=req.body.company;
  var timer=req.body.timer;

  loginDao.register([mobile],function(err1,data1){
    if(err1) console.log(err1);
    if(data1!=undefined&&data1.length>0){
      res.json({
        msg:"该手机号已经被注册",
        status:'1',
        result:''
      });
    }else{
      loginDao.register([userName,mobile,password,company,timer],function(err2,data2){
        if(err2) console.log(err2);
        if(data2!=undefined&&data2.affectedRows>0){
          res.json({
            msg:"注册成功",
            status:'0',
            result:''
          });
        }else{
          res.json({
            msg:"注册失败",
            status:'1',
            result:''
          });
        }
      })
    }
  }); 
})

module.exports = router;
