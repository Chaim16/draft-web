import axiosInstance from "@/utils/axios";

const api = {
  userRegister: async (body: object) => {
    const res = await axiosInstance.post("/market/api/v1/user/register/", body);
    return res.data;
  },
  userLogin: async (body: object) => {
    const res = await axiosInstance.post("/api/token/", body);
    return res.data;
  },
  whoami: async () => {
    const res = await axiosInstance.get("/market/api/v1/user/whoami/");
    return res.data;
  },
  crawler: async (params: object) => {
    const res = await axiosInstance.get("/market/api/v1/home/crawler/", {
      params,
    });
    return res.data;
  },
};

export default api;
