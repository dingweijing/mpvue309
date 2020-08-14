export  default function () {
    //将 mpvue.getSetting 封装成  Promise
    return new Promise((resolve , reject) =>{
      mpvue.getSetting({
        success(info){
          resolve(info);
        }
      })
    })
  }