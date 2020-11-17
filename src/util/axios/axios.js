import axios from 'axios';
// 引入路由对象
import router from '../../router';
const http = axios.create({
  baseURL: '/api'
});

// 拦截器
// 请求拦截
http.interceptors.request.use(req => {
  //   console.log(req, '请求拦截');
  const userInfo = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {};
  req.headers.authorization = userInfo.token;
  return req
})

// 响应拦截
http.interceptors.response.use(res => {
  // console.log(res,'响应结果');
  // 你认为返回内容太多了，直接返回data
  // return res.data
  // 全局拦截错误
  if (res.data.code == 403) {
    alert(res.data.msg)
    // 全局拦截错误跳转到登录
    router.push('/login')
    return res
  } else if (res.data.code == 500) {
    alert(res.data.msg)
    return res
  } else {
    return res
  }
})


export default http;
