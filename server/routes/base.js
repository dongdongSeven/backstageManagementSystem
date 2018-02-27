var express = require('express');
var router = express.Router();
const baseDao= require('./baseDao.js');
const fs=require("fs");

//获取公司客户数据
router.post('/getUserData',function(req,res,next){
  if(req.cookies.userId){
    let userId=req.cookies.roleId=='0'?'':req.cookies.userId;
    let updateTime=req.body.updateTime;
    let date=new Date();
    if(updateTime=='1'){
      updateTime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    }else if(updateTime=='2'){
      date.setDate(date.getDate()-3);
      updateTime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    }else if(updateTime=='3'){
      date.setDate(date.getDate()-7);
      updateTime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    }
    let param={
      userId:userId,
      updateTime:updateTime,
      dId:req.body.dId,
      adress:req.body.adress,
      companyId:req.body.companyId,
      feedback:req.body.feedback,
      eName:req.body.eName,
      clientName:req.body.clientName,
      phone:req.body.phone,
      currentPage:req.body.currentPage,
      pageSize:req.body.pageSize
    };
    baseDao.getUserData(param,function(err,data){
      if(err) console.log(err);
      if(data!=undefined&&data.length>=0){
        baseDao.getTotalData(param,function(err2,data2){
          data.forEach(function(item,index){
            data[index].sub_time=data[index].sub_time.toLocaleString();
            data[index].update_time=data[index].update_time.toLocaleString();
          });
          res.json({
            msg:'',
            status:'0',
            result:{data:data,total:data2[0].total}
          })
        });
      }
    });
  }else{
    res.json({
      msg:'未登录，请先登录',
      status:'1',
      result:''
    })
  }
});
//获取个人信息
router.post('/getPersonalInfo',function(req,res,next){
  if(req.cookies.userId){
    let userId=req.cookies.userId;
    baseDao.getPersonalInfo(userId,function(err,data){
      if(err) console.log(err);
      if(data!=undefined&&data.length>0){
        res.json({
          msg:'',
          status:'0',
          result:data
        });
      }
    });
  }else{
    res.json({
      msg:'未登录',
      status:'1',
      result:''
    })
  }
})
//上传头像
router.post('/uploadHead',function(req,res,next){
  let userId=req.cookies.userId;
  let imgData=req.body.imgDataUrl;
  let base64Data=imgData.replace(/data:image\/png;base64,/,"").replace(/\s/g,"+");
  let dataBuffer=new Buffer(base64Data,"base64");
  let filename=new Date().getTime()+".png";
  let uploadPath="images/uploadHead/"+filename;

  fs.writeFile("./app/"+uploadPath,dataBuffer,function(err){
    if(err) console.log(err);
    baseDao.uploadHead(userId,uploadPath,function(err,data){
      if(err) console.log(err);
      if(data!=undefined&&data.affectedRows>0){
        res.json({
          msg:'上传成功',
          status:'0',
          result:''
        });
      }
    });  
  })

});
module.exports = router;