# douban.github.io
微信小程序,豆瓣电影,调用豆瓣API


## 页面的跳转

	使用navigator标签
	<navigator src=""></navigator>

### 页面与页面之间建立关联
我们在点击navigator的时候,需要确定你点的是什么,这个就是需要参数了

	<navigator url="../item/item?type=in_theaters&name=正在热映&id={{  item.id  }}">  </navigator>

我们在把另一个页面跟他建立联系的时候,可以使用

	在需要跳转到的页面设置js文件
	在onLoad中从params中获取到参数,这样navigator标签和这个页面就建立联系了 
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

## 上拉刷新和下拉加载
最近在学习微信小程序,想要实现在获取列表的时候可以上拉刷新和下拉加载,现在用豆瓣的API
总结了一下

### wxml结构

** 注意:在这里重要的就是scroll-view标签了 **

scroll-view标签必须要有高度

windowHeight 窗口高度

scroll-y 允许纵向滚动

upper-threshold 距顶部/左边多远时（单位px），触发 scrolltoupper 事件

lower-threshold 距底部/右边多远时（单位px），触发 scrolltolower 事件

bindscrolltoupper 滚动到顶部/左边，会触发 scrolltoupper 事件

bindscrolltolower 滚动到底部/右边，会触发 scrolltolower 事件

bindscroll 滚动时触发

.data_more是在加载完所有的数据显示,刚开始设置隐藏

.data_load是在每次下拉时候显示,刚开始设置隐藏
	

	<loading hidden="{{ !loading }}">
	        拼了命的加载中...
	</loading>

	<scroll-view style="height:{{ windowHeight }}px" scroll-y="true" upper-threshold="0px" lower-threshold="20px" bindscrolltoupper="upper" bindscrolltolower="lower" bindscroll="scroll">
	<view class="data_pull {{ data_pull }}"><view></view>刷新</view>
	  <view class="list_view">
	    <block wx:for="{{ list }}" vx:key="index">
	      <navigator url="../item/item?type=in_theaters&name=正在热映&id={{  item.id  }}">
	        <view class="list_item">
	          <image src="{{item.images.small}}"></image>
	          <view class="list_info">
	            <text class="title">{{ item.title }}</text>
	            <text class="year">{{ item.original_title}} ({{ item.year }})</text>
	            <text class="director">导演：
	              <block wx:for="{{ item.directors }}" vx:key="index"> {{ item.name }}</block>
	            </text>
	          </view>
	          <view class="rating">
	            <text class="score">{{ item.rating.average }}</text>
	          </view>
	        </view>
	      </navigator>
	    </block>
	  </view>
	  <view class="data_more {{ data_view }}">没有更多数据了</view>
	   <view class="data_load {{ data_load }}"><view></view>正在加载更多数据</view>
	</scroll-view>

### wxss样式

	.list_tit{display:block;padding:25rpx;text-align:center;font-size:30rpx;border-bottom: 1rpx solid #ccc;}
	.list_view{display:flex;flex:1;flex-direction: column;}
	.list_item{display: flex;padding: 20rpx;border-bottom: 1rpx solid #eee;}
	.list_item image {height: 200rpx;width: 140rpx;}
	.list_info {flex: 1;margin-left:50rpx;color: #777;font-size: 30rpx;}
	.list_info text{display:block;margin: 10rpx 0;}
	.score {display:inline-block;width: 60rpx;height: 40rpx;font-size: 30rpx;background-color: #c40;color: #fff;border-radius: 10rpx;text-align:center;line-height:40rpx ;}
	scroll-view {width: 100%;height: 1000 rpx;}
	.data_more,.data_load,.data_pull{display:block;width:100%;margin:40rpx 0;text-align:center;font-size:28rpx;color:#ccc;}
	.data_load view,.data_pull view{margin-top:20rpx;vertical-align:middle;display:inline-block;width:70rpx;height:70rpx;background:url(../../images/loading.gif)no-repeat top center;background-size:60%}
	.data_load text{background:url(../../images/loading.gif)no-repeat -216rpx -154rpx;}
	.data_none{display:none;}
	.data_block{display:block;}

### JS

	var app = getApp()
	var start = 0       //豆瓣API的参数
	var count = 6       //每次显示的数据条数
	var total = 10		//总数据条数,随便给的,因为会动态加载
	var apiUrl = 'https://api.douban.com/v2/movie/in_theaters';    // 请求链接
	Page({
	  data: {
	    list: [],                     //根据豆瓣api获取到的数据
	    title: 'Loading...',
	    loading: true,                //刚开始数据没加载完成时,显示正在加载,提高用户体验
	    windowHeight: 0,              //窗口高度
	    data_view: 'data_none',       //在用户下拉的时候,如果有数据则隐藏,没有数据了就显示
	    data_load: 'data_none',       //在用户下拉的时候,如果有更多数据就显示,没有数据了就隐藏
	    data_pull: 'data_none'        //在用户上拉的时候,显示2秒
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
	      data: { start: start, count: count, total: total },
	      header: {
	        'Content-Type': 'json'
	      },
	      success: function (res) {
	        console.log(res.data)
	        total = res.data.total
	        _this.setData({ list: res.data.subjects, title: res.data.title, loading: false, data_load: 'data_block', data_view: 'data_none', data_pull: 'data_none' })
	
	      }
	    })
	  },
	//上拉刷新
	  upper: function (params) {
	    console.log('滑动到顶部')
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
	        _this.setData({ list: res.data.subjects, title: res.data.title, data_pull: 'data_block' })
	        setTimeout(function () {
	          _this.setData({ list: res.data.subjects, title: res.data.title, data_pull: 'data_none' })
	        }, 2000)
	      }
	    })
	  },
	//下拉加载更多
	  lower: function (e) {
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
	          _this.setData({ list: res.data.subjects, title: res.data.title, data_load: 'data_block', data_view: 'data_none' })
	          // _this.setData({ list: _this.data.list.concat(res.data.subjects) })
	        }
	      })
	    } else if (count > total) {
	      count = total
	      console.log(total)
	      _this.setData({ data_view: 'data_block', data_load: 'data_none' })
	    }
	  },
	//滑动过程中
	  scroll: function (e) {
	    console.log('滑动过程中')
	  }
	})


【end】
