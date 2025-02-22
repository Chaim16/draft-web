import { StoreOptions } from "vuex";
import api from "@/api/api";
import { message } from "ant-design-vue";

export default {
  namespaced: true,

  // state：存储的状态信息，比如用户信息
  state: () => ({
    loginUser: {
      username: "未登录",
      role: "unknown",
    },
    isAuthenticated: false, // 用于标识用户是否已登录
  }),

  // actions：执行异步操作，并且触发mutation的更改，（调用mutation）
  actions: {
    async getLoginUser({ commit }) {
      try {
        const res = await api.whoami();
        if (res.code === 0) {
          const loginUser = {
            username: res.data.username,
            role: res.data.role,
          };
          commit("updateUser", loginUser);
          commit("setAuthenticated", true);
          localStorage.setItem("isAuthenticated", "true");
        }
      } catch (e) {
        message.error("获取用户信息失败");
        console.error("获取用户信息失败", e);
      }
    },

    async logout({ commit }) {
      commit("updateUser", { username: "未登录", role: "unknown" });
      commit("setAuthenticated", false);
      localStorage.removeItem("isAuthenticated");
    },
  },

  // mutations：提供更新状态值的方法
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
    setAuthenticated(state, isAuthenticated: boolean) {
      state.isAuthenticated = isAuthenticated;
    },
  },
} as StoreOptions<any>;
