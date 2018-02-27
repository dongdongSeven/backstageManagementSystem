const db=require("./DBHelper.js").dbpool();

module.exports={
  //获取销售数据
  getUserData:function(param,fn){
    let sql="select a.`id`,a.`sub_time`,c.`company_adress`,a.`client_name`,a.`phone`,d.`back_name`,a.`describes`,e.`feed_describe`,a.`back_describe`,a.`update_time`,a.`mark`,a.`user_id`,b.`e_name`,b.`role_id`,f.`company_name` from company_info as a join company_admin as b on a.`user_id` = b.`id` join company_adress as c on a.`adress`=c.`id` join company_back as d on a.`d_id`=d.`id` join company_feed as e on a.`feedback`=e.`id` join company_name as f on b.`company`=f.`id` where 1=1 ";
    let arr=[];
    if(param.userId!=''){
      sql+="and a.`user_id` = ? ";
      arr.push(param.userId);
    }
    if(param.updateTime!='0'){
      sql+="and a.`update_time` > ? ";
      arr.push(param.updateTime);
    }
    if(param.adress!='0'){
      sql+="and a.`adress` = ? ";
      arr.push(param.adress);
    }
    if(param.dId!='0'){
      sql+="and a.`d_id` = ? ";
      arr.push(param.dId);
    }
    if(param.companyId!='0'){
      sql+="and b.`company` = ? ";
      arr.push(param.companyId);
    }
    if(param.feedback!='0'){
      sql+="and a.`feedback` = ? ";
      arr.push(param.feedback);
    }
    if(param.eName!=''){
      sql+="and b.`e_name` = ? ";
      arr.push(param.eName);
    }
    if(param.clientName!=''){
      sql+="or a.`client_name` = ? ";
      arr.push(param.clientName);
    }
    if(param.phone!=''){
      sql+="or a.`phone` = ? ";
      arr.push(param.phone);
    }
    if(param.currentPage!=''&&param.pageSize!=''){
      sql+="limit ?,? ";
      arr.push((param.currentPage - 1) * param.pageSize);
      arr.push(param.currentPage * param.pageSize);
    }
    db.connect(sql,arr,fn);
  },
  //获取销售数据总量
  getTotalData:function(param,fn){
    let sql="select count(*) as total from company_info as a join company_admin as b on a.`user_id` = b.`id` join company_adress as c on a.`adress`=c.`id` join company_back as d on a.`d_id`=d.`id` join company_feed as e on a.`feedback`=e.`id` join company_name as f on b.`company`=f.`id` where 1=1 ";
    let arr=[];
    if(param.userId!=''){
      sql+="and a.`user_id` = ? ";
      arr.push(param.userId);
    }
    if(param.updateTime!='0'){
      sql+="and a.`update_time` > ? ";
      arr.push(param.updateTime);
    }
    if(param.adress!='0'){
      sql+="and a.`adress` = ? ";
      arr.push(param.adress);
    }
    if(param.dId!='0'){
      sql+="and a.`d_id` = ? ";
      arr.push(param.dId);
    }
    if(param.companyId!='0'){
      sql+="and b.`company` = ? ";
      arr.push(param.companyId);
    }
    if(param.feedback!='0'){
      sql+="and a.`feedback` = ? ";
      arr.push(param.feedback);
    }
    if(param.eName!=''){
      sql+="and b.`e_name` = ? ";
      arr.push(param.eName);
    }
    if(param.clientName!=''){
      sql+="or a.`client_name` = ? ";
      arr.push(param.clientName);
    }
    if(param.phone!=''){
      sql+="or a.`phone` = ? ";
      arr.push(param.phone);
    }
    db.connect(sql,arr,fn);
  },
  //获取个人信息
  getPersonalInfo:function(userId,fn){
    let sql="select * from company_admin as a join company_name as b on a.`company` = b.`id` where a.`id` = ?";
    db.connect(sql,[userId],fn);
  },
  //上传头像
  uploadHead:function(userId,uploadPath,fn){
    let sql="update company_admin set head_pic = ? where id = ?";
    db.connect(sql,[uploadPath,userId],fn);
  }
}