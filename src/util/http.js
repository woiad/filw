import axios from 'axios'
import qs from 'qs'
axios.defaults.timeout = 6000 // 超时时间
axios.defaults.baseURL = 'http://113.105.246.230:5107'
// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    config.header = {
      'Content-type': 'multipart/form-data'
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
export function fetch (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
