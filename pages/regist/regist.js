// pages/regist/regist.js
const appUrl = require('../../utils/url.js')

const app = getApp()

Page({
  //初始化数据
  data: {
    locations: ['榆阳区', '府谷', '神木', '定边', '靖边', '横山', '米脂', '佳县', '子洲', '吴堡', '绥德', '清涧'],
    educations: ['保密', '小学', '初中', '高中', '专科', '本科', '硕士', '博士'],
    index: 0,
    date: '1990-06-15',
    time: '11:19',
    allValue: '',
    openid: '1',
  },

  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data,
        })
      },
    })
  },
  //表单提交按钮
  formSubmit: function (e) {

    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      allValue: e.detail.value
    })

    wx.request({
      //url: app.globalData.getopenid_url,
      url: `http://${appUrl[appUrl.env]}/regist/userInfoRegist`,
      data: {
        'birthday': e.detail.value.birthday,
        'company': e.detail.value.company,
        'compiled': e.detail.value.compiled,
        'education': e.detail.value.education,
        'height': e.detail.value.height,
        'hometown': e.detail.value.hometown,
        'is_information_public': e.detail.value.is_information_public,
        'is_live_location_yulin': e.detail.value.is_live_location_yulin,
        'job': e.detail.value.job,
        'live_location': e.detail.value.live_location,
        'openid': e.detail.value.openid,
        'phone': e.detail.value.phone,
        'realname': e.detail.value.realname,
        'sex': e.detail.value.sex,
        'standard': e.detail.value.standard,
        'userwx': e.detail.value.userwx,
        'weight': e.detail.value.weight,
        'work_of_father': e.detail.value.work_of_father,
        'work_of_mom': e.detail.value.work_of_mom
      },
      success: function (res) {
        console.info("succ!");

        wx.uploadFile({
            url: `http://${appUrl[appUrl.env]}/regist/photoupload`,
            filePath: e.detail.value.photo_self_path,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              'accept': 'application/json',
              'Authorization': 'Bearer ..' //若有token，此处换上你的token，没有的话省略
            },
            formData: {
              'openid': e.detail.value.openid,
              'type': 'photo_self',
            },
            success: function (res) {
              var data = res.data;
              console.log('data');
            },
            fail: function (res) {
              console.log('fail');

            },
          }),

          wx.uploadFile({
            url: `http://${appUrl[appUrl.env]}/regist/photoupload`,
            filePath: e.detail.value.photo_others_path,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              'accept': 'application/json',
              'Authorization': 'Bearer ..' //若有token，此处换上你的token，没有的话省略
            },
            formData: {
              'openid': e.detail.value.openid,
              'type': 'photo_others',
            },
            success: function (res) {
              var data = res.data;
              console.log('data');
            },
            fail: function (res) {
              console.log('fail');

            },
          })
      }
    })




  },
  //表单重置按钮
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      allValue: ''
    })
  },
  //---------------------与选择器相关的方法
  //地区选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //日期选择
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //时间选择
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  img_item: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          ['tempFilePaths[' + e.target.id + ']']: res.tempFilePaths[0]
        })
      }
    })
  }



})