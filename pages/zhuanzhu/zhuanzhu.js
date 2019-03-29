//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    clickFlag: false, //开始番茄的标识，防止重复点击
    countTime: "", //番茄倒计时
    aim: null,
    defaultAim: "让我们开始专注一个番茄钟吧",
    timeLong: 25, //番茄时长（单位：分钟）
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {},
  drawProgressbg: function() {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(4); // 设置圆环的宽度
    ctx.setStrokeStyle('#DCDCDC'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function(step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    // gradient.addColorStop("0", "#CD5C5C");

    // gradient.addColorStop("0.5", "#fa8072");
    // gradient.addColorStop("1.0", "#F08080");

    gradient.addColorStop("0", "#fa8072");
    gradient.addColorStop("0.5", "#FF8099");
    gradient.addColorStop("1.0", "#fa8072");

    context.setLineWidth(10);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  //番茄倒计时
  countInterval: function() {
    // 设置倒计时 定时器 每1000毫秒执行一次，计数器count+1 
    this.countTimer = setInterval(() => {
      if (this.data.count <= 60) {
        /* 绘制彩色圆环进度条  
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(this.data.count / (60 / 2))
        this.data.count++;
      } else {
        clearInterval(this.countTimer);
      }
    }, 1000)
  },
  onReady: function() {
    this.drawProgressbg();
    // this.drawCircle(2) 
    // this.countInterval()
  },
  //开始番茄计时
  startFanQie: function() {
    var self = this;
    if (self.data.clickFlag == false) {
      self.setData({
        clickFlag: true,
      });

      var start = new Date();

      //终止时间
      var end_time = parseInt(Date.parse(start) / 1000) - 0 + self.data.timeLong * 60;
      this.countTimer = setInterval(() => {
        var now = new Date();
        var curr_time = parseInt(Date.parse(now) / 1000);
        var diff_time = parseInt(end_time - curr_time); // 倒计时时间差
        var m = Math.floor((diff_time / 60 % 60));
        var s = Math.floor((diff_time % 60));
        console.log("diff_time : " + diff_time);
        if (diff_time <= 0) {
          self.setData({
            defaultAim: "让我们开始专注一个番茄钟吧",
            aim: null,
            countTime: "00:00",
            count: 0
          });

          clearInterval(this.countTimer);

          self.setData({
            clickFlag: false,
            countTime: null,
          });
        } else {
          if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }
          var newCount = self.data.count + 1;
          self.setData({
            countTime: m + ":" + s,
            count: newCount
          });

          var seconds = self.data.timeLong * 60;
          console.log("count : " + self.data.count);
          console.log("seconds : " + seconds);
          this.drawCircle(self.data.count / (seconds / 2));
        }
      }, 1000)
    }


  },
  //输入完目标，失去焦点触发
  onBlur: function(e) {
    var self = this;
    let aim = e.detail.value;
    console.log("aim : " + aim);

    self.setData({
      defaultAim: aim,
      aim: aim
    });
    console.log("aim : " + this.data.aim);
  },
  //改变番茄时长
  changeTimeLong(e) {
    console.log('slider发生 change 事件，携带值为', e.detail.value);
    var self = this;
    self.setData({
      timeLong: e.detail.value
    });
  }
})