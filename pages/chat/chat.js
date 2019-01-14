Page({
  data: {
    lists: [
      
    ],
    openid: '1',
    match_user_openid:'1',
  },

  onUnload:  function(options){
    /*var that = this;
    var finallist;

    var res = wx.getStorageSync('chatList' + that.match_user_openid);
    if(res != undefined){
      var reslist = JSON.parse(res);
    }else{
      var reslist = [];
    }
    console.log('storage=' + res);
    finallist = reslist.concat(that.data.lists);
    console.log(finallist);
    finallist = JSON.stringify(finallist);*/
    if (this.data.lists != []){
      var finallist = JSON.stringify(this.data.lists);
      wx.setStorageSync('chatList' + this.match_user_openid, finallist);
    }  
    wx.closeSocket()
  },

  onReady: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var finallist = [];
    that.setData({
      openid: openid,
    })
    wx.request({
      url: 'http://localhost:8001/chat/getMatchingUser',
      data: {
        openid: that.data.openid,//获取openid的话 需要向后台传递code,利用code请求api获取openid
      },
      success: function (res) {
        that.setData({
          match_user_openid: res.data.target_openid
        })
        var locallist = wx.getStorageSync('chatList' + that.match_user_openid);
        console.log(locallist);
        //locallist = [];
        if(locallist == null || locallist == ''){
          locallist = [];
        }else{
          locallist = JSON.parse(locallist);
        }
        wx.request({
          url: 'http://localhost:8001/chat/receiveMessage?openid='+that.data.openid,
          success: function(res){
            wx.request({
              url: 'http://localhost:8001/chat/receiveMessageSuccess?openid=' + that.data.openid,
            })
            console.log('redis data=');
            console.log(res.data);
            if(res.data.messages != undefined){
              finallist = locallist.concat(res.data.messages);
            }else{
              finallist = locallist;
            }
  
            that.setData({
              lists: finallist
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
            console.log('lists=');
            console.log(that.data.lists);
          }
        })
      },
      fail: function () {
        wx.showModal({
          title: '服务器错误',
          content: '抱歉！请稍候重试',
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              console.log('用户点击确定')
            } else {//这里是点击了取消以后
              console.log('用户点击取消')
            }
          }
        })
      }
    })

    /*wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data,
        })
        wx.request({
          url: 'http://localhost:8001/chat/getMatchingUser',
          data: {
            openid: that.data.openid,//获取openid的话 需要向后台传递code,利用code请求api获取openid
          },
          success: function (res) {
            that.setData({
              match_user_openid: res.data.target_openid
            })
          },
          fail: function(){
            wx.showModal({
              title: '服务器错误',
              content: '抱歉！请稍候重试',
              success: function (res) {
                if (res.confirm) {//这里是点击了确定以后
                  console.log('用户点击确定')
                } else {//这里是点击了取消以后
                  console.log('用户点击取消')
                }
              }
            })
          }
        })


      },
    })*/

    //连接成功
    wx.onSocketOpen(function () {

    })

    //接收数据
    wx.onSocketMessage(function (data) {
      var objData = JSON.parse(data.data);
      that.data.lists.push(objData);
    })

    //连接失败
    wx.onSocketError(function () {
      console.log('websocket连接失败！');
    })
  },

  formSubmit: function (e) {
    wx.sendSocketMessage({
      data: e.detail.value.content,
    })
    var timestamp = (new Date()).valueOf();
    var message = {
      content: e.detail.value.content,
      senderName:"我",
      time:timestamp,
      sender:this.data.openid,
      reciever: this.data.match_user_openid,
    }
    this.data.lists.push(message);
  },
})