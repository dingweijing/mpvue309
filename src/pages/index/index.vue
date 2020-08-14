<template>
<!-- 动态获取data里的windowHeight -->
  <div :style="{height:windowHeight,overflow:'hidden'}">
    <!-- 自定义组件 -->
    <search @search="disableScroll" />
    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, .6)" indicator-active-color="#fff" autoplay circular interval="3000">
      <swiper-item :key="index" v-for="(banner,index) in bannerList">
        <a :href="'/pages/goods/main?id=' + banner.goods_id">
          <img :src="banner.image_src" alt="">
        </a>
      </swiper-item>

    </swiper>
 
  <!-- 主导航 -->
     <div class="navs">
       <!-- 如果navigator 跳转的路径是tabBar上的页面，那么不可以直接实现跳转 -->
       <!-- 必须指定navigator的跳转方式 switchTab -->
      <a :open-type=" nav.open_type || 'navigate'" :href="nav.open_type ? '/pages/category/main' : '/pages/list/main?query=' + nav.name" :key="index" v-for="(nav,index) in navList">
        <img :src="nav.image_src" />
      </a>
    </div>
  <!-- 楼层 -->
    <div class="floors">
      <div class="floor" :key="index" v-for="(floor,index) in floorList">
        <!-- 标题 -->
        <div class="title">
          <img :src="floor.floor_title.image_src" alt="">
        </div>
        <!-- 分类 -->
        <div class="items">
          <a :href="'/pages/list/main?query=' + product.name" :key="key" v-for="(product,key) in floor.product_list">
            <img :src="product.image_src" alt="">
          </a>
        </div>
      </div>
    </div>

    <!-- 回到顶部 -->
    <!-- window.scrollTo(0,0) -->
    <!-- <a href="#"></a> -->
    <p class="goTop" @click="goTop" v-show="scrollTop >200"></p>
  </div>
</template>

<script>
//导入自定义组件
import search from '@/components/search'
import request from '@/utils/request'

export default {
  data(){
    return{
      windowHeight:'auto',
      bannerList:[],
      navList:[],
      floorList:[],
      scrollTop:0
    }
  }, 
  //注册主件
  components:{
    search
  },
  methods:{
    goTop(){
      //显示和隐藏

      //调用API 可以动态设置页面滚动的高度
      mpvue.pageScrollTo({scrollTop:0})
    },

    disableScroll(ev){
      //____子组件拿到的真正的值
      this.windowHeight = ev.windowHeight +'px';
    },
    async getBannerList(){
      //请求接口
      // mpvue.request({
      //   url:'https://www.uinav.com/api/public/v1/home/swiperdata',
      //   success:(info)=>{
      //     console.log(info);
      //   }
      // })

      const {message} = await request({
        url:'/api/public/v1/home/swiperdata'
      })
      console.log(message,'bbbbbbbbb');
      //数据更新
      this.bannerList = message;
    },

    async  getNavList(){
      const {message} = await request({
        url:'/api/public/v1/home/catitems'
      })
      console.log(message,'nnnnnnnnn');
      
      this.navList = message;
    },

    async getFloorList(){
      const {message} = await request({
        url:'/api/public/v1/home/floordata'
      })
      this.floorList = message;
      console.log(message,'fffffffff');
      
    }
  },
  // onPullDownRefresh(){
  //   //刷新
  //   this.getBannerList();
  //   this.getNavList();
  //   this.getFloorList();

  //   //结束下拉刷新动画
  //   mpvue.stopPullDownRefresh();
  // },
  onPageScroll(ev){
    console.log(ev);
    this.scrollTop = ev.scrollTop
  },
  onShareAppMessage(){
    //实现监听方法就相当于开启了...的分享功能

    //自定义分享内容
    return {
      title:'这里有好货，快来看',
      path:'/pages/index/main',
      imageUrl:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2195825030,2463063319&fm=26&gp=0.jpg'
    }
  },
  mounted(){
    //使用接口
    //axios xhr this.request

    this.getBannerList();
    this.getNavList();
    this.getFloorList();
  }

  // created(){//mpvue  不能随着页面的启动而被调起 不适用了 小程序一出现的时候就启动
  //   console.log('首页启动了');
  // }
}
</script>
  
<style scoped lang="less">
//焦点图
  .banner{
    height: 340rpx;
    a{
      display: block;
      height: 340rpx;
    }
  }
//主导航
.navs{
  display: flex;
  align-items: center;
  justify-content: space-between;/*两端对齐*/
  height: 192rpx;
  padding:0 36rpx;
  // background-color: pink;
  a{
    width:128rpx;
    height: 140rpx;
  }
}

//楼层
.floor{
  .title{
    width: 750rpx;
    height: 60rpx;
    padding: 30rpx 0 0 15rpx;
    background-color: #f4f4f4;
  }
  .items{
    padding: 20rpx 16rpx;
    overflow: hidden;
    a{
      float: left;
      margin-left:10rpx;
    //前两个
    // 0 --> 2  1 --> 1  2 --> 0
    //&：nth-child(-n+2){}
    //在a标签里面还要选a标签
      &:nth-last-child(-n+2){//后两个
        margin-top: 10rpx;
      }
      &:first-child{
        width: 232rpx;
        height: 386rpx;
        margin-left: 0;
      }
      &:nth-child(2),
      &:nth-child(5){
        width: 273rpx;
        height: 188rpx;
      }
      &:nth-child(3),
      &:nth-child(4){
        width: 193rpx;
        height: 188rpx;
      }
    }
  }
  &:first-child{//第一个楼层
    a{
      width: 233rpx !important;
      height: 188rpx;
    }
  }
}

  .goTop{
    position: fixed;
    right: 40rpx;
    bottom: 40rpx;
    width: 100rpx;
    height: 100rpx;
    background-color: pink;
    border-radius: 50%;
  }
</style>
