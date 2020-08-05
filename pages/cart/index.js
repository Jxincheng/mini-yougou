// pages/cart/index.js
/*
  获取用户的收货地址
      1.绑定点击事件
      2.获取用户对小程序所授予获取地址的权限 状态 scope
          a.假设用户点击获取收货地址的提示框 确定  authSetting  scope.address
              scope 值 true      直接调用 获取收货地址
          b.假设用户从没调用过收货地址的api
              scope   undefined  直接调用 获取收货地址
          c.假设用户点击获取收货地址的提示框 取消
              scope 值 false
              （1）诱导用户自己打开授权页面（wx.openSetting）  给与获取地址权限（wx.getSetting）
              （2）获取收货地址（wx.chooseAddress）
  
  onShow 
    1.获取缓存中的购物车数据
    2.把购物车数据填充到data中

  全选的实现 数据的提示
    1.获取缓存中的购物车数据
    2.根据购物车数据  所有的商品都被选中  checked=true 全选就被选中

  总价格  总数量
    1.需要商品被选中，才拿它计算
    2.判断商品是否被选中
    3.总价格 += 商品的单价 + 商品的数量
    4.总数量 += 商品的数量
    5.把计算的价格和数量 设置会data中

  商品的选中功能
    1.绑定change事件
    2.获取到被修改的商品对象
    3.商品对象的选中状态 取反
    4.重新填充回data和缓存中
    5.重新计算全选，总价格，总数量
  
  全选和反选
    1.全选框绑定事件 change
    2.获取data中的全选变量 allChecked
    3.直接取反 allChecked=!allChecked
    4.遍历购物车数组 让里面的商品选中状态跟随 allChecked 改变而改变
    5.把购物车数组和allChecked 重新设置回data和缓存中
*/
import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 点击获取收货地址
  handleChooseAddress() {
    // 1.获取权限
    wx.getSetting({
      success: (result)=>{
        let scopeAddress = result.authSetting["scope.address"];
        if(scopeAddress===true||scopeAddress===undefined){
          // 2.获取收货地址
          wx.chooseAddress({
            success: (result1)=>{
              let address = result1;
              address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
              // 存入到缓存中
              wx.setStorageSync("address", address);
            }
          });
        }else {
          // 3.用户以前拒绝过授予权限  先诱导用户打开授权页面
          wx.openSetting({
            success: (result2)=>{
              // 4.可以调用  获取收货地址代码
              wx.chooseAddress({
                success: (result3)=>{
                  let address = result3;
                  address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
                  // 存入到缓存中
                  wx.setStorageSync("address", address);
                }
              });
            }
          });
        }
      }
    });

   
    // async 写法
    // try {
    //   // 1.获取权限
    //   let res1 = await getSetting();
    //   let scopeAddress = res1.authSetting["scope.address"];
    //   // 2.判断权限状态
    //   if (scopeAddress === false){
    //     await openSetting();
    //   }
    //   // 3.调用获取收货地址api
    //   let res2 = await chooseAddress();
    //   console.log(res2);
    // } catch (error) {
    //   console.log(error);
    // }
    
  },
  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品id
    let goods_id = e.currentTarget.dataset.id;
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },
  // 设置购物车状态 重新计算
  setCart(cart){
    let allChecked = true;
    let totalPrice = 0,totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else {
        allChecked = false;
      }
    })
    allChecked = cart.length!=0 ? allChecked : false;
    // 赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
  // 商品的全选
  handleItemAllChange() {
    let {cart,allChecked} = this.data;
    allChecked = !allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },
  // 商品数量编辑
  handleItemNumEdit(e) {
    let {operation,id} = e.currentTarget.dataset;
    let {cart} = this.data;
    let index = cart.findIndex(v=>v.goods_id===id);
    if(cart[index].num === 1 && operation===-1){
      showModal({content: "您是否要删除？"})
      .then(result=>{
        if(result.confirm){
          cart.splice(index,1);
          this.setCart(cart);
        }
      })
    }else {
      cart[index].num+=operation;
      this.setCart(cart);
    }
  },
  // 点击 结算
  handlePay() {
    const {address,totalNum} = this.data;
    // 1、判断用户有没有选购商品
    if(totalNum === 0){
      showToast({title:"您还没有选购商品"})
      return;
    }
    // 2、判断收货地址
    if(!address.userName){
      showToast({title:"您还没有选择收货地址"})
      return;
    }
    // 3、跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
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

    this.setData({
      address
    })

    this.setCart(cart);
    // // 计算全选
    // let allChecked = true;
    // let totalPrice = 0,totalNum = 0;
    // cart.forEach(v=>{
    //   if(v.checked){
    //     totalPrice+=v.num*v.goods_price;
    //     totalNum+=v.num;
    //   }else {
    //     allChecked = false;
    //   }
    // })
    // allChecked = cart.length!=0 ? allChecked : false;
    // // 赋值
    // this.setData({
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
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