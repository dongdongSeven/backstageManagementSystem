import 'babel-polyfill';
import Base from './backManagementSystem/base.js';
import Admin from './backManagementSystem/admin.js';
import User from './backManagementSystem/user.js';
import Login from './backManagementSystem/login.js';
import Canvas from './backManagementSystem/canvas.js';
import digit from './backManagementSystem/digit.js';
import $ from "jquery";

const copyProperties=function(target,source){
  for(let key of Reflect.ownKeys(source)){
    if(key!=='name'&&key!=='constructor'&&key!=='prototype'){
      let desc=Object.getOwnPropertyDescriptor(source,key);
      Object.defineProperty(target,key,desc);
    }
  }
}

const mix=function (...mixins) {
  class Mix{};
  for(let mixin of mixins){
    copyProperties(Mix,mixin);
    copyProperties(Mix.prototype,mixin.prototype);
  }
  return Mix;
}

class BackManagementSystem extends mix(Admin,User,Login,Base,Canvas){
  constructor(name='qdd_BMS'){
    super();
    this.digit=digit;//时钟数字模型
    this.timeParam={
      WINDOW_WIDTH:300,
      WINDOW_HEIGHT:100,
      RADIUS:8,
      MARIN_TOP:60,
      MARGIN_LEFT:30,
      curShowTimeSeconds:0,//当前距离设定时间的秒数
      balls:[],
      colors:['#33B3E5','#0099CC','#AA66CC','#9933CC','#99CC00','#669900','#FFBB33','#FF8800','#FF4444','#CC0000']
    };//时钟参数
    this.yzCode='';//验证码
    this.userOrAdmin='';//销售页面是'1',管理员页面是'2','员工页面是3'
    this.companyInfoParam={
      url:'',
      updateTime:'0',
      dId:'0',
      companyId:'0',
      feedback:'0',
      eName:'',
      clientName:'',
      phone:'',
      adress:'0',
      currentPage:'1',
      pageSize:'15'
    };//公司信息筛选条件
    this.staffInfoParam={
      url:'',
      company:'0',
      eName:'',
      mobile:'',
      roleId:'1',
      currentPage:'1',
      pageSize:'15'
    };//公司员工信息筛选
    this.routerParam={
      admin:'http://127.0.0.1:3000/admin',
      user:'http://127.0.0.1:3000/user',
      admin_staff:'http://127.0.0.1:3000/admin/staff'
    };//跳转路由
    this.initTime();//初始化时钟
    this.dataInit();//初始化销售或管理员数据
    this.productCode();//初始化验证码
    this.eventInit();//初始化事件
  }
  //初始化时钟
  initTime(){
    let self=this;
    self.timeParam.MARGIN_LEFT=Math.round(self.timeParam.WINDOW_WIDTH/10);
    self.timeParam.MARIN_TOP=Math.round(self.timeParam.WINDOW_HEIGHT/5);
    self.timeParam.RADIUS=Math.round(self.timeParam.WINDOW_WIDTH*4/5/108)-1;

    let canvas=document.getElementById("timeClick");
    let context=canvas.getContext("2d");
    canvas.width=self.timeParam.WINDOW_WIDTH;
    canvas.height=self.timeParam.WINDOW_HEIGHT;

    self.timeParam.curShowTimeSeconds=self.getCurrentShowTimeSeconds();
    setInterval(function(){
      self.render(context);//负责画
      self.update();//负责数据的改变
    },50);
  }
  //初始化销售或管理员数据
  dataInit(){
    let self=this;
    //销售页面
    if(window.location.pathname=='/user'){
      self.companyInfoParam.url='/base/getUserData';
      self.showUserData();
      self.userOrAdmin='1';
    };
    //管理员用户页面
    if(window.location.pathname=='/admin'){
      self.companyInfoParam.url='/base/getUserData';
      self.showAdminData();
      self.userOrAdmin='2';
    };
    //管理员销售页面
    if(window.location.pathname=='/admin/staff'){
      self.staffInfoParam.url='/admin/getStaffData';
      self.showStaffData();//查询公司员工数据
      self.userOrAdmin='3';
    };
    self.userOrAdmin!=''&&self.getPersonalInfo();//获取姓名和公司
  }
  //初始化事件
  eventInit(){
    let self=this;
    //切换至注册
    $(".login-wrapper").on("click",".goRegister",self.goRegister.bind(self));
    //切换至登录
    $(".login-wrapper").on("click",".goLogin",self.goLogin.bind(self));
    //生成随机验证码
    $(".login-wrapper").on("click",".yzCode",self.productCode.bind(self));
    //登录和登录判断
    $(".login-wrapper").on("click",".login_btn",self.loginCheck.bind(self));
    $(".login-wrapper").on("keyup","#yzCode",function(e){
      if(e.keyCode==13) self.loginCheck.bind(self)();
    });
    //注册和注册判断
    $(".login-wrapper").on("click",".register_btn",self.registerCheck.bind(self));
    //退出登录
    $("body").on("click",'.logoutHook',self.logout.bind(self));
    //修改弹窗
    $("body").on("click",".gaiBtnHook",self.modifyDataBox.bind(self));
    //关闭修改框
    $("body").on("click",".cancel",self.closeModifyW);
    //确定修改
    $("body").on("click",".modifyBtn",self.sureModify.bind(self));
    //销售增加信息
    $("body").on("click","#sp_add",self.addInfo);
    //确定增加
    $("body").on("click",".addInfo",self.sureAdd.bind(self));
    //时间筛选
    $("body").on("change",".updateTimeHook",self.conditionsSearch.bind(self));
    //客户所在地筛选
    $("body").on("change",".adressHook",self.conditionsSearch.bind(self));
    //销售所在地筛选
    $("body").on("change",".companyHook",self.conditionsSearch.bind(self));
    //退回原因筛选
    $("body").on("change",".dIdHook",self.conditionsSearch.bind(self));
    //订单反馈筛选
    $("body").on("change",".feedBackHook",self.conditionsSearch.bind(self));
    //模糊筛选
    $("body").on("keyup",".fuzzySearchHook",function(e){
      if(e.keyCode==13){
        self.conditionsSearch();
      }
    });
    $("body").on("click",".fuzzySearchHook2",self.conditionsSearch.bind(self));
    //多选与反选
    $('table').on("click","#checkall",self.checkAll);
    //删除用户信息或员工账号
    $('body').on("click","#delete",self.deleteInfo.bind(self));
    //跳转人员管理页面
    $('body').on("click","#goStaff",function(){window.location.href=self.routerParam.admin_staff;});
    //跳转用户信息页面
    $('body').on("click","#goAdmin",function(){window.location.href=self.routerParam.admin;});
    //启用员工
    $('body').on("click",".startUseHook",self.startUse.bind(self));
    //上传头像
    $('body').on("click","#uploadHead",self.uploadHead);
  }
}


export default BackManagementSystem;