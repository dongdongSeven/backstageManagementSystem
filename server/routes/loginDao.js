const db=require("./DBHelper.js").dbpool();

module.exports={
  //登录
  login:function(arr,fn){
    var sql="";
    if(arr.length==1) 
      sql="select * from company_admin where mobile= ?";
    else
      sql="select * from company_admin where mobile= ? and password= ?";
    db.connect(sql,arr,fn);
  },
  //更新登录时间
  updateTime:function(userName,timer,fn){
    var sql="update company_admin set last_login_time=? where mobile= ?";
    db.connect(sql,[timer,userName],fn);
  },
  //注册
  register:function(arr,fn){
    var sql="";
    if(arr.length==1){
      sql="select * from company_admin where mobile= ?";
      db.connect(sql,arr,fn);
    }else{
      sql="insert into company_admin values (?,?,?,?,?,?,?,?)";
      db.connect(sql,[null,arr[3],arr[1],arr[0],arr[2],'1','1',arr[4]],fn);
    }
  }
}