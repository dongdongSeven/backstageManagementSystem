import $ from 'jquery';

class User{
  //数据渲染
  showUserData(){
    let self=this;
    let result=self.getCompanyInfo();
    let content='';
    result.then(data=>{
      if(data.status=='0'){
        data.result.data.forEach((item,index)=>{
          content +=`<tr>
          <td>${index+1}</td>
          <td>${item.sub_time}</td>
          <td>${item.company_adress}</td>
          <td>${item.client_name}</td>
          <td>${item.phone}</td>
          <td>${item.back_name}</td>
          <td>${item.describes}</td>
          <td class="bgf6f6f6 colfc4f4f">${item.feed_describe}</td>
          <td class="bgf6f6f6 colfc4f4f">${item.back_describe}</td>
          <td>${item.update_time}</td>
          <td><button class='gaiBtnHook' data-id=${item.id}>修改</button></td>
          </tr>`;
        });
        $(".content tbody").html(content);
        //分页查询
        self.paginationSearch({
          totalData:data.result.total=='0'?'1':data.result.total,
          showData: self.companyInfoParam.pageSize,
          coping:true,
          current:self.companyInfoParam.currentPage,
          homePage:'首页',
          endPage:'末页',
          prevContent:'上页',
          nextContent:'下页',
          callback:function(api){
            self.companyInfoParam.currentPage=api.getCurrent();//点击第几页
            self.showUserData();
          }
        });
      }
    });
  }
  //增加信息
  addInfo(){
    let str = `<div class="tcBg">
      <div class="con">
        <div class="head-bg"></div>
        <p>
          <span>客户所在地:</span>
          <select class="adress">
              <option value ="1">成都</option>
              <option value ="2">上海</option>
              <option value="3">北京</option>
              <option value="4">南京</option>
              <option value="5">其他</option>
          </select>
        </p>
        <p>
          <span>客户姓名:</span>
          <input class="clientName" type="text">
        </p>
        <p>
          <span>手机号码:</span>
          <input class="phone" type="number">
        </p>
        <p>
          <span>退回原因:</span>            
          <select class="dId">
              <option value ="1">停机</option>
              <option value="2">空号</option>
              <option value="3">号码少号</option>
          </select>
        </p>
        <p>
          <span>备注:</span>
          <textarea class="describes"></textarea>
        </p>
        <div class="center">
          <button class="revise addInfo">增加</button>
          <button class="cancel">取消</button>
        </div>
      </div>
    </div>`;
    $('body').append(str);
  }
  //确定增加
  sureAdd(){
    let self=this;
    let param={
      adress:$(".tcBg .adress option:selected").val(),
      clientName:$(".tcBg .clientName").val(),
      phone:$(".tcBg .phone").val(),
      dId:$(".tcBg .dId option:selected").val(),
      describes:$(".tcBg .describes").val(),
      feedback:'1',
      updateTime:self.timer()
    };

    $.ajax({
      method:'POST',
      url:'/user/addInfo',
      data:param,
      success:function(result){
        if(result.status=='0'){
          self.closeModifyW();
          self.showUserData();
          self.pop(result.msg);
        }
      },
      error:function(err){
        console.log(err);
      }
    });
  }
}

export default User;