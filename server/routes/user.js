var express = require('express');
var router = express.Router();
const userDao= require('./userDao.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user');
});

//判断是否登录
function checkLogin(req,res,next){
  if(!req.cookies.userId) 
    res.json({
      msg:'未登录，请先登录',
      status:'1',
      result:''
    })
  return ;
}

//销售修改数据
router.post('/modifyData',function(req,res,next){
  let param={
    companyInfoId:req.body.companyInfoId,
    adress:req.body.adress,
    clientName:req.body.clientName,
    phone:req.body.phone,
    dId:req.body.dId,
    describes:req.body.describes,
    updateTime:req.body.updateTime
  };
  
  checkLogin(req,res,next);

  userDao.modifyData(param,function(err,data){
    if(err) console.log(err);
    if(data!=undefined&&data.affectedRows>0){
      console.log('修改成功');
      res.json({
        msg:'修改成功',
        status:'0',
        result:''
      })
    }
  });
});
//销售增加数据
router.post('/addInfo',function(req,res,next){
  checkLogin(req,res,next);
  let param={
    userId:req.cookies.userId,
    adress:req.body.adress,
    clientName:req.body.clientName,
    phone:req.body.phone,
    dId:req.body.dId,
    describes:req.body.describes,
    feedback:req.body.feedback,
    updateTime:req.body.updateTime
  };

  userDao.addInfo(param,function(err,data){
    if(err) console.log(err);
    if(data!=undefined&&data.affectedRows>0){
      res.json({
        msg:'添加成功',
        status:'0',
        result:''
      });
    }
  });
})
module.exports = router;
