export  default function () {
    //将 mpvue.userGetInfo 封装成  Promise
    return new Promise((resolve , reject) =>{
      mpvue.getUserInfo({
        success(info){
          resolve(info);
        }
      })
    })
  }