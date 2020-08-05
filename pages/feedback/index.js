// pages/feedback/index.js
/* 
    点击 “+” 触发tap点击事件
      1、调用小程序内置的选择图片的 api
      2、获取到 图片的路径 数组
      3、把图片路径 存到data变量中
      4、页面就根据 图片数组 进行循环显示
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径
    chooseImgs: [],
    textVal: ""
  },
  // 外网的图片数组
  UploadImgs: [],
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

  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 点击 “+” 选择图片
  handleChooseImg() {
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式   原图   压缩
      sizeType: ['original','compressed'],
      // 图片的来源   相册  照相机
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          chooseImgs: [...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
  },
  // 删除图片
  handleRemoveImg(e) {
    let {index} = e.currentTarget.dataset;
    let {chooseImgs} = this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  // 点击 提交
  handleFormSubmit() {
    let {chooseImgs, textVal} = this.data;
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    if(chooseImgs.length != 0){
      // 上传图片   上传文件的 api 不支持多个文件同时上传
      // 遍历数组 挨个上传
      chooseImgs.forEach((v, i)=>{
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件 file
          name: "file",
          // 顺带的文本信息
          formData: {},
          success: (result)=>{
            let url = JSON.parse(result.data);
            this.UploadImgs.push(url);

            if(i===chooseImgs.length-1){
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              // 提交成功 重置页面
              this.setData({
                textVal: "",
                chooseImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      })
    }else {
      wx.hideLoading();
      // 返回上一个页面
      wx.navigateBack({
        delta: 1
      });
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