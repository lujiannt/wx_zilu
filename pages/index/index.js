//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    juzi: '寒冷到了极致时，太阳就要降临。',
    juzis: [
      '寒冷到了极致时，太阳就要降临。',
      '踮起脚尖就能更接近阳光。',
      '逆水行舟用力撑， 一篙不慎退千寻。',
      '莫等闲，白了少年头，空悲切。'
    ],
    pic: '../../style/img/3.jpg',
    pics: [
      '../../style/img/1.jpg',
      '../../style/img/1.jpg',
      '../../style/img/1.jpg',
    ]
  },
  toZhuanZhu: function() {
    wx.navigateTo({
      url: '../fanqie/fanqie'
    })
  },
  onLoad: function() {
    var self = this;
    var index_juzi = 0;
    var juzis = self.data.juzis;
    var index_pic = 0;
    var pics = self.data.pics;

    //首页轮播
    setInterval(function() {
      if (index_juzi < juzis.length - 1) {
        index_juzi++;
      } else {
        index_juzi = 0;
      }

      if (index_pic < pics.length - 1) {
        index_pic++;
      } else {
        index_pic = 0;
      }

      self.setData({
        juzi: juzis[index_juzi],
        pic: pics[index_pic],
      })
    }, 5000);

  },

})