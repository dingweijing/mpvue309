export  default function () {
    //将 mpvue.login 封装成  Promise
    return new Promise((resolve , reject) =>{
      mpvue.login({
        success(info){
          resolve(info);
        }
      })
    })
  }