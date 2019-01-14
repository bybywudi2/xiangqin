Page({
  data: {
    openid: '1',
    messages: [{
        id: "msg1",
        message: '去结婚吧',
        messageType: 1,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg2",
        message: '走！',
        messageType: 0,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg3",
        message: '真的么？？？我有点不敢相信自己的眼睛',
        messageType: 1,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg4",
        message: '哈哈哈，当然是假的，我一定是在做梦',
        messageType: 0,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg5",
        message: '是的，孩子，醒醒吧，有多少分量自己还不清楚呢',
        messageType: 1,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg6",
        message: ':)',
        messageType: 0,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg7",
        message: '滚滚滚，别来烦老娘',
        messageType: 1,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg8",
        message: '女神的威怒',
        messageType: 0,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg9",
        message: '屌丝也配有女神',
        messageType: 1,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg10",
        message: '你这么说就有点不对了。。。',
        messageType: 0,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg11",
        message: '实话实说，等你变成高富帅再说吧',
        messageType: 1,
        url: '../../images/photoupload.jpg'
      },
      {
        id: "msg12",
        message: '高是不可能了，变富吧，哈哈哈哈',
        messageType: 0,
        url: '../../images/photoupload.jpg'
      }
    ], // 聊天记录
    msg: '', // 当前输入
    scrollTop: 0, // 页面的滚动值
    socketOpen: false, // websocket是否打开
    tolastId: '', // 最后一条消息的ID
    isFirstSend: true // 是否第一次发送消息(区分历史和新加)
  },

  onUnload: function (options) {
    wx.closeSocket()
  },

  onLoad(option) {
    // 设置标题
  },

  onReady: function (options) {
    var that = this;
    //    wx.getStorage({
    //      key: 'openid',
    //      success: function (res) {
    //        console.log(res.data)
    //        that.setData({
    //          openid: res.data,
    //        })
    //        wx.connectSocket({
    //          url: "ws://localhost:8001/websocket" + "?openid=" + that.data.openid,
    //          header: {
    //            'content-type': 'application/json'
    //          },
    //          method: "GET",
    //          success() {
    //            console.log('success');
    //          },
    //          fail() {
    //            console.log('fail')
    //          }
    //        })
    //      },
    //    })
    //
    //连接成功
    wx.onSocketOpen(function () {

    })

    //接收数据
    wx.onSocketMessage(function (data) {
      var objData = JSON.parse(data.data);
      console.log(data);
      console.log(objData);
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
    console.log(e.detail.formId);
  },
  setNickName(option) {
    const nickname = option.nickname || '匿名聊天';
    wx.setNavigationBarTitle({
      title: nickname
    });
  },
  // 延迟页面向顶部滑动
  delayPageScroll() {
    let messages = this.data.messages;
    let length = messages.length;
    let lastId = messages[length - 1].id;
    this.setData({
      tolastId: lastId
    });

  },
  // 输入
  onInput(event) {
    const value = event.detail.value;
    this.setData({
      msg: value
    });
  },
  // 聚焦
  onFocus() {

    this.setData({
      scrollTop: 9999999
    });
  },
  sendMessage() {
    this.delayPageScroll();
    console.log(this.data.tolastId)
  }
})