import type { AxiosRequestConfig } from 'axios'
import axios from "axios";
export default {
  common: {
    method: 'GET',
    data: {},
    params: {},
    headers: {},
  },
  $axios(options:AxiosRequestConfig) {
    options.method = options.method || this.common.method;
    options.data = options.data || this.common.data;
    options.params = options.params || this.common.params;
    options.headers = options.headers || this.common.headers;

    return axios(options).then(v => {
      let data = v.data.data;
      return new Promise((res, rej) => {
        if (!v) return rej();
        res(data)
      })
    })
  }
}
