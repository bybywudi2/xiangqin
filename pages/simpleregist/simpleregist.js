// pages/regist/regist.js
const appUrl = require('../../utils/url.js')
const app = getApp()
import Toast from '../../components/van/dist/toast/toast'
Page({
  //初始化数据
  data: {
    multiArray: [
      ['陕北', '其他'],
      ['榆林市', '延安市'],
      ['榆阳区', '府谷', '神木', '定边', '靖边', '横山', '米脂', '佳县', '子洲', '吴堡', '绥德', '清涧']
    ],
    multiIndex: [0, 0, 0],
    locations: ['榆阳区', '府谷', '神木', '定边', '靖边', '横山', '米脂', '佳县', '子洲', '吴堡', '绥德', '清涧'],

    educations: ['保密', '小学', '初中', '高中', '专科', '本科', '硕士', '博士'],
    index: 0,
    date: '1990-06-15',
    time: '11:19',
    allValue: '',
    openid: '1',
    userwx: '',
    phone: '',
    job: '',
    height: '',
    weight: ''
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
    function valnumber(x) {
      if (~~x != x) {
        return false
      }
      return true
    }

    if (!valnumber(e.detail.value.phone)) {
      console.log(e.detail.value.phone)
      Toast("电话必须是数字")
      this.setData({
        phone: ''
      })
      return
    }
    if (!valnumber(e.detail.value.height)) {
      Toast("身高必须是数字")
      this.setData({
        height: ''
      })
      return
    }
    if (!valnumber(e.detail.value.weight)) {
      Toast("体重必须是数字")
      this.setData({
        weight: ''
      })
      return
    }
    if (e.detail.value.birthday.trim() == '' || e.detail.value.hometown == '' || e.detail.value.phone.trim() == '' ||
      e.detail.value.sex.trim() == '' || e.detail.value.standard.trim() == '' || e.detail.value.userwx.trim() == '') {
      wx.showModal({
        title: "必填项缺少",
        content: "必填选项不能为空！",
        success: function (res) {}
      });
    } else {
      wx.request({
        //url: app.globalData.getopenid_url,
        url: `https://yulinweb.xyz/yulinlianaibar/regist/userInfoSimpleRegist`,
        data: {
          'birthday': e.detail.value.birthday,
          'height': e.detail.value.height,
          'hometown': e.detail.value.hometown,
          'job': e.detail.value.job,
          'openid': e.detail.value.openid,
          'phone': e.detail.value.phone,
          'sex': e.detail.value.sex,
          'standard': e.detail.value.standard,
          'userwx': e.detail.value.userwx,
          'weight': e.detail.value.weight,
        },
        success: function (res) {
          wx.navigateTo({
            url: '../index/index'
          })
        }
      })
    }





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
  },

  onClickIcon() {
    Toast('请点击微信右下角的按钮“我”查看微信号哦');
  },
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['榆林市', '延安市']
            data.multiArray[2] = ['其他']
            break
          case 1:
            data.multiArray[1] = ['其他']
            data.multiArray[2] = ['其他']
            break
        }
        data.multiIndex[1] = 0
        data.multiIndex[2] = 0
        break
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['榆阳区', '府谷', '神木', '定边', '靖边', '横山', '米脂', '佳县', '子洲', '吴堡', '绥德', '清涧']
                break
              case 1:
                data.multiArray[2] = ['宝塔区', '吴旗县', '志丹县', '安塞县', '子长县', '延川县', '延长县', '甘泉县', '富县', '洛川县', '黄陵县', '黄龙县', '宜川县']
                break
            }
            break
        }
        data.multiIndex[2] = 0
        break
    }
    console.log(data.multiIndex)
    this.setData(data)
  },



})