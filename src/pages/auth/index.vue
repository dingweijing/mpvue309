<template>
  <div>
    <button type="primary" @getuserinfo="getInfo" open-type="getUserInfo">微信登陆</button>
  </div>
</template>
<script>
  import request from '@/utils/request'
  import login from '@/utils/login'
  import getuserinfo from '@/utils/getuserinfo'
  import getsetting from '@/utils/getsetting'
  //getUserInfo
  //login
  // 获取是否授权过 getsetting
  //  getUserInfo
  export default {
    // 正常的登陆 是  表单 用户名密码
    // 小程序里面 通过api 一键获取当前登录这信息
    // 发送到 微信服务器 去验证 是否真的有这个用户
    methods: {
      getInfo (res) {
        console.log(res, '触发了 getuserinfo  事件.....')
        const {
          encryptedData,
          iv,
          rawData,
          signature
        } = res.target
        //发请求 login
        this.login(encryptedData,
          iv,
          rawData,
          signature)
      
    },
    async login (encryptedData,
      iv,
      rawData,
      signature) {
      const { code } = await login();
      // 发起请求 去登陆  request  拿到回调 不论对错  errmsg:'....'
      // 小程序 ( appid  123 )---->  服务器  ( appid  123 )----->   微信服务器
      const {message} = await request({
        url:"/api/public/v1/users/wxlogin",
        method:'post',
        data:{
          encryptedData,
          iv,
          rawData,
          signature,
          code
        }
      });
      //响应结果
      //user_id
      //user_sex
      //user_email
      //token
      //meta:{msg:'登陆成,status:200}
      console.log(message,'----');
      
      //记录登陆状态
      //mpvue.setStorageSync('token',message.token);
      mpvue.setStorageSync('token','message.token');

      //返回上一步操作
      mpvue.navigateBack();
      
      }
    },
    async onLoad () {
      //  通过 mpvue.getUserInfo() 获取当前登录这信息
      // mpvue.getUserInfo({
      //   success:function (info) {
      //     console.log(info,'通过api获取的 用户信息')
      //   }
      // })
      //检测授权
      const { authSetting } = await getsetting()
      //已授权  scope.userInfo
      console.log(authSetting)
      if (authSetting['scope.userInfo']) {
        // get user info 获取用户数据
        const {
          encryptedData,
          iv,
          rawData,
          signature
        } = await getuserinfo()
        //发送请求  去登陆
        this.login(encryptedData,
          iv,
          rawData,
          signature)
      }
    }
  }
</script>
<style></style>