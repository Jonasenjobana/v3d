import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: '', // 设置请求的基础 URL
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如添加 token 到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = ` ${token}`;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const res = response.data;
    // 这里可以根据业务需求进行状态码判断
    if (res.code!== 200) {
      console.log('请求失败：', res.message);
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    // 对响应错误做点什么
    console.log('响应错误：', error);
    return Promise.reject(error);
  }
);

// 封装请求方法
export const axiosHttpRequest = {
  get(url: string) {
    return service.get(url,{});
  },
  post(url: string, data: any) {
    return service.post(url, data);
  }
};
export const request = {
    get(url: string) {
    }
}