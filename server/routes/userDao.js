const db=require("./DBHelper.js").dbpool();;

module.exports={
  //销售修改数据
  modifyData:function(param,fn){
    let sql="update company_info set adress = ? , client_name = ? , phone = ? , d_id = ? , describes = ? , update_time = ? where id= ?";
    db.connect(sql,[param.adress,param.clientName,param.phone,param.dId,param.describes,param.updateTime,param.companyInfoId],fn);
  },
  //销售增加数据
  addInfo:function(param,fn){
    let sql='insert into company_info values(?,?,?,?,?,?,?,?,?,?,?,?)';
    db.connect(sql,[null,param.updateTime,param.adress,param.clientName,param.phone,param.dId,param.describes,param.feedback,'',param.updateTime,'0',param.userId],fn);
  }
}