<template>
  <div class="wrapper">

    <block v-if="carts.length">
      <!-- 收货信息 -->
      <dl class="shipment">
        <block v-if="address">
          <dt>收货人:</dt>
          <dd class="meta">
            <span class="name">{{address.userName}}</span>
            <span class="phone">{{address.telNumber}}</span>
          </dd>
          <dt>收货地址:</dt>
          <dd>黑龙江省哈尔滨市南岗区</dd>
        </block>
        <!--     button   获取地址-->
        <button v-else type="primary" @click = "chooseAddress" >获取收货地址</button>
      </dl>
      <!-- 购物车 -->
      <div class="carts">

        <div class="item">
          <!-- 店铺名称 -->
          <div class="shopname">生活馆</div>

          <div class="goods" :key="index" v-for="(item , index) in carts">
            <!-- 商品图片 -->
            <image class="pic" :src="item.goods_small_logo"></image>
            <!-- 商品信息 -->
            <div class="meta">
              <p class="name">{{item.goods_name}}</p>
              <p class="price"><span>￥</span>{{item.goods_price}}<span>.00</span></p>
              <!-- 加减 -->
              <div class="amount">
                <span class="reduce" @click="changeNumber(-1,index)">-</span>
                <input type="number" :value="item.goods_number" class="number">
                <span class="plus" @click="changeNumber(1,index)">+</span>
              </div>
            </div>
            <!-- 选框 -->
            <span class="checkbox" @click="toggle(index)">
            <icon type="success" size="20" :color="item.goods_checked ? '#ea4451' : '#ccc'"></icon>
          </span>
          </div>

        </div>

      </div>
      <!-- 其它 -->
      <div class="extra">
        <label class="checkall">
          <icon type="success" :color="carts.length == checkedGoods.length ? '#ea4451' : '#ccc'" size="20"></icon>
          全选
        </label>
        <div class="total">
          合计: <span>￥</span><label>{{amount}}</label><span>.00</span>
        </div>
        <div class="pay" @click="pay">结算({{checkedGoods.length}})</div>
      </div>
    </block>
    <div class="tips" v-else> 空空如也 ~ 快去shoping ~~</div>
  </div>
</template>


<script>
import request from '@/utils/request'
  export default {
    data () {
      return {
        carts: [],
        //地址
        address: null
      }
    },
    computed: {
      // 总数容器 total
      // 遍历数组 , 取出每一个 被选中的 商品的 price , goods_number
      checkedGoods () {
        return this.carts.filter((val) => {
          return val.goods_checked
        })
      },
      amount () {
        let total = 0
        this.checkedGoods.forEach((val => {
          total += val.goods_price * val.goods_number
        }))
        return total
      },

      //详细地址
      detailAddress(){
        return this.address && this.address.provinceName + this.address.cityName +this.address.countyName + this.address.detailInfo
      }
    },
    methods: {
      chooseAddress(){
        mpvue.chooseAddress({
          success:(info)=>{
            console.log(info);
            this.address = info;
          }
        })
      },
      async pay () {
        //结算 , 生成订单
        //1.检测是否填写了地址
        //null false
        if (!this.address) return mpvue.showToast({ title: '地址不能为空' })
        //2.检测是否选择了商品
        //如果为空，直接return
        if (!this.checkedGoods.length) return mpvue.showToast({ title: '至少一个商品' })
        //3.检测是否登陆
        if(!mpvue.getStorageSync('token')){
          // 需要真的跳转到登陆页去
          return mpvue.navigateTo({url:"/pages/auth/main"})
        }
        //4.生成订单
        const {message,meta} = await request({
          url:'/api/public/v1/my/orders/create',
          methods:'post',
          //已经登陆了，必须携带有效token
          header:{Authorization:mpvue.getStorageSync('token')},
          data:{
            order_price:this.amount,
            consignee_addr:this.detailAddress,
            goods:this.checkedGoods
          }
        })
        console.log(meta,'****')
        //跳转到订单页
       // meta.status =200;
        //if(meta.status == 200){
          return mpvue.navigateTo({//成功停止不往下进行
            url:'/pages/order/main'
          })
        //}

        //错误提示
        //mpvue.showToast({title:'创建订单失败！'})
      },
      toggle (index) {
        //切换 选中状态
        // console.log(98765)
        this.carts[index].goods_checked = !this.carts[index].goods_checked
        mpvue.setStorageSync('carts', this.carts)
      },
      changeNumber (step, index) {
        //不合法
        if (step == -1 && this.carts[index].goods_number <= 1) return
        // 库存 7
        if (step == 1 && this.carts[index].goods_number >= 7) return
        // 修改数量
        this.carts[index].goods_number += step
        mpvue.setStorageSync('carts', this.carts)
      }
    },
    onShow () {
      //正常情形下  , 需要发送接口
      //读取本地购物车信息
      this.carts = mpvue.getStorageSync('carts') || []
    }
  }
</script>


<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(https://zhaorq7.github.io/mpResource309/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    dt {
      width: 140rpx;
      float: left;
      clear: both;
    }
    dd {
      padding-left: 160rpx;
    }
    .meta {
      padding-right: 50rpx;
    }
    span.phone {
      float: right;
    }
  }
  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;
    .item {
      margin-top: 20rpx;
    }
    .shopname {
      padding: 30rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }
    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
      position: relative;
      span.checkbox {
        display: block;
        width: 101rpx;
        height: 100%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: -100rpx;
        top: 0;
      }
      &:last-child {
        border-bottom: none;
      }
      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }
      .meta {
        flex: 1;
        font-size: 27rpx;
        color: #333;
        position: relative;
      }
      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .price {
        position: absolute;
        bottom: 0;
        color: #ea4451;
        font-size: 33rpx;
        span {
          font-size: 22rpx;
        }
      }
      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;
        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        span {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }
        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }
  .extra {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;
    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;
      icon {
        margin-right: 20rpx;
      }
    }
    .total {
      display: flex;
      justify-content: center;
      flex: 1;
      label, span {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }
      span {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;
        &:first-child {
          margin-left: 10rpx;
        }
      }
    }
    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
  .tips{
      font-size: 36rpx;
      color: #666666;
      text-align: center;
      margin-top: 100rpx;
    }
</style>