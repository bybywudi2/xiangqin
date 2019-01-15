// components/bubble /bubble.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      value: {}
    },
    localOpenId: {
      type: String,
      value: ''
    },
    id: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSender: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    judgeSender() {
      if (this.data.sender == this.properties.localOpenId) {
        that.setData({
          isSender: 1
        })
      }
    },
  }
})