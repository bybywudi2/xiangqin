Page({
  data: {
    openid: '1',
  },

  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data,
        })
      },
    })

    //建立连接
    wx.connectSocket({
      url: "ws://localhost:8001/websocket" + "?openid=" + this.data.openid,
      data:{
        openid:this.data.openid,
        open:'1'
      },
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