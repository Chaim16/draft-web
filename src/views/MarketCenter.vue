<template>
  <div class="container">
    <div class="product-list">
      <!-- 商品展示区 -->
      <div class="product-content">
        <a-row :gutter="[24, 24]" class="product-content-row">
          <a-col
            v-for="product in displayedProducts"
            :key="product.id"
            :xs="6"
            :sm="6"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <a-card hoverable>
              <template #cover>
                <a-image
                  :src="product.image"
                  :preview="false"
                  height="200px"
                  :fallback="fallbackImage"
                  lazy
                />
              </template>
              <a-card-meta>
                <template #title>
                  <div class="product-title">{{ product.name }}</div>
                </template>
                <template #description>
                  <div class="product-info">
                    <div class="price">¥{{ formatPrice(product.price) }}</div>
                    <div class="designer">
                      <user-outlined />
                      {{ product.designer }}
                    </div>
                  </div>
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="currentPage"
          :total="totalProducts"
          :page-size="pageSize"
          show-less-items
          show-quick-jumper
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { UserOutlined } from "@ant-design/icons-vue";

// 模拟数据（实际应通过API获取）
const mockProducts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `设计作品 ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 100,
  designer: `设计师 ${String.fromCharCode(65 + (i % 26))}`,
  image: `https://picsum.photos/300/200?random=${i}`,
}));

// 分页配置
const currentPage = ref(1);
const pageSize = ref(8);
const totalProducts = computed(() => mockProducts.length);

// 显示的商品数据
const displayedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return mockProducts.slice(start, end);
});

// 分页切换
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 价格格式化过滤器
const formatPrice = (value: number) => {
  return value.toFixed(2);
};

// 图片加载失败时使用的默认图
const fallbackImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 64px); /* 减去头部高度 */
  padding: 24px 0;
}

.product-list {
  width: 80%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 0;
  //min-height: calc(100vh - 64px - 60px); /* 保留安全高度 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 40px;
}

.product-content {
  flex: 1;
}

.product-content-row {
  margin-bottom: 0;
}

.product-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #ff4d4f;
  font-size: 18px;
  font-weight: bold;
}

.designer {
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-wrapper {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

:deep(.ant-card) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ant-card-cover) {
  background: #f5f5f5;
}

:deep(.ant-image-img) {
  object-fit: cover;
}
</style>
