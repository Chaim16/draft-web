import { StoreOptions } from "vuex";

export default {
  namespaced: true,

  // state：存储的状态信息，比如用户信息
  state: () => ({
    loginUser: {
      username: "未登录",
      role: "unknown",
    },
  }),

  // actions：执行异步操作，并且触发mutation的更改，（调用mutation）
  actions: {
    // async getLoginUser({ commit, state }, payload) {
    //   const res = await UserControllerService.getLoginUserUsingGet();
    //   if (res.code === 0) {
    //     commit("updateUser", res.data);
    //   } else {
    //     commit("updateUser", {
    //       ...state.loginUser,
    //       userRole: ACCESS_ENUM.NOT_LOGIN,
    //     });
    //   }
    // },
  },

  // mutations：提供更新状态值的方法
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
