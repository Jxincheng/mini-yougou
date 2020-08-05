// pages/goods_list/index.js
/**
 * 用户上滑页面  滚动条触底  开始加载下一页数据
 *    1.找到滚动条触底事件  onReachBottom
 *    2.判断有没有下一页数据
 *    3.如果没有下一页数据  弹出一个提示
 *    4.如果有下一页数据  加载下一页数据
 * 
 * 下拉刷新页面 
 *    1.触发下拉刷新事件（需要在页面的json文件中开启一个配置项 enablePullDownRefresh）是否开启下拉刷新
 *    2.重置数据 数组
 *    3.重置页码  设置为1
 *    4.发送请求
 *    5.数据请求回来 需手动的关闭等待效果
 */

// 引入用来发送请求的方法
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  // 从子组件传递过来
  handleTabsItemChange(e) {
    let {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },
  // 获取商品列表数据
  getGoodsList() {
    request({url: "/goods/search",data: this.QueryParams})
    .then(result=>{
      // 获取总条数
      let total = result.data.message.total;
      // 计算总页数
      this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
      this.setData({
        goodsList: [...this.data.goodsList,...result.data.message.goods]
      })
    })

    // 关闭下拉刷新的窗口（如果没有调用下拉刷新的窗口，直接关闭也不会报错）  
    wx.stopPullDownRefresh();
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
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 发送请求
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 判断有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      // 没有下一页数据  弹出一个提示
      wx.showToast({ title: '已经到底了！'});
    }else {
      // 有下一页数据  请求数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})