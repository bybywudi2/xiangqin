Page({
  data: {
    openid: '1',
  },
  onLoad: function(options){
    
  },

 
  onReady: function (options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(res.data)
        that.setData({
          openid: res.data,
        })
        wx.connectSocket({
          url: "ws://localhost:8001/websocket" + "?openid=" + that.data.openid,
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success() {
            console.log('success');
          },
          fail() {
            console.log('fail')
          }
        })
      },
    })
    //建立连接


    //连接成功
    wx.onSocketOpen(function () {
      wx.sendSocketMessage({
        data: 'stock',
      })
    })

    //接收数据
    wx.onSocketMessage(function (data) {
      //var objData = JSON.parse(data.data);
      console.log(data);
    })

    //连接失败
    wx.onSocketError(function () {
      console.log('websocket连接失败！');
    })
  },
})