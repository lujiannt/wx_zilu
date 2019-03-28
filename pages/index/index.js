//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    juzi:'寒冷到了极致时，太阳就要降临。',
    juzis:[

    ],
    pic:'../../style/img/3.jpg',
    pics:[

    ]
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
 
})
