const msgs = require("./chat-mock-data.js");
const appUrl = require("../../utils/url.js");
Page({
  data: {
    lists: [],
    formIds:[],
    msgLen: 0,
    openid: "1",
    match_user_openid: "1",
    messages: [], // 聊天记录
    msg: "", // 当前输入
    scrollTop: 0, // 页面的滚动值
    socketOpen: false, // websocket是否打开
    toIndex: "", // 最后一条消息的ID
    isFirstSend: true // 是否第一次发送消息(区分历史和新加)
  },

  onUnload: function (options) {
    var that = this;
    console.log("formIds=:" + this.data.formIds);
    if (this.data.messages != []) {
      var finallist = JSON.stringify(this.data.messages);
      wx.setStorageSync("chatList" + this.data.match_user_openid, finallist);
    }
    wx.request({
      url: `https://yulinweb.xyz/yulinlianaibar/matching/formIdRecieve`,
      data: {
        openid: that.data.openid,
        formIds: that.data.formIds,
      },
      method:'POST',
      success: function (res) {
      }
    })
    wx.closeSocket();
  },

  onLoad(option) {
    // 设置标题
  },

  onShow: function (options) {
    var that = this;
    var openid = wx.getStorageSync("openid");
    var finallist = [];
    that.setData({
      openid: openid
    });
    this.delayPageScroll();
    wx.request({
      url: `https://yulinweb.xyz/yulinlianaibar/chat/getMatchingUser`,
      data: {
        openid: that.data.openid //获取openid的话 需要向后台传递code,利用code请求api获取openid
      },
      success: function (res) {
        that.setData({
          match_user_openid: res.data.target_openid
        });
        var locallist = wx.getStorageSync("chatList" + that.data.match_user_openid);
        //locallist = [];
        if (locallist == null || locallist == "") {
          locallist = [];
        } else {
          locallist = JSON.parse(locallist);
        }
        wx.request({
          url: `https://yulinweb.xyz/yulinlianaibar/chat/receiveMessage?openid=` +
            that.data.openid,
          success: function (res) {
            wx.request({
              url: `https://yulinweb.xyz/yulinlianaibar/chat/receiveMessageSuccess?openid=` +
                that.data.openid
            });
            console.log("redis data=");
            console.log(res.data);
            if (res.data.messages != undefined) {
              finallist = locallist.concat(res.data.messages);
            } else {
              finallist = locallist;
            }

            that.setData({
              messages: finallist
            });
            wx.connectSocket({
              url: `wss://yulinweb.xyz/yulinlianaibar/websocket` +
                "?openid=" +
                that.data.openid,
              header: {
                "content-type": "application/json"
              },
              method: "GET",
              success() {
                console.log("success");
              },
              fail() {
                console.log("fail");
              }
            });
            console.log(that.data.messages);
          }
        });
      },
      fail: function () {
        wx.showModal({
          title: "服务器错误",
          content: "抱歉！请稍候重试",
          success: function (res) {
            if (res.confirm) {
              //这里是点击了确定以后
              console.log("用户点击确定");
            } else {
              //这里是点击了取消以后
              console.log("用户点击取消");
            }
          }
        });
      }
    });

    /*wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data,
        })
        wx.request({
          url: 'https://yulinweb.xyz/yulinlianaibar/chat/getMatchingUser',
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
    wx.onSocketOpen(function () {});

    //接收数据
    wx.onSocketMessage(function (data) {
      that.delayPageScroll();
      var objData = JSON.parse(data.data);
      that.data.messages.push(objData);
      that.setData({
        messages: that.data.messages
      });
    });

    //连接失败
    wx.onSocketError(function () {
      console.log("websocket连接失败！");
    });
  },

  formSubmit: function (e) {
    wx.sendSocketMessage({
      data: e.detail.value.content
    });
    var timestamp = new Date().valueOf();
    var message = {
      content: e.detail.value.content,
      senderName: "我",
      time: timestamp,
      sender: this.data.openid,
      reciever: this.data.match_user_openid
    };
    this.data.messages.push(message);
  },
  setNickName(option) {
    const nickname = option.nickname || "匿名聊天";
    wx.setNavigationBarTitle({
      title: nickname
    });
  },
  // 延迟页面向顶部滑动
  delayPageScroll() {
    if (this.data.messages.length > 0) {
      let messages = this.data.messages;
      let length = messages.length;
      let lastId = `msg${length - 1}`;
      console.log(lastId)
      this.setData({
        toIndex: lastId
      });
    }
  },
  // 输入
  onInput(event) {
    let value = event.detail.value;
    let _value = value.trim()
    let msglen = _value.length

    this.setData({
      msg: value,
      msgLen: msglen
    });
  },
  // 聚焦
  onFocus() {},
  sendMessage(e) {
    if(this.data.formIds.length < 10){
      this.data.formIds.push(e.detail.formId);
    }
    
    wx.sendSocketMessage({
      data: this.data.msg
    });
    var timestamp = new Date().valueOf();
    var message = {
      content: this.data.msg,
      senderName: "我",
      time: timestamp,
      sender: this.data.openid,
      reciever: this.data.match_user_openid
    };
    console.log(message);
    this.data.messages.push(message);
    this.setData({
      msg: "",
      msgLen: 0,
      messages: this.data.messages
    });
    this.delayPageScroll();
  }
});