var app = getApp()
var start = 0
var count = 6
var total = 10
const apiUrl = 'https://api.douban.com/v2/movie/in_theaters'
Page({
  data: {
    list: [],
    title: 'Loading...',
    loading: true,
    windowHeight: 0,
    data_view:'data_none',
    data_load:'data_none',
    data_pull:'data_none'
  },
  onLoad(params) {
    const _this = this
    //获取设备讯息
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({ windowHeight: res.windowHeight })
      }
    })
    wx.request({
      url: apiUrl,
      data: { start: start, count: count ,total:total },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        console.log(res.data)
        total = res.data.total
        console.log(total)
        _this.setData({ list: res.data.subjects, title: res.data.title, loading: false,data_load: 'data_block',data_view: 'data_none',data_pull:'data_none' })

      }
    })
  },
  upperEventHandle: function (e) {
    console.log('滑动到顶部')
    console.log(e)
    count = 6
    const _this = this
    wx.request({
      url: apiUrl,
      data: { start: start, count: count, total: total },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        total = res.data.total
        _this.setData({ list: res.data.subjects, title: res.data.title,data_pull: 'data_block' })
        setTimeout(function(){
          _this.setData({ list: res.data.subjects, title: res.data.title,data_pull: 'data_none' })
        },2000)
      }
    })
  },
  lowerEventHandle: function (e) {
    console.log('滑动到底部')
     const _this = this
    if (count <= total) {
      count += 6
      wx.request({
        url: apiUrl,
        data: { start: start, count: count, total: total },
        header: {
          'Content-Type': 'json'
        },
        success: function (res) {
          total = res.data.total
          _this.setData({ list: res.data.subjects, title: res.data.title,data_load: 'data_block',data_view: 'data_none' })
          // _this.setData({ list: _this.data.list.concat(res.data.subjects) })
        }
      })
    }else if(count > total){
      count = total
      console.log(total)
      _this.setData({ data_view: 'data_block',data_load: 'data_none'  })
    }
  },
  scroll: function (e) {
    console.log('滑动过程中')
  }
})
