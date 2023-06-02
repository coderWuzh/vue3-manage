import type { AxiosRequestConfig } from 'axios'
import axios from "axios";
export default {
  common: {
    method: 'GET',
    data: {},
    params: {},
    headers: {},
    baseURL: 'http://8.130.121.204:3000/admin', 
  },
  $axios(options:AxiosRequestConfig) {
    options.method = options.method || this.common.method;
    options.data = options.data || this.common.data;
    options.params = options.params || this.common.params;
    options.headers = options.headers || this.common.headers;
    options.baseURL = options.baseURL || this.common.baseURL;
    return axios(options).then(v => {
      let data = v.data.data;
      return new Promise((res, rej) => {
        if (!v) return rej();
        res(data)
      })
    })
  }
}
