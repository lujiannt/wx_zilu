//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    progress_txt: '正在匹配中...',  
    count: 0, // 设置 计数器 初始为0
    countTimer: null // 设置 定时器 初始为null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
  },
  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(4);// 设置圆环的宽度
    ctx.setStrokeStyle('#DCDCDC'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
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
  countInterval: function () {
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
        this.setData({
          progress_txt: "匹配成功"
        });
        clearInterval(this.countTimer);
      }
    }, 100)
  },
  onReady: function () {
    this.drawProgressbg();
    // this.drawCircle(2) 
    this.countInterval()
  },
})
