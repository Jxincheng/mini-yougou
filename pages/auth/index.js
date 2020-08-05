// pages/auth/index.js

import { request } from "../../request/index.js";
import { login } from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 点击 授权
  handleGetUserInfo(e) {
    try {
      // 1.获取用户信息
      let { encryptedData, rawData, iv, signature } = e.detail;
      let code;
      // 2.获取小程序登录成功后的code
      login().then(result=>{
        code = result.code;
      })
      let loginParams = { encryptedData, rawData, iv, signature, code };
      // 3.发送请求 获取用户token
      // request({url:"",data:loginParams,method:"post"})
      // .then(result=>{
      //   wx.setStorageSync("token", result.token);
      // })
      // 暂时写死一个token
      let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      wx.setStorageSync("token", token);
      // 4.关闭当前页面 返回上一页面
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
    
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