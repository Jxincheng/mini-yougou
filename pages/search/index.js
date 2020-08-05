// pages/search/index.js

import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    isFocus: false,
    inputVal: ""
  },
  TimeId: -1,
  // 输入框的值改变  触发
  handleInput(e) {
    // 获取输入框的值
    let {value} = e.detail;
    // 检测合法性
    if(!value.trim()){
      this.setData({
        goods: [],
        isFocus: false
      })
      // 值不合法
      return;
    }
    // 发送请求获取数据
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
      this.qsearch(value);
    }, 1000);
  },
  qsearch(query) {
    request({url:"/goods/qsearch", data:{query}})
    .then(result=>{
      let goods = result.data.message;
      this.setData({
        goods
      })
    })
  },
  handleCancel(e) {
    this.setData({
      inputVal: "",
      isFocus: false,
      goods: []
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})