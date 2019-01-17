//index.js
//获取应用实例
const appUrl = require('../../utils/url.js')

const app = getApp()

Page({
  data: {
    motto: '注册实名信息',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: '1',
    hasRegist: false,
    isReady: false,
    isMatching: false,
  },
  globalData: {
    appid: 'wx782d693b3649f4fa',
    secret: 'a41a51a058f6a7ca83dbe0450e6b2147',
    //local_getopenid_url:'https://yulinweb.xyz/yulinlianaibar/login/getOpenId',
    //test_getopenid_url:'http://39.106.194.129:8080/yulinlianaibar/login/getOpenId'
    getopenid_url: `https://yulinweb.xyz/yulinlianaibar/login/getOpenId`,
    openid: '1',
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //跳转注册
  toRegist: function () {
    wx.navigateTo({
      url: '../simpleregist/simpleregist'
    })
  },

  toChat: function () {
    wx.navigateTo({
      url: '../chat/chat'
    })
  },

  onShow: function () {
    var that = this;
    that.toChat();
    wx.request({
      url: 'https://yulinweb.xyz/yulinlianaibar/regist/getUserStatus' + '/' + that.data.openid,
      success: function (res) {
        console.log(res);
        if (res.data.hasRegist == 1) {
          that.setData({
            hasRegist: true
          })
        } else {
          that.setData({
            hasRegist: false
          })
        }

        if (res.data.isReady == 1) {
          that.setData({
            isReady: true
          })
        } else {
          that.setData({
            isReady: false
          })
        }

        if (res.data.isMatching == 1) {
          that.setData({
            isMatching: true
          })
        } else {
          that.setData({
            isMatching: false
          })
        }

      }
    })
  },

  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data,
        })
        wx.request({
          url: 'https://yulinweb.xyz/yulinlianaibar/regist/getUserStatus' + '/' + that.data.openid,
          success: function (res) {
            console.log(res);
            if (res.data.hasRegist == 1) {
              that.setData({
                hasRegist: true
              })
            } else {
              that.setData({
                hasRegist: false
              })
            }

            if (res.data.isReady == 1) {
              that.setData({
                isReady: true
              })
            } else {
              that.setData({
                isReady: false
              })
            }

            if (res.data.isMatching == 1) {
              that.setData({
                isMatching: true
              })

              wx.navigateTo({
                url: '../chat/chat'
              })

            } else {
              that.setData({
                isMatching: false
              })
            }

          }
        })
      },
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    var that = this;
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    if (true) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.getUserInfo({
              success: function (res_user) {
                wx.request({
                  //url: getopenid_url,
                  url: `https://yulinweb.xyz/yulinlianaibar/login/getOpenId`,
                  data: {
                    code: res.code, //获取openid的话 需要向后台传递code,利用code请求api获取openid
                    headurl: res_user.userInfo.avatarUrl, //这些是用户的基本信息
                    nickname: res_user.userInfo.nickName, //获取昵称
                    sex: res_user.userInfo.gender, //获取性别
                    country: res_user.userInfo.country, //获取国家
                    province: res_user.userInfo.province, //获取省份
                    city: res_user.userInfo.city //获取城市
                  },
                  success: function (res) {
                    console.info("succ!");
                    wx.setStorageSync("userinfo", res.data)
                    wx.setStorageSync("openid", res.data.userinfo.openid) //可以把openid保存起来,以便后期需求的使用
                    that.setData({
                      openid: res.data.userinfo.openid
                    })
                  }
                })
              }
            })
          }
        }
      })
    }


  },

  matching: function (e) {
    var that = this;
    if (true) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.getUserInfo({
              success: function (res_user) {
                wx.request({
                  url: `https://yulinweb.xyz/yulinlianaibar/login/getOpenId`,
                  //url: app.globalData.getopenid_url,
                  data: {
                    code: res.code, //获取openid的话 需要向后台传递code,利用code请求api获取openid
                    headurl: res_user.userInfo.avatarUrl, //这些是用户的基本信息
                    nickname: res_user.userInfo.nickName, //获取昵称
                    sex: res_user.userInfo.gender, //获取性别
                    country: res_user.userInfo.country, //获取国家
                    province: res_user.userInfo.province, //获取省份
                    city: res_user.userInfo.city //获取城市
                  },
                  success: function (res) {
                    console.info("succ!");
                    wx.setStorageSync("userinfo", res.data)
                    wx.setStorageSync("openid", res.data.userinfo.openid) //可以把openid保存起来,以便后期需求的使用
                    that.setData({
                      openid: res.data.userinfo.openid
                    })
                  }
                })
              }
            })
          }
        }
      })
    }


  },

  readyForMatch: function (e) {
    var that = this;
    console.log('formId=' + e.detail.formId);
    wx.request({
      url: `https://yulinweb.xyz/yulinlianaibar/matching/ready`,
      data: {
        openid: that.data.openid,
        formId: e.detail.formId,
      },
      success: function (res) {
        that.setData({
          isReady: true
        })

      }
    })
  },

  setHasRegist() {
    this.setData({
      hasRegist: true
    });
  },


})