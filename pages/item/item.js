var app = getApp()
Page({
    data: {
        list: [],
        loading: true,
    },
    onLoad (params) {
    const apiUrl = 'https://api.douban.com/v2/movie/subject/' + params.id
    const _this = this
    wx.request({
        url: apiUrl,
        data: {},
        header: {
            'Content-Type': 'json'
        },
        success: function (res) {
            _this.setData({ list: res.data,loading: false})
        }
    })
}
})