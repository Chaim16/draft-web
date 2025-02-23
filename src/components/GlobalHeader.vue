<template>
  <div id="header">
    <div class="header-left">
      <img class="logo" src="@/assets/logo.svg" alt="logo" />
      <span class="system-name">在线画稿交易平台</span>
    </div>
    <div class="header-middle">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        :inlineCollapsed="false"
      >
        <a-menu-item
          v-for="item in filteredRoutes"
          :key="item.path"
          @click="handleMenuClick(item)"
        >
          <component
            :is="item.meta?.icon"
            v-if="item.meta?.icon"
            class="menu-icon"
          />
          {{ item.name }}
        </a-menu-item>
      </a-menu>
      <div class="search-wrapper">
        <a-input-search
          placeholder="搜索"
          style="width: 200px"
          class="search-input"
        />
      </div>
    </div>
    <div class="header-right">
      <div class="login-or-register" @click="router.push('/user/login')">
        {{ store.state.user?.loginUser?.username ?? "未登录" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { computed } from "vue";
import checkAccess from "@/utils/permission";

const route = useRoute();
const selectedKeys = computed(() => [route.path]);

const router = useRouter();
const store = useStore();

// 过滤有效菜单项
const filteredRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    return checkAccess(store.state.user?.loginUser, item.meta?.access);
  });
});

const handleMenuClick = (item: object) => {
  router.push({
    path: item.path,
  });
};
</script>

<style scoped>
#header {
  display: flex;
  align-items: center;
  height: 64px;
  background-color: #40ccff;
  color: white;
  padding: 0 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.header-left {
  display: flex;
  gap: 12px;
  margin-left: 20px;
}

.logo {
  height: 48px;
  margin: 10px;
}

.system-name {
  color: white;
  font-weight: 500;
  margin-right: 20px;
  font-size: clamp(16px, 1.2vw, 20px);
}

.header-middle {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  justify-content: space-between; /* 左右分开 */
  align-items: center;
  padding: 0 50px; /* 两侧留白 */
  min-width: 400px; /* 设置最小宽度防止过度挤压 */
  overflow: hidden; /* 防止内容溢出 */
}

/* 菜单 */
#header ::v-deep .ant-menu {
  background-color: #40ccff !important;
  border-bottom: none !important;
  gap: 8px;
}

/* 覆盖菜单项 */
#header ::v-deep .ant-menu-item {
  background-color: transparent !important;
  color: white !important;
  font-size: 16px !important;
}

/* 覆盖悬浮/选中状态背景色 */
#header ::v-deep .ant-menu-item:hover,
#header ::v-deep .ant-menu-item-selected {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* 更新后的搜索框样式 */
.search-wrapper {
  margin-left: auto;
  display: flex;
  align-items: center;
  width: 300px;
}

.search-input ::v-deep .ant-input {
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  padding: 8px 36px 8px 16px;
  color: white !important;
  transition: all 0.3s ease;
  height: 36px;
}

.search-input ::v-deep .ant-input:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.search-input ::v-deep .ant-input:focus {
  background: rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
}

.search-input ::v-deep .ant-input::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
  font-weight: 300;
}

.search-input ::v-deep .ant-input-search-button {
  right: 4px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: transparent !important;
  border: none !important;
  color: white !important;
}

.search-input ::v-deep .ant-input-search-button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.search-input ::v-deep .anticon-search {
  font-size: 16px;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .search-wrapper {
    width: 200px;
  }

  .search-input ::v-deep .ant-input {
    padding-right: 30px;
    height: 32px;
  }

  .search-input ::v-deep .ant-input-search-button {
    right: 2px;
    width: 28px;
    height: 28px;
  }
}

.search-input ::v-deep .ant-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* 右侧登录区域 */
.header-right {
  margin-left: auto; /* 关键属性 */
  display: flex;
  gap: 20px;
  align-items: center;
}

.header-right .login-or-register {
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin-right: 66px;
  margin-top: 5px;
}

.header-right .login-or-register:hover {
  opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .header-middle {
    padding: 0 20px;
  }

  .system-name {
    font-size: 18px;
  }
}

@media (max-width: 992px) {
  .search-wrapper {
    width: 200px;
  }
}
</style>
