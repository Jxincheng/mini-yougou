//index.js

// 引入用来发送请求的方法
import { request } from "../../request/index.js";

//获取应用实例
const app = getApp()

Page({
  data: {
    swiperList: [],
    cateList: [],
    floorList: []
  },
  onLoad: function () {
    // 发送异步请求获取轮播图数据  优化的手段可以通过promise来解决
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     // console.log(result);
    //     let list = result.data.message;
    //     this.setData({
    //       swiperList: list
    //     })
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();

    // promise的练习使用
    // this.getList();
  },
  // 演示promise的链式调用
  getList() {
    request({url: '/home/swiperdata'})
    .then(result=>{
      console.log("链式调用1：",result);
      return request({url: '/home/catitems'}) 
    })
    .then(result=>{
      console.log("链式调用2：",result);
    })
  },
  // 获取轮播图数据
  getSwiperList() {
    request({url: '/home/swiperdata'})
    .then(result=>{
      let list = result.data.message;
      this.setData({
        swiperList: list
      })
    })
  },
  // 获取分类导航数据
  getCateList() {
    request({url: '/home/catitems'})
    .then(result=>{
      let list = result.data.message;
      this.setData({
        cateList: list
      })
    })
  },
  // 获取楼层数据
  getFloorList() {
    request({url: '/home/floordata'})
    .then(result=>{
      let list = result.data.message;
      this.setData({
        floorList: list
      })
    })
  }
})
