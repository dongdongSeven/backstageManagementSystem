import $ from "jquery";

class Login{
  //置空表单
  resetForm(){
    $("#userName").val('');
    $("#passWord").val('');
    $("#e_name").val('');
    $("#mobile").val('');
    $("#password").val('');
    $("#company").val('0');
  }
  //切换至注册
  goRegister(){
    $(".login-wrapper .login").css({"display":"none"});
    $(".login-wrapper .register").css({"display":"block"});
    $(".login-wrapper .title").text("注册");
  }
  //切换至登录
  goLogin(){
    $(".login-wrapper .login").css({"display":"block"});
    $(".login-wrapper .register").css({"display":"none"});
    $(".login-wrapper .title").text("登录");
  }
  //生成随机验证码
  productCode(){
    let codeArr=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let randomCode='';
    for(let i=0;i<4;i++){
      randomCode+=codeArr[Math.floor(Math.random()*26)];
    }
    $(".login-wrapper .yzCode").text(randomCode);
    this.yzCode=randomCode;
  }
  //登录判断
  loginCheck(){
    let self=this;
    let userName=$("#userName").val();
    let passWord=$("#passWord").val();
    let yzCode=$("#yzCode").val();
    let loginError=$(".login-wrapper .loginError");

    if(userName==''){
      loginError.css({"display":"block"});
      loginError.text("手机号不能为空");
      self.productCode();
    }else if(userName.length!=11||!/(13|14|15|16|17|18|19)\d{9}/.test(userName)){
      loginError.css({"display":"block"});
      loginError.text("手机号格式不正确");
      self.productCode();
    }else if(passWord==''){
      loginError.css({"display":"block"});
      loginError.text("密码不能为空");
      self.productCode();
    }else if(password.length<6){
      loginError.css({"display":"block"});
      loginError.text("密码至少为6位");
      self.productCode();
    }else if(yzCode==''||yzCode!=this.yzCode){
      loginError.css({"display":"block"});
      loginError.text("验证码填写错误");
      this.productCode();
    }else{
      this.loginCallBack(loginError);
    }
  }
  //登录反馈
  loginCallBack(loginError){
    let self=this;

    self.login().then(data=>{
      if(data.status=='0'){
        loginError.css({"display":"none"});
        loginError.text("");
        if(data.result[0].role_id==0){
          window.location.href=self.routerParam.admin;
        }else{
          window.location.href=self.routerParam.user;
        }
      }else{
        loginError.css({"display":"block"});
        loginError.text(data.msg);
        self.productCode();
      }
    }).catch(err=>{
      console.log(err);
    });   
  }
  //请求登录
  login(){
    let self=this;
    let userName = $("#userName").val();
    let passWord = $("#passWord").val();
    let timer = self.timer();

    return new Promise((resolve,reject)=>{
      $.ajax({
        method:"POST",
        url:'/login/login',
        data:{
          userName,
          passWord,
          timer
        },
        success:function(data){
          resolve.call(self,data);
        },
        error:function(err){
          reject.call(err);
        }
      })
    });
  }
  //注册判断
  registerCheck(){
    let self=this;
    let eName=$("#e_name").val();
    let mobile=$("#mobile").val();
    let password=$("#password").val();
    let company=$("#company").val();
    let registerError=$(".login-wrapper .registerError");

    if(eName==''){
      registerError.css({"display":"block"});
      registerError.text("用户名不能为空");
    }else if(mobile==''){
      registerError.css({"display":"block"});
      registerError.text("手机号码不能为空");
    }else if(mobile.length!=11||!/(13|15|17|18)\d{9}/.test(mobile)){
      registerError.css({"display":"block"});
      registerError.text("手机号码格式不正确");
    }else if(password==''){
      registerError.css({"display":"block"});
      registerError.text("密码不能为空");
    }else if(password.length<6){
      registerError.css({"display":"block"});
      registerError.text("密码必须大于6位");
    }else if(company=='0'){
      registerError.css({"display":"block"});
      registerError.text("请正确选择公司");
    }else{
      self.register().then(data=>{
        if(data.status=='0'){
          registerError.css({"display":"none"});
          registerError.text('');
          self.resetForm();
          self.pop(data.msg);
          setTimeout(function(){
            self.goLogin();
          },2500);
        }else{
          registerError.css({"display":"block"});
          registerError.text(data.msg);
        }
      }).catch(err=>{
        self.pop(err);
      });
    }
  }
  //注册
  register(){
    let self=this;
    let param={
      userName:$("#e_name").val(),
      mobile:$("#mobile").val(),
      password:$("#password").val(),
      company:$("#company").val(),
      timer:self.timer()
    };

    return new Promise((resolve,reject)=>{
      $.ajax({
        method:"POST",
        url:"/login/register",
        data:param,
        success:function(data){
          resolve.call(self,data);
        },
        error:function(err){
          reject.call(err);
        }
      })
    });
  }
}

export default Login;