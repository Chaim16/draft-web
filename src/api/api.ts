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
  userDetail: async () => {
    const res = await axiosInstance.get("/market/api/v1/user/user_detail/", {});
    return res.data;
  },
  userModify: async (body: object) => {
    const res = await axiosInstance.post("/market/api/v1/user/modify/", body);
    return res.data;
  },
  designerApplicationRecord: async () => {
    const res = await axiosInstance.get(
      "/market/api/v1/user/designer_application_record/"
    );
    return res.data;
  },
  applyAsDesigner: async (body: object) => {
    const res = await axiosInstance.post(
      "/market/api/v1/user/apply_as_designer/",
      body
    );
    return res.data;
  },
};

export default api;
