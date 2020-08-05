// pages/goods_detail/index.js
/* 
  点击轮播图  预览大图
      1.绑定点击事件
      2.调用小程序的api  previewImage

  点击加入购物车
      1.绑定点击事件
      2.获取缓存中的购物车数据 数组格式
      3.先判断当前的商品是否已经存在于购物车
      4.已经存在  修改商品数据  重新把购物车数组填充回缓存中
      5.不存在于购物车数组中 直接给购物车数组添加一个新元素  新元素带上购买数量属性  填充回缓存
      6.弹出提示
*/
// 引入用来发送请求的方法
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },
  goodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let {goods_id} = options;
    // this.getGoodsDetail(goods_id);
  },
  // 获取商品详情数据
  getGoodsDetail(goods_id) {
    request({url: "/goods/detail",data:{goods_id}})
    .then(result=>{
      let obj = result.data.message;
      this.goodsInfo = obj;
      // 获取缓存中的商品收藏的数组
      let collect = wx.getStorageSync("collect")||[];
      let isCollect = collect.length>0&&collect.some(v=>v.goods_id===this.goodsInfo.goods_id);

      this.setData({
        goodsObj: {
          goods_name: obj.goods_name,
          goods_price: obj.goods_price,
          // iphone部分手机 不识别 webp图片格式
          // 最好找到后台 让他进行修改
          // 临时自己改 确保后台存在 1.webp => 1.jpg
          goods_introduce: obj.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics: obj.pics
        },
        isCollect
      })
    })
  },
  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    // 先构造要预览的图片数组
    let urls = this.goodsInfo.pics.map(v=>v.pics_mid);
    // 获取所点击图片的url
    let current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls
    });
  },
  // 点击加入购物车
  handleAddCart() {
    // 1.获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    if(index===-1){
      // 3.不存在购物车数据
      this.goodsInfo.num = 1;
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo);
    }else {
      // 4.存在购物车数据
      cart[index].num++;
    }
    // 5.填充回缓存中
    wx.setStorageSync("cart", cart);
    // 6.弹窗提示
    wx.showToast({ 
      title: '加入成功',
      icon: 'success',
      mask: true  // 防止用户手抖 疯狂点击按钮
    });
  },
  // 点击 收藏
  handleChangeCollect() {
    let {isCollect} = this.data;
    let collect = wx.getStorageSync("collect")||[];
    let index = collect.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    if(isCollect){
      collect.splice(index,1);
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      collect.push(this.goodsInfo);
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect: !isCollect
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
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    let {goods_id} = options;
    this.getGoodsDetail(goods_id);
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