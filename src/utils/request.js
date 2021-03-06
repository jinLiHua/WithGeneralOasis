import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '../store'
import {
  baseUrl
} from '@/utils/tip'
import {
  getToken,
  removeToken
} from '@/utils/auth'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 创建axios实例
const service = axios.create({
  // timeout: 60000, // 请求超时时间,
  baseURL: baseUrl() // api的base_url
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error

  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    if (res.status !== 1) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      });
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.status == 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          /* store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          }) */
          removeToken('token');
          removeToken('name');
          removeToken('SET_ROUTERS');
          location.reload(); // 为了重新实例化vue-router对象 避免bug

        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  }
);

export default service
