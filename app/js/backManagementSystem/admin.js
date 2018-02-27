import $ from 'jquery';

class Admin{
  //用户信息数据渲染
  showAdminData(){
    let self=this;
    let result=self.getCompanyInfo();
    let content='';
    result.then(data=>{
      if(data.status=='0'){
        data.result.data.forEach((item,index)=>{
          content +=`<tr>
          <td><input type="checkbox" data-mark="${item.id}"/></td>
          <td>${index+1}</td>
          <td>${item.company_name}</td>
          <td>${item.e_name}</td>
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
            self.showAdminData();
          }
        });
      }
    });
  }
  //获取管理员个人信息
  getAdminInfo(){

    $.ajax({
      method:'POST',
      url:'/admin/getAdminInfo',
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
  //删除用户信息
  deleteInfo(){
    let self=this;
    let param={};
    let deleteArr=[];
    $('tbody input[type=checkbox]:checked').each((index,item)=>{
      let id=$(item).attr("data-mark");
      deleteArr.push(id);
    });

    if(self.userOrAdmin=='2'){
      param.url='/admin/deleteCompanyInfo';
      param.show=self.showAdminData.bind(self);
    }else if(self.userOrAdmin=='3'){
      param.url='/admin/deleteStaff';
      param.show=self.showStaffData.bind(self);
    };

    $.ajax({
      method:'POST',
      url:param.url,
      data:{deleteArr:JSON.stringify(deleteArr)},
      success:function(result){
        if(result.status=='0'){
          self.closeModifyW();
          param.show();
          self.pop('删除成功');
        }
      },
      error:function(err){
        console.log(err);
      }
    });
  }
  //查询公司员工数据
  getStaffData(){
    let self=this;

    return new Promise((resolve,reject)=>{
      $.ajax({
        method:"POST",
        url:self.staffInfoParam.url,
        data:self.staffInfoParam,
        success:function(result){
          resolve.call(self,result);
        },
        error:function(err){
          reject.call(err);
        }
      });
    });
  }
  //公司员工信息数据渲染
  showStaffData(){
    let self=this;
    let result=self.getStaffData();
    let content='';
    result.then(data=>{
      if(data.status=='0'){
        data.result.data.forEach((item,index)=>{
          content +=`<tr>
          <td><input type="checkbox" data-mark="${item.id}"/></td>
          <td>${index+1}</td>
          <td>${item.company_name}</td>
          <td>${item.e_name}</td>
          <td>${item.mobile}</td>
          <td>${item.password}</td>
          <td><button class='gaiBtnHook' data-id=${item.id}>修改</button></td>
          <td><button class='${item.mark=='0'?"bgHui":""} startUseHook' data-id=${item.id}>${item.mark=='0'?"禁用":"启用"}</button></td>
          </tr>`;
        });
        $(".content tbody").html(content);
        //分页查询
        self.paginationSearch({
          totalData:data.result.total=='0'?'1':data.result.total,
          showData: self.staffInfoParam.pageSize,
          coping:true,
          current:self.staffInfoParam.currentPage,
          homePage:'首页',
          endPage:'末页',
          prevContent:'上页',
          nextContent:'下页',
          callback:function(api){
            self.staffInfoParam.currentPage=api.getCurrent();//点击第几页
            self.showStaffData();
          }
        });
      }
    });
  }
  //公司员工启用
  startUse(e){
    let self=this;
    let startBtn=e.target;
    let param={
      id:$(startBtn).attr('data-id'),
      mark:$(startBtn).text()=='启用'?'0':'1'
    };

    $.ajax({
      method:'POST',
      url:'/admin/startUse',
      data:param,
      success:function(result){
        if(result.status=='0'){
          self.showStaffData();
        }
      },
      error:function(err){
        console.log(err);
      }
    });
  }
}

export default Admin;