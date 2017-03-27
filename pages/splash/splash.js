var app = getApp()
Page({
  data: {
    imgUrls: []
  },
  onLoad () {
    const apiUrl = 'https://api.douban.com/v2/movie/in_theaters?count=3'
    const _this = this
    wx.request({
      url: apiUrl,
      data: {},
      header: {
          'Content-Type': 'json'
      },
      success: function (res) {
        _this.setData({ imgUrls: res.data.subjects })
      }
    })
  },
  startIndex:function(){
  	wx.switchTab({
	  url: '../index/index'
	})
  }
})

