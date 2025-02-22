import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
});

export interface ApiResponse {
  code: number;
  message: string;
  data: object;
}

// 刷新 Token 请求接口
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("没有找到 refresh_token");
    }
    const response = await axios.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    const { access, refresh } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    return response.data;
  } catch (error) {
    console.error("刷新 Token 失败:", error);
    throw error;
  }
};

// Axios 请求拦截器：自动附加 access token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器：检测 token 是否过期并尝试刷新
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 如果 access token 过期，尝试使用 refresh token 刷新
      try {
        await refreshToken();
        const originalRequest = error.config;
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${localStorage.getItem("access_token")}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("刷新 Token 失败:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
