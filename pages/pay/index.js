// pages/pay/index.js
/*
   微信支付
      1.那些人 那些账号 可以实现微信支付
          a.企业账号
          b.企业账号的小程序后台中 必须给开发者 添加上白名单
              一个 appid 可以同时绑定多个开发者
              这些开发者就可以公用这个appid 和它的开发权限
    支付按钮
      1.判断缓存中有没有token
      2.没有 跳转到授权页面 进行获取token
      3.有token
*/
import { request } from "../../request/index.js";
import { showToast, requestPayment } from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
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
    // 获取缓存中的收货地址信息
    let address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    cart = cart.filter(v=>v.checked);

    let totalPrice = 0,totalNum = 0;
    cart.forEach(v=>{
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    })

    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
  },
  // 点击 支付按钮
  handleOrderPay() {
    try {
      // 1.判断缓存中有没有token
      let token = wx.getStorageSync("token");
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      // 2.创建订单
      // 2.1 请求头参数
      // let header = {Authorization:token};
      // 2.2 请求体参数
      let order_price = this.data.totalPrice;
      let consignee_addr = this.data.address;
      let cart = this.data.cart;
      let goods = [];
      cart.forEach(v=>goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      let orderParams = { order_price, consignee_addr, goods };
      // 3.发送请求 创建订单 获取订单编号
      let order_number,pay;
      request({url:"/my/orders/create",method:"POST",data:orderParams})
      .then(result=>{
        order_number = result.order_number;
        // 4.发起预支付请求
        return request({url:"",method:"POST",data:{order_number}})
      })
      .then(result=>{
        pay = result.pay;
        // 5.发起微信支付
        return requestPayment(pay)
      })
      .then(result=>{
        // 6.查询后台 订单状态
        return request({url:"",method:"POST",data:{order_number}})
      })
      .then(result=>{
        return showToast({title:"支付成功"})
      })
      .then(result=>{
        // 7.支付成功 删除缓存中已经支付的商品
        let newCart = wx.getStorageSync("cart");
        newCart = newCart.filter(v=>!v.checked);
        wx.setStorageSync("cart", newCart);
        // 8.支付成功 跳转到订单页面
        wx.navigateTo({
          url: '/pages/order/index',
        });
      })
    } catch (error) {
      showToast({title:"支付失败"})
      console.log(error);
    }

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