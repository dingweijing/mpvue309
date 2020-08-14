<template>
  <div>
    <!-- 筛选 -->
    <div class="filter">
      <span class="active">综合</span>
      <span>销量</span>
      <span>价格</span>
    </div>
    <!-- 商品列表 -->
    <scroll-view  @scrolltolower="getMore" class="goods" scroll-y>
      <div class="item" :key="index" v-for="(goods,index) in goodsList">
        <!-- 商品图片 -->
        <image class="pic" :src="goods.goods_small_logo"></image>
        <!-- 商品信息 -->
        <div class="meta">
          <p class="name">{{goods.goods_name}}</p>
          <p class="price"><span>￥</span>{{goods.goods_price}}<span>.00</span></p>
        </div>
      </div>

      <div class="tips" v-if="loaded && !goodslist.length">没有找到相关商品</div>
    </scroll-view>
  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    data(){
      return {
        query:'',
        goodsList:[],
        page:1,
        size:5,
        total:1,
        loaded:false,
      }
    },
    methods:{
      async getList(params){
        //无数据时 停止加载
        if(this.goodsList.length == this.total) return;
        const {message} = await request({
          url:'/api/public/v1/goods/search',
          data:{
            query:params.query,
            pagenum:this.page,
            pagesize:this.size
          }
        })
        console.log(message);
        //做下拉加载 要保留之前的数据
        //arr.push(arr2)  [1,2,3,[4,5,6]]
        //arr.concat(arr2) [1,2,3,4,5,6]
        this.goodsList = this.goodsList.concat(message.goods);

        //记录一下loaded状态
        this.loaded=true;
                
        //数据库获取的分页相关
        this.total = message.total || 1
      },
      getMore(){
        //参数
        let params = {
          query:this.query
        }
        this.page += 1;
        //调用getList
        this.getList(params)
      }
    },
    
    //接收参数(分类页传过来的参数)
    onLoad(params){
      console.log(params);
      this.query = params.query;
      //查询列表
      this.getList(params);
    },

    //不能是区域滚动
    // onReachBottom(){
    //   console.log('触底了....');
    // }
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;
    span {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;
      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }
  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;
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
  }
</style>
