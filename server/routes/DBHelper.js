const mysql=require("mysql");
exports.dbpool=function(){
  var pool={
      config:{
          host:"localhost",
          user:"root",
          password:"root",
          port:3306,
          database:"qianduoduo"
      },
      connect:function(sql,arr,fn){
          var cnn=mysql.createPool(this.config);
          cnn.getConnection(function(err,connect){
              if(err){
                  console.log(err);
              }
              connect.query(sql,arr,fn);
              connect.release();
          });
      }
  };
  return pool;
};