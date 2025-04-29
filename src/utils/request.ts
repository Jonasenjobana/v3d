import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 定义后端返回数据类型
type ResponseData<T> = {
  data: T;
  info: string;
  rlt: number;
};

// 封装 GET 请求
export const getRequest = async <T>(url: string, params?: Record<string, any>) => {
  try {
    const response = await api.get<ResponseData<T>>(url, { params });
    handleResponse(response.data);
    return response.data.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
};

// 封装 POST 请求
export const postRequest = async <T>(url: string, data?: Record<string, any>) => {
  try {
    const response = await api.post<ResponseData<T>>(url, data);
    handleResponse(response.data);
    return response.data.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
};

// 处理响应结果
const handleResponse = (response: ResponseData<any>) => {
  if (response.rlt === 1) {
    throw new Error(response.info);
  }
};