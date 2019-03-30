//index.js
//获取应用实例
const app = getApp();
//wx audio音频对象
const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    clickFlag: false, //开始番茄的标识，防止重复点击
    repeatFlag: false, //本次计时完成标识,用来控制是否继续或重置
    countTime: "", //番茄倒计时
    aim: null,
    defaultAim: "专注", //默认专注标题
    defaultEncourage: "让我们开始专注一个番茄钟吧", //默认专注鼓励语
    timeLong: 25, //番茄时长（单位：分钟）
    defaultTimeLong: 25, //默认番茄时长
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    mp3CloudId: "cloud://test-b8c946.7465-test-b8c946/audio/d.mp3", //番茄计时结束提示音云id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    //初始化云平台
    wx.cloud.init({
      env: 'test-b8c946'
    });

    //设置不遵循静音开关
    wx.setInnerAudioOption({
      obeyMuteSwitch: false
    })

    //设置音频路径
    //【注意】：经过测试如果不在onload中赋予src,而是在下面的方法中赋予，play方法无法播放，只能使用autoplay=true来播放（该方式有巨大的延迟）
    //【注意】：所以推测.src是异步方法，不会堵塞，所以导致音频还在加载，play方法却已经调用所以无法播放，autoplay却有效
    innerAudioContext.src = this.data.mp3CloudId;
    // innerAudioContext.autoplay = true;

    //注册音频播放回调
    innerAudioContext.onPlay(() => {
      console.log('play start');
    });
    innerAudioContext.onStop(() => {
      console.log('play stop');
    })
    innerAudioContext.onError((res) => {
      console.log('play error');
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  /**
   * 绘制计时背景圈
   */
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

  /**
   * 绘制进度条
   */
  drawCircle: function(step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);

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

  onReady: function() {
    this.drawProgressbg();
  },

  /**
   * 开始番茄计时
   */
  startFanQie: function() {
    var self = this;

    if (self.data.clickFlag == false) {
      //防止重复点击
      self.setData({
        clickFlag: true,
      });

      var start = new Date();

      //终止时间
      var end_time = parseInt(Date.parse(start) / 1000) - 0 + self.data.timeLong * 60;
      self.data.countTimer = setInterval(() => {
        var now = new Date();
        var curr_time = parseInt(Date.parse(now) / 1000);
        var diff_time = parseInt(end_time - curr_time); // 倒计时时间差
        var m = Math.floor((diff_time / 60 % 60));
        var s = Math.floor((diff_time % 60));
        console.log("diff_time : " + diff_time);
        if (diff_time >= 0) {
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

          if (diff_time == 0) {
            //播放停止提示音
            innerAudioContext.play();

            //设置本次计时完成标识
            self.setData({
              repeatFlag: true,
            });

            //停止计时
            clearInterval(self.data.countTimer);
          }
        }
      }, 1000)
    }
  },

  /**
   * 输入完目标，失去焦点触发
   */
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
  
   /**
   * 改变番茄时长
   */
  changeTimeLong(e) {
    console.log('slider发生 change 事件，携带值为', e.detail.value);
    var self = this;
    self.setData({
      timeLong: e.detail.value
    });
  },

  /**
   * 放弃番茄计时
   */
  fangqi() {
    var self = this;
    wx.showModal({
      title: '',
      content: '逆水行舟用力撑， 一篙不慎退千寻。确定要放弃吗？',
      confirmText: "确定",
      cancelText: "取消",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          console.log('放弃');
          //清除计时
          clearInterval(self.data.countTimer);

          //清除进度条画布
          var ctx = wx.createCanvasContext('canvasProgress');
          ctx.setLineWidth(4); // 设置圆环的宽度
          ctx.setStrokeStyle('#DCDCDC'); // 设置圆环的颜色
          ctx.setLineCap('round') // 设置圆环端点的形状
          ctx.beginPath(); //开始一个新的路径
          ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
          //设置一个原点(110,110)，半径为100的圆的路径到当前路径
          ctx.stroke(); //对当前路径进行描边
          ctx.draw();

          //重置变量
          self.setData({
            defaultAim: "专注",
            aim: null,
            countTime: "00:00",
            count: 0,
            timeLong: self.data.defaultTimeLong,
            clickFlag: false,
            countTimer: null
          });
        } else {
          console.log('取消放弃')
        }
      }
    });
  },

  /**
   * 继续执行番茄计时
   */
  continueFanqie() {
    var self = this;
    //重置画布
    var ctx = wx.createCanvasContext('canvasProgress');
    ctx.setLineWidth(4);
    ctx.setStrokeStyle('#DCDCDC');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.draw();

    //重置相关数据
    self.setData({
      clickFlag: false,
      countTime: "",
      count: 0,
    });

    this.startFanQie();
  },

  /**
   * 重置番茄计时
   */
  resetFanqie() {
    var self = this;

    //重置画布
    var ctx = wx.createCanvasContext('canvasProgress');
    ctx.setLineWidth(4);
    ctx.setStrokeStyle('#DCDCDC');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.draw();

    //重置相关数据
    self.setData({
      repeatFlag: false,
      clickFlag: false,
      defaultAim: "专注",
      aim: null,
      timeLong: self.data.defaultTimeLong,
      countTime: "",
      count: 0
    });
  }
})