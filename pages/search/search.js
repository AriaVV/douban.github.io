var total=""
Page({
    data:{
        value:'',
        list:[],
        title: '没有更多内容了...',
        loading: false,
        data_view: 'data_none'
    },
    search:function(event){
        this.setData({ value:event.detail.value })
        const apiUrl = 'https://api.douban.com/v2/movie/search?q='+event.detail.value
        const _this = this
        wx.request({
            url: apiUrl,
            data: {total:total},
            header: {
                'Content-Type': 'json'
            },
            success: function (res) {
                console.log(res.data.total)
                total=res.data.total
                _this.setData({ list: res.data.subjects,title: ' ',loading:false,data_view:'data_none'})
                if(res.data.total == 0){
                     _this.setData({ data_view:'data_block' })
                }
            }
        })
    },
    search_load:function(event){
        this.setData({ loading:true })
    }
})