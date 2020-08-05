// pages/category/index.js
// 引入用来发送请求的方法
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    idx: 0,
    // 右侧滚动条到顶部的距离
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 1.先判断一下本地存储中有没有旧的数据
     * { time: Date.now(),data: [...] }
     * 2.没有数据就直接发送请求
     * 3.有旧的数据 同时 旧的数据也没有过期 就使用本地存储中的旧数据
     */

    // 获取本地存储中的数据（小程序中也是存在本地存储技术）
    const Cates = wx.getStorageSync("cates");
    // 判断
    if(!Cates){
      // 不存在本地存储 请求数据
      this.getCategoryList();
    }else {
      // 有旧的数据  定义过期时间（暂定10秒）
      if(Date.now() - Cates.time > 1000*10){
        // 超出过期时间  重新发送请求
        this.getCategoryList();
      }else {
        // 可以用旧的数据
        let list = Cates.data;
        this.setData({
          categoryList: list
        })
      }
    }
    
    // this.getCategoryList();
  },
  // 获取分类页数据
  getCategoryList() {
    request({url: '/categories'})
    .then(result=>{
      let list = result.data.message;

      // 把接口的数据存入到本地存储中
      wx.setStorageSync("cates", { time: Date.now(),data: list });

      this.setData({
        categoryList: list
      })
    })
  },
  // 左侧点击事件
  handleItemTap(e) {
    let { index } = e.currentTarget.dataset;
    this.setData({
      idx: index,
      // 重新设置 右侧sroll-view标签到顶部的距离
      scrollTop: 0
    })
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