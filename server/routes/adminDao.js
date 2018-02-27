const db=require("./DBHelper.js").dbpool();

module.exports={
  //管理员确定修改
  adminSureModify:function(param,fn){
    let sql='update company_info set feedback= ?,back_describe= ? where id= ?';
    db.connect(sql,[param.feedback,param.describes,param.companyInfoId],fn);
  },
  //删除用户信息
  deleteCompanyInfo:function(param,fn){
    let str='';
    for(let i=0;i<param.deleteArr.length;i++){
      str+='?,';
    };
    let sql='delete from company_info where id in ('+str.slice(0,str.length-1)+')';
    db.connect(sql,param.deleteArr,fn);
  },
  //查询公司员工数据
  getStaffData:function(param,fn){
    let sql="select a.`id`,b.`company_name`,a.`mobile`,a.`e_name`,a.`password`,a.`mark` from company_admin as a join company_name as b on a.`company`=b.`id` where a.`role_id`='1' ";
    let arr=[];
    if(param.company!='0'){
      sql+="and a.`company`= ? ";
      arr.push(param.company);
    }
    if(param.eName!=''){
      sql+="and a.`e_name`= ? ";
      arr.push(param.eName);
    }
    if(param.mobile!=''){
      sql+="or a.`mobile`= ?";
      arr.push(param.mobile);
    }
    if(param.currentPage!=''&&param.pageSize!=''){
      sql+="limit ?,? ";
      arr.push((param.currentPage - 1) * param.pageSize);
      arr.push(param.currentPage * param.pageSize);
    }
    db.connect(sql,arr,fn);
  },
  //公司员工启用
  startUse:function(param,fn){
    let sql="update company_admin set mark = ? where id = ?";
    db.connect(sql,[param.mark,param.id],fn);
  },
  //删除公司员工
  deleteStaff:function(param,fn){
    let str='';
    for(let i=0;i<param.deleteArr.length;i++){
      str+='?,';
    };
    let sql="delete from company_admin where id in ("+str.slice(0,str.length-1)+")";
    db.connect(sql,param.deleteArr,fn);
  },
  //修改公司员工信息
  sureModifyStaff:function(param,fn){
    let sql="update company_admin set company = ?,password = ? where id = ?";
    db.connect(sql,[param.company,param.password,param.id],fn);
  },
  //获取总人数
  getTotalData:function(param,fn){
    let sql="select count(*) as total from company_admin as a join company_name as b on a.`company`=b.`id` where a.`role_id`='1' ";
    let arr=[];
    if(param.company!='0'){
      sql+="and a.`company`= ? ";
      arr.push(param.company);
    }
    if(param.eName!=''){
      sql+="and a.`e_name`= ? ";
      arr.push(param.eName);
    }
    if(param.mobile!=''){
      sql+="or a.`mobile`= ?";
      arr.push(param.mobile);
    }
    db.connect(sql,arr,fn);
  }
}