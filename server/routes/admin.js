var express = require('express');
var router = express.Router();
const adminDao=require('./adminDao.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin');
});

//管理员确定修改
router.post('/adminSureModify',function(req,res,next){
  if(req.cookies.userId){
    let param={
      companyInfoId:req.body.companyInfoId,
      feedback:req.body.feedback,
      describes:req.body.feed_describes
    };
    adminDao.adminSureModify(param,function(err,data){
      if(err) console.log(err);
      if(data!=undefined&&data.affectedRows>0){
        res.json({
          msg:'修改成功',
          status:'0',
          result:''
        });
      }
    });
  }else{
    res.json({
      msg:'未登录',
      status:'1',
      result:''
    });
  }
});
//删除用户信息
router.post('/deleteCompanyInfo',function(req,res,next){
  let param={
    deleteArr:JSON.parse(req.body.deleteArr)
  };

  adminDao.deleteCompanyInfo(param,function(err,data){
    if(err) console.log(err);
    if(data!=undefined&&data.affectedRows>0){
      res.json({
        msg:'删除成功',
        status:'0',
        result:''
      });
    }
  });
})
//跳转员工信息页面
router.get('/staff',function(req,res,next){
  res.render('staff');
});
//查询公司员工数据
router.post('/getStaffData',function(req,res,next){
  let param={
    company:req.body.company,
    eName:req.body.eName,
    mobile:req.body.mobile,
    roleId:req.body.roleId,
    currentPage:req.body.currentPage,
    pageSize:req.body.pageSize
  };

  adminDao.getStaffData(param,function(err,data){
    if(err) console.log(err);
    if(data!=undefined&&data.length>=0){
      adminDao.getTotalData(param,function(err2,data2){
        res.json({
          msg:'',
          status:'0',
          result:{data:data,total:data2[0].total}
        });
      });
    }
  });
});
//修改公司员工信息
router.post('/sureModifyStaff',function(req,res,next){
  let param={
    id:req.body.companyInfoId,
    company:req.body.company,
    password:req.body.password
  };

  adminDao.sureModifyStaff(param,function(err,data){
    if(err) console.log(err); 
    if(data!=undefined&&data.affectedRows>0){
      res.json({
        msg:'修改成功',
        status:'0',
        result:''
      });
    }
  });
});
//公司员工启用
router.post('/startUse',function(req,res,next){
  let param={
    id:req.body.id,
    mark:req.body.mark
  };

  adminDao.startUse(param,function(err,data){
    if(err) console.log(err);
    if(data!=undefined&&data.affectedRows>0){
      res.json({
        msg:'启用成功',
        status:'0',
        result:''
      });
    }
  });
});
//删除公司员工
router.post('/deleteStaff',function(req,res,next){
  let param={
    deleteArr:JSON.parse(req.body.deleteArr)
  };

  adminDao.deleteStaff(param,function(err,data){
    if(err) console.log(err);
    if(data!=undefined&&data.affectedRows>0){
      res.json({
        msg:'删除成功',
        status:'0',
        result:''
      });
    }
  });
});
module.exports = router;