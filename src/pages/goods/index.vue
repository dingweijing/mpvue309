<template>
  <div class="wrapper">
    <block v-if="goods">
      <!-- 商品图片 -->
      <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
        <swiper-item :key="index" v-for="(pic,index) in goods.pics">
          <image :src="pic.pics_big"></image>
        </swiper-item>

      </swiper>
      <!-- 基本信息 -->
      <div class="meta">
        <p class="price">￥{{goods.goods_price}}</p>
        <p class="name">{{goods.goods_name}}{{goods.goods_name}}</p>
        <p class="shipment">快递: 免运费</p>
        <span class="collect">收藏</span>
      </div>
      <!-- 商品详情 -->
      <div class="detail">
        <!--      v-html-->
        <div v-html="goods.goods_introduce"></div>
        <!--      <rich-text :nodes="goods.goods_introduce"></rich-text>-->
      </div>
      <!-- 操作 -->
      <div class="action">
        <button open-type="contact">联系客服</button>
        <span class="cart" @click="goCart">购物车</span>
        <span class="add" @click="addCart">加入购物车</span>
        <span class="buy">立即购买</span>
      </div>
    </block>
  </div>
</template>

<script>
  import request from '@/utils/request'
  export default {
    data () {
      return {
        goods_id: 0,
        goods: null,
        carts: []
      }
    },
    methods: {
      addCart () {
        //  购物车正常情形是需要通过请求 将商品信息存入到数据库
        let {
          goods_id,
          goods_name,
          goods_price,
          goods_small_logo
        } = this.goods
        // 就是购物车需要的商品信息
        //创建一个状态 flag  判断是否有相同id商品
        let flag = false
        //遍历数组forEach
        this.carts.forEach((val) => {
          if (val.goods_id == goods_id) {
            //  +1
            val.goods_number += 1
            flag = true
            return
          }
        })
        if (!flag) {
          this.carts.push({
            goods_id,
            goods_name,
            goods_price,
            goods_small_logo,
            goods_number: 1,
            //辅助数据
            goods_checked: true
          })
        }
        mpvue.setStorageSync('carts', this.carts)
        //提示信息
        mpvue.showToast({
          title: '添加成功!'
        })
      },
      goCart () {
        //switchTab
        mpvue.switchTab({
          url: '/pages/cart/main'
        })
      },
      async getGoodDetail () {
        const { message } = await request({
          url: '/api/public/v1/goods/detail',
          data: {
            goods_id: this.goods_id
          }
        })
        console.log(message, '@@@@@@@')
        this.goods = message
      }
    },
    onLoad (params) {
      //goods_id
      console.log(params)
      this.goods_id = params.id
      // API 获取商品详情
      this.getGoodDetail()
    }
  }
</script>

<style scoped lang="less">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }
  .pics {
    height: 720rpx;
  }
  .meta {
    height: 270rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;
    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 30rpx;
    }
    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }
    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      padding-top: 50rpx;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 22rpx;
      color: #999;
      position: absolute;
      right: 20rpx;
      top: 91rpx;
    }
  }
  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }
  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    span {
      display: block;
    }
    .add, .buy {
      width: 210rpx;
      text-align: center;
      line-height: 98rpx;
      font-size: 27rpx;
      color: #fff;
    }
    .add {
      background-color: #f4b73f;
    }
    .buy {
      background-color: #ea4451;
    }
    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;
      &::after {
        border: none;
      }
    }
    button, .cart {
      flex: 1;
      line-height: 1;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
      padding-top: 56rpx;
    }
  }
</style>