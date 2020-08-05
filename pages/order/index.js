// pages/order/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部订单",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let {type} = options;
    // let {tabs} = this.data;
    // tabs.forEach((v,i)=>i===type-1?v.isActive=true:v.isActive=false);
    // this.setData({
    //   tabs
    // });
  },
  changeTitleByIndex(index) {
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    let {index} = e.detail;
    this.changeTitleByIndex(index);

    this.getOrders(index+1);
  },
  // 获取订单
  getOrders(type) {
    request({ url: "/my/orders/all", data: {type } })
    .then(result=>{
      let {orders} = result.data.message;
      this.setData({
        orders: orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
      })
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
    let token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }

    // 1.获取当前小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2.数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1];
    // 3.获取url上的type
    let {type} = currentPage.options;

    this.changeTitleByIndex(type-1);

    this.getOrders(type);
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