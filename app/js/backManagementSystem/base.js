import $ from './../lib/jquery.pagination.js';

class Base{
  //查询公司信息表
  getCompanyInfo(){
    let self=this;

    return new Promise((resolve,reject)=>{
      $.ajax({
        method:'POST',
        url:self.companyInfoParam.url,
        data:self.companyInfoParam,
        success:function(result){
          resolve.call(self,result);
        },
        error:function(err){
          reject.call(err);
        }
      });
    });
  }
  //退出登录
  logout(){
    
    $.ajax({
      method:'POST',
      url:'/logout',
      data:{},
      success:function(result){
        if(result.status=='0'){
          window.location.href="http://127.0.0.1:3000/login";
        }
      },
      error:function(err){
        console.log(err);
      }
    });
  }
  //条件查询
  conditionsSearch(){
    let self=this;

    self.companyInfoParam.url='/base/getUserData';
    self.companyInfoParam.updateTime=$(".updateTimeHook").val();
    self.companyInfoParam.dId=$(".dIdHook").val();
    self.companyInfoParam.companyId=$(".companyHook").val()||'0';
    self.companyInfoParam.feedback=$(".feedBackHook").val();
    self.companyInfoParam.eName=$(".search input").val();
    self.companyInfoParam.clientName=$(".search input").val();
    self.companyInfoParam.phone=$(".search input").val();
    self.companyInfoParam.adress=$(".adressHook").val();
    self.companyInfoParam.currentPage='1';

    self.staffInfoParam.url='/admin/getStaffData';
    self.staffInfoParam.company=$(".companyHook").val()||'0';
    self.staffInfoParam.eName=$(".search input").val();
    self.staffInfoParam.mobile=$(".search input").val();
    self.staffInfoParam.currentPage='1';

    if(self.userOrAdmin=='1'){
      self.showUserData();//销售页面查询
    }else if(self.userOrAdmin=='2'){
      self.showAdminData();//管理员页面查询
    }else if(self.userOrAdmin=='3'){
      self.showStaffData();//公司员工页面查询
    }
  }
  //多选与反选
  checkAll(){
    if($(this).is(':checked')){
      $("tbody input[type=checkbox]").prop('checked',true);
    }else{
      $("tbody input[type=checkbox]").prop('checked',false);
    }
  }
  //修改弹框数据
  modifyDataBox(e){
    let self=this;
    let btn=e.target;
    let str='';
    let companyInfoId=$(btn).attr('data-id');
    function item(num){
      return $(btn).parent().siblings().eq(num).text();
    }

    if(self.userOrAdmin=='1'){
      str = `<div class="tcBg" data-id=${companyInfoId}>
        <div class="con">
          <div class="head-bg"></div>
          <p>
            <span>客户所在地:</span>
            <select class="adress">
                <option value ="1" ${item(2)=='成都'?'selected':''}>成都</option>
                <option value ="2" ${item(2)=='上海'?'selected':''}>上海</option>
                <option value="3" ${item(2)=='北京'?'selected':''}>北京</option>
                <option value="4" ${item(2)=='南京'?'selected':''}>南京</option>
                <option value="5" ${item(2)=='其他'?'selected':''}>其他</option>
            </select>
          </p>
          <p>
            <span>客户姓名:</span>
            <input class="clientName" type="text" value="${item(3)}">
          </p>
          <p>
            <span>手机号码:</span>
            <input class="phone" type="number" value="${item(4)}">
          </p>
          <p>
            <span>退回原因:</span>            
            <select class="dId">
                <option value ="1" ${item(5)=='停机'?'selected':''}>停机</option>
                <option value="2" ${item(5)=='空号'?'selected':''}>空号</option>
                <option value="3" ${item(5)=='号码少号'?'selected':''}>号码少号</option>
            </select>
          </p>
          <p>
            <span>备注:</span>
            <textarea class="describes">${item(6)}</textarea>
          </p>
          <div class="center">
            <button class="revise modifyBtn">修改</button>
            <button class="cancel">取消</button>
          </div>
        </div>
      </div>`;
    }else if(self.userOrAdmin=='2'){
      str =`<div class="tcBg" data-id=${companyInfoId}>
        <div class="con">
          <div class="head-bg"></div>
          <p>
            <span>订单反馈:</span>
            <select class="feedback">
                <option value ="1" ${item(10)=='停机'?'selected':''}>进行审批</option>
                <option value="2" ${item(10)=='停机'?'selected':''}>审批通过</option>
                <option value="3" ${item(10)=='停机'?'selected':''}>审批被拒</option>
            </select>
          </p>
          <p>
            <span>反馈备注:</span>
            <textarea class="describes">${item(11)}</textarea>
          </p>
          <div class="center">
            <button class="revise modifyBtn">修改</button>
            <button class="cancel">取消</button>
          </div>
        </div>
      </div>`;
    }else if(self.userOrAdmin=='3'){
      str =`<div class="tcBg" data-id=${companyInfoId}>
        <div class="con">
          <div class="head-bg"></div>
          <p>
            <span>所属分公司:</span>
            <select class="company">
                <option value ="1" ${item(2)=='成都'?'selected':''}>成都</option>
                <option value="2" ${item(2)=='上海'?'selected':''}>上海</option>
                <option value="3" ${item(2)=='北京'?'selected':''}>北京</option>
                <option value="4" ${item(2)=='南京'?'selected':''}>南京</option>
            </select>
          </p>
          <p>
            <span>销售姓名:&ensp;</span>${item(3)}
          </p>
          <p>
            <span>手机号码:&ensp;</span>${item(4)}
          </p>
          <p>
            <span>密码:</span>
            <input class="password" type="text" value="${item(5)}"/>
          </p>
          <div class="center">
            <button class="revise modifyBtn">修改</button>
            <button class="cancel">取消</button>
          </div>
        </div>
      </div>`;
    }

    $('body').append(str);
  }
  //确定修改
  sureModify(){
    let self=this;
    let param={
      url:'',
      companyInfoId:$(".tcBg").attr("data-id"),
      adress:$(".tcBg .adress option:selected").val(),
      clientName:$(".tcBg .clientName").val(),
      phone:$(".tcBg .phone").val(),
      dId:$(".tcBg .dId option:selected").val(),
      describes:$(".tcBg .describes").val(),
      updateTime:self.timer(),
      feedback:$(".tcBg .feedback").val(),
      feed_describes:$(".tcBg .describes").val(),
      company:$(".tcBg .company").val(),
      password:$(".tcBg .password").val()
    };

    if(self.userOrAdmin=='1'){
      param.url='/user/modifyData';
      param.show=self.showUserData.bind(self);
    }else if(self.userOrAdmin=='2'){
      param.url='/admin/adminSureModify';
      param.show=self.showAdminData.bind(self);
    }else if(self.userOrAdmin=='3'){
      param.url='/admin/sureModifyStaff';
      param.show=self.showStaffData.bind(self);
    }

    $.ajax({
      method:'POST',
      url:param.url,
      data:param,
      success:function(result){
        if(result.status=='0'){
          self.closeModifyW();
          param.show();
          self.pop('修改成功');
        }
      },
      error:function(err){
        console.log(err);
      }
    });
  }
  //获取个人信息
  getPersonalInfo(){

    $.ajax({
      method:'POST',
      url:'/base/getPersonalInfo',
      data:{},
      success:function(data){
        let headPath=data.result[0].head_pic==null?"images/public/user-icon.png":data.result[0].head_pic;
        $(".user-icon img").attr("src",headPath);
        $(".userNameHook").text(data.result[0].e_name);
        $(".userCompanyHook").text(data.result[0].company_name);
      },
      error:function(err){
        console.log(err);
      }
    });
  }
  //分页查询
  paginationSearch(param){
    $('.M-box2').pagination(param);
  }
  //公共弹框
  pop(txt){
    var str='<div class="tcBg">'
          +'<div class="con w300">'
            +'<div class="head-bg"></div>'
            +'<p class="center">'+txt+'</p>'
          +'</div>'
        +'</div>';
    $('body').append(str);
    setTimeout(function(){
        $(".tcBg").remove();
      },2000)
  }
  //关闭修改框
  closeModifyW(){
    $(".tcBg").remove();
  }
  //获取当前时间
  timer(){
    let time=new Date();
    let year=time.getFullYear();
    let month=time.getMonth()+1+'';
    let date=time.getDate()+'';
    let hour=time.getHours()+'';
    let minut=time.getMinutes()+'';
    let second=time.getSeconds()+'';
    month=month.length>1?month:('0'+month);
    date=date.length>1?date:('0'+date);
    hour=hour.length>1?hour:('0'+hour);
    minut=minut.length>1?minut:('0'+minut);
    second=second.length>1?second:('0'+second);
    
    return year+"-"+month+"-"+date+" "+hour+":"+minut+":"+second;
  }
  //上传头像
  uploadHead(){
    $(this).change(function(e){
      let img=$('.user-icon img')[0];
      let imgFile=$(this)[0].files[0];
      let reader=new FileReader;
      let canvas=document.getElementById("canvas");
      let context=canvas.getContext("2d");
      canvas.width=72;
      canvas.height=72;
      reader.readAsDataURL(imgFile);
      reader.onload=function(){
        img.src=this.result;
        img.style.width='72px';
        img.style.height='72px';
        img.style.borderRadius="50%";
        img.onload=function(){
          context.drawImage(img,0,0,72,72);  
          let imgDataUrl=canvas.toDataURL();

          $.ajax({
            method:'POST',
            url:'/base/uploadHead',
            data:{imgDataUrl:imgDataUrl},
            success:function(result){

            },
            error:function(err){
              console.log(err);
            }
          });
        }
      }
    });
  }
}

export default Base;