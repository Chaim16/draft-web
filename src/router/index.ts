import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import {
  HomeOutlined,
  SwapOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import UserRegister from "@/views/user/UserRegister.vue";
import UserLogin from "@/views/user/UserLogin.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "首页",
    meta: {
      icon: HomeOutlined,
    },
    component: HomeView,
  },
  {
    path: "/market",
    name: "画稿中心",
    meta: {
      icon: SwapOutlined,
    },
    component: HomeView,
  },
  {
    path: "/profile",
    name: "个人中心",
    meta: {
      icon: UserOutlined,
    },
    component: HomeView,
  },
  {
    path: "/release",
    name: "发布画稿",
    meta: {
      icon: PlusOutlined,
    },
    component: HomeView,
  },
  {
    path: "/user/register",
    name: "用户注册",
    component: UserRegister,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/user/login",
    name: "用户登录",
    component: UserLogin,
    meta: {
      hideInMenu: true,
    },
  },
];

export { routes };

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
