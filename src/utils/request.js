import axios from 'axios'
import router from '@/router'
// import tool from '../utils/tools'
// import md5 from 'js-md5'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
// service.interceptors.request.use(
//   config => {
//     if (config.params !== undefined) {
//       const key = 'QcnKm3h3J9ITiSveVFoKJdW1SnlGNaDJ'
//       const obj = tool.sortObject(config.params)
//       let kkk = ''
//       for (const key in obj) {
//         kkk += key + '=' + obj[key]
//       }
//       config.params.sign = md5(kkk + key)
//       // config.params.sign = kkk + key
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     // console.log(error, '请求拦截') // for debug
//     return Promise.reject(error)
//   }
// )

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.errNo !== 0) {
      // console.log(res.msg || '发生未知错误请重试！')
      if (res.errNo === 1) {
        router.replace({
          path: 'login',
          query: { redirect: router.currentRoute.fullPath }
        })
      }
      // return Promise.reject(new Error(res.msg || 'Error'))
      // return Promise.reject(res.msg || 'Error')
      return res
    } else {
      return res
    }
  },
  error => {
    // console.log('err' + error) // for debug
    const timeout = error.message.indexOf('timeout') > -1 // for timeout
    const netWork = error.message.indexOf('Network Error') > -1
    if (netWork) {
      console.log('网络错误，请刷新重试')
    } else if (timeout) {
      console.log('服务器正忙，请刷新重试')
    } else {
      console.log('未知错误')
    }
    return Promise.reject(error)
  }
)
export default service
