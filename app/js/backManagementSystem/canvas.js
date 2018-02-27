class Time{
  //时钟下次时间距离设定时间的秒数与当前时间距离设定时间的秒数是否一致，来改变时间
  update(){
    let self=this;
    let curShowTimeSeconds=self.timeParam.curShowTimeSeconds;
    let MARGIN_LEFT=self.timeParam.MARGIN_LEFT;
    let MARIN_TOP=self.timeParam.MARIN_TOP;
    let RADIUS=self.timeParam.RADIUS;
    let nextShowTimeSeconds=self.getCurrentShowTimeSeconds();

    let nextHours=parseInt(nextShowTimeSeconds/3600);
    let nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
    let nextSeconds=nextShowTimeSeconds%60; 

    let curHours=parseInt(curShowTimeSeconds/3600);
    let curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
    let curSeconds=curShowTimeSeconds%60; 

    if(nextSeconds != curSeconds){
      if(parseInt(curHours/10)!=parseInt(nextHours/10)){
        self.addBalls(MARGIN_LEFT+0,MARIN_TOP,parseInt(nextHours/10));
      }
      if(parseInt(curHours%10)!=parseInt(nextHours%10)){
        self.addBalls(MARGIN_LEFT+15*(RADIUS+1),MARIN_TOP,parseInt(nextHours%10));
      }
      if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
        self.addBalls(MARGIN_LEFT+39*(RADIUS+1),MARIN_TOP,parseInt(nextMinutes/10));
      }
      if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
        self.addBalls(MARGIN_LEFT+54*(RADIUS+1),MARIN_TOP,parseInt(nextMinutes%10));
      }
      if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
        self.addBalls(MARGIN_LEFT+78*(RADIUS+1),MARIN_TOP,parseInt(nextSeconds/10));
      }
      if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
        self.addBalls(MARGIN_LEFT+93*(RADIUS+1),MARIN_TOP,parseInt(nextSeconds%10));
      }
      self.timeParam.curShowTimeSeconds=nextShowTimeSeconds;
    }
    self.updateBalls();
  }
  //小球运动
  updateBalls(){
    let self=this;
    let balls=self.timeParam.balls;
    let WINDOW_HEIGHT=self.timeParam.WINDOW_HEIGHT;
    let WINDOW_WIDTH=self.timeParam.WINDOW_WIDTH;
    let RADIUS=self.timeParam.RADIUS;

    for(let i=0;i<balls.length;i++){
      balls[i].x+=balls[i].vx/5;
      balls[i].y+=balls[i].vy;
      balls[i].vy+=balls[i].g;

      if(balls[i].y >= WINDOW_HEIGHT - RADIUS){
        balls[i].y = WINDOW_HEIGHT - RADIUS;
        balls[i].vy=-balls[i].vy*0.6;
      }
    }
    //优化性能，删除多的彩球
    let cnt=0;
    for(let j=0;j<balls.length;j++)
      if(balls[j].x+RADIUS>0&&balls[j].x - RADIUS< WINDOW_WIDTH)
        balls[cnt++]=balls[j];

    while(balls.length>Math.min(300,cnt)){//Math.min()取小的数
      balls.pop();
    }
  }
  //增加小球
  addBalls(x,y,num){
    let self=this;
    let digit=self.digit;
    let WINDOW_HEIGHT=self.timeParam.WINDOW_HEIGHT;
    let WINDOW_WIDTH=self.timeParam.WINDOW_WIDTH;
    let RADIUS=self.timeParam.RADIUS;
    let colors=self.timeParam.colors;
    let balls=self.timeParam.balls;
    
    for(let i=0;i<digit[num].length;i++){
      for(let j=0;j<digit[num][i].length;j++){
        if(digit[num][i][j]==1){
          let aBall={
            x:x+j*2*(RADIUS+1)+(RADIUS+1),
            y:y+i*2*(RADIUS+1)+(RADIUS+1),
            g:1.5+Math.random(),
            vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,//-1的随机次方，均分正负
            vy:-5,
            color:colors[Math.floor(Math.random()*colors.length)]
          };
          balls.push(aBall);
        }
      }
    }
  }
  //获取距离设定时间的秒数
  getCurrentShowTimeSeconds(){
    let curTime=new Date();
    let curHours=curTime.getHours()*60*60;
    let curMinutes=curTime.getMinutes()*60;
    let curSeconds=curTime.getSeconds();
    let ret=curHours+curMinutes+curSeconds;

    return ret>=0?ret:0;
  }
  //绘制时钟和彩色小球
  render(cxt){
    let self=this;
    let WINDOW_HEIGHT=self.timeParam.WINDOW_HEIGHT;
    let WINDOW_WIDTH=self.timeParam.WINDOW_WIDTH;
    let MARGIN_LEFT=self.timeParam.MARGIN_LEFT;
    let MARIN_TOP=self.timeParam.MARIN_TOP;
    let RADIUS=self.timeParam.RADIUS;
    let balls=self.timeParam.balls;
    let curShowTimeSeconds=self.getCurrentShowTimeSeconds();
    
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    let hours=parseInt(curShowTimeSeconds/3600);
    let minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
    let seconds=curShowTimeSeconds%60;
    
    self.renderDigit(MARGIN_LEFT,MARIN_TOP,parseInt(hours/10),cxt);
    self.renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARIN_TOP,parseInt(hours%10),cxt);
    self.renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARIN_TOP,10,cxt);
    self.renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARIN_TOP,parseInt(minutes/10),cxt);
    self.renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARIN_TOP,parseInt(minutes%10),cxt);
    self.renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARIN_TOP,10,cxt);
    self.renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARIN_TOP,parseInt(seconds/10),cxt);
    self.renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARIN_TOP,parseInt(seconds%10),cxt);

    for(let i=0;i<balls.length;i++){
      cxt.fillStyle=balls[i].color;

      cxt.beginPath();
      cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI);
      cxt.closePath();

      cxt.fill();
    }
  }
  //绘制时钟小球
  renderDigit(x,y,num,cxt){
    let self=this;
    let digit=self.digit;
    let RADIUS=self.timeParam.RADIUS;

    cxt.fillStyle="rgb(0,102,153)";

    for(let i=0;i<digit[num].length;i++){
      for(let j=0;j<digit[num][i].length;j++){
        if(digit[num][i][j]==1){
          cxt.beginPath();
          cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
          cxt.closePath();

          cxt.fill();
        }
      }
    }
  }
}

export default Time;