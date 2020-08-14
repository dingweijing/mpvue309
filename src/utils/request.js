export default function (obj) {
    //对请求进行封装 优化
    //url   method   data
    //对参数处理
  
    let url = obj.url || '';
    let method = obj.method || 'get';
    let data = obj.data || {};
    let header = obj.header || {};

    // 配置服务器地址
    url = 'https://www.uinav.com' + url;
  
    // var s = new Date()
    // d.xx
    //
    // var xhr = new XMLHttpRequest()
    // xhr.xx
    //
    // var p = new Promise()
    // p.xx
  
    //优化异步请求 success里面再有请求
    return new Promise((resolve,reject)=>{//暴露给function
  
      // 发起请求
      mpvue.showLoading({title:"正在加载..."})
      mpvue.request({
        url,
        method,
        data,
        header,
        success(info){
          resolve(info.data)//暴露数据

          //关闭加载框
          mpvue.hideLoading();
        }
      })
    })
  }